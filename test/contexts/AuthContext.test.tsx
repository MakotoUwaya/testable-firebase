import type { User } from "firebase/auth";
import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";

const useAuthStateMock = vi.fn();
vi.mock("@/hooks/useAuthState", () => {
  return {
    useAuthState: useAuthStateMock,
  };
});

const getUserMock = vi.fn();
const addUserMock = vi.fn();
vi.mock("@/lib/user", () => {
  return {
    getUser: getUserMock,
    addUser: addUserMock,
  };
});

const setUserSecretMock = vi.fn();
vi.mock("@/lib/userSecret", () => {
  return {
    setUserSecret: setUserSecretMock,
  };
});

const signInGoogleWithPopupMock = vi.fn();
const signOutMock = vi.fn();
const getFcmTokenMock = vi.fn();
vi.mock("@/lib/firebase", async () => {
  const firebase = await vi.importActual<object>("@/lib/firebase");
  return {
    ...firebase,
    signInGoogleWithPopup: signInGoogleWithPopupMock,
    signOut: signOutMock,
    getFcmToken: getFcmTokenMock,
  };
});

describe("AuthProvider", async () => {
  const { useAuth, AuthProvider } = await import("@/contexts/AuthContext");
  const AuthedScreen = () => {
    const { currentUser } = useAuth();
    return <div>`${currentUser?.displayName}でログインできました`</div>;
  };
  const TestComponent = () => (
    <AuthProvider>
      <AuthedScreen />
    </AuthProvider>
  );

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  test("認証済みの場合、ユーザーのコンテキストデータが取得できる", async () => {
    useAuthStateMock.mockReturnValue([
      { uid: "test-user-uid", displayName: "てすたろう" } as User,
      false,
      undefined,
    ]);
    const { getByText } = render(<TestComponent />);
    await waitFor(() =>
      expect(
        getByText("てすたろうでログインできました", { exact: false }),
      ).toBeTruthy(),
    );
  });
  test("未認証の場合、ログイン画面が表示される", async () => {
    useAuthStateMock.mockReturnValue([null, false, undefined]);
    render(<TestComponent />);
    await waitFor(() =>
      expect(screen.getByText("ログインしてください")).toBeTruthy(),
    );
  });
  test("認証中の場合、ローディング画面が表示される", async () => {
    useAuthStateMock.mockReturnValue([null, true, undefined]);
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByText("loading...")).toBeTruthy());
  });
});

describe("useAuth", async () => {
  const { useAuth } = await import("@/contexts/AuthContext");

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('初めてのログインの場合', () => {
    beforeEach(() => {
      signInGoogleWithPopupMock.mockResolvedValue({
        user: { uid: 'test-user-uid', displayName: 'てすたろう', photoURL: null },
      });
      getUserMock.mockResolvedValue({ isExist: false });
      getFcmTokenMock.mockResolvedValue('test-token');
    });

    test("ユーザー情報が登録される", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signInWithGoogle();
      });
      expect(addUserMock).toBeCalledWith({
        uid: "test-user-uid",
        displayName: "てすたろう",
        photoURL: null,
      });
    });

    test("fcmToken が登録される", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signInWithGoogle();
      });
      expect(setUserSecretMock).toBeCalledWith('test-user-uid', { fcmToken: 'test-token' });
    });
  });

  describe('二回目以降のログインの場合', () => {
    beforeEach(() => {
      signInGoogleWithPopupMock.mockResolvedValue({
        user: { uid: 'test-uid', displayName: 'てすたろう', photoURL: null },
      });
      getUserMock.mockResolvedValue({ isExist: true });
      getFcmTokenMock.mockResolvedValue('test-token');
    });

    test("ユーザー情報は登録されない", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signInWithGoogle();
      });
      expect(addUserMock).not.toBeCalled();
    });

    test("fcmToken が更新される", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signInWithGoogle();
      });
      expect(setUserSecretMock).toBeCalledWith("test-uid", { fcmToken: "test-token" });
    });
  });

  test("処理中にエラーが発生した場合、ログアウトされる", async () => {
    const { result } = renderHook(() => useAuth());
    signInGoogleWithPopupMock.mockReturnValue({
      user: {
        uid: "test-user-uid",
        displayName: "てすたろう",
        photoURL: null,
      },
    });
    getUserMock.mockRejectedValue("error");
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(signOutMock).toBeCalled();
  });
});

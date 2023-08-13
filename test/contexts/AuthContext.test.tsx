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

const signInGoogleWithPopupMock = vi.fn();
const signOutMock = vi.fn();
vi.mock("@/lib/firebase", async () => {
  const firebase = await vi.importActual<object>("@/lib/firebase");
  return {
    ...firebase,
    signInGoogleWithPopup: signInGoogleWithPopupMock,
    signOut: signOutMock,
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

  test("コンテキストデータが取得できる", () => {
    useAuthStateMock.mockReturnValue([
      { uid: "test-user-uid", displayName: "てすたろう" } as User,
      true,
      undefined,
    ]);
    render(<TestComponent />);
    waitFor(() =>
      expect(screen.getByText("てすたろうでログインできました")).toBeTruthy(),
    );
  });
});

describe("useAuth", async () => {
  const { useAuth } = await import("@/contexts/AuthContext");

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  test("初めてのログインの場合、ユーザー情報が登録される", async () => {
    const { result } = renderHook(() => useAuth());
    signInGoogleWithPopupMock.mockReturnValue({
      user: {
        uid: "test-user-uid",
        displayName: "てすたろう",
        photoURL: null,
      },
    });
    getUserMock.mockReturnValue({
      isExist: false,
    });
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(addUserMock).toBeCalledWith({
      uid: "test-user-uid",
      displayName: "てすたろう",
      photoURL: null,
    });
  });

  test("二回目以降のログインの場合、ユーザー情報は登録されない", async () => {
    const { result } = renderHook(() => useAuth());
    signInGoogleWithPopupMock.mockReturnValue({
      user: {
        uid: "test-user-uid",
        displayName: "てすたろう",
        photoURL: null,
      },
    });
    getUserMock.mockReturnValue({
      isExist: true,
    });
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(addUserMock).not.toBeCalled();
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
    getUserMock.mockRejectedValue('error');
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(signOutMock).toBeCalled();
  });
});
import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { Timestamp } from "@/lib/firebase";

import { messageFactory } from "@/../test/factories/message";
import { userFactory } from "@/../test/factories/user";

const sender = userFactory.build({
  id: "user-id",
  name: "テストユーザー",
  photoUrl: "user-photo-url",
});
const useCollectionDataMock = vi.fn();
vi.mock('@/hooks/useCollectionData', () => {
  return {
    useCollectionData: useCollectionDataMock,
  };
});
const useUsersMock = vi.fn();
vi.mock("@/contexts/UsersContext", () => {
  return {
    useUsers: useUsersMock,
  };
});

describe("Messages", async () => {
  const { Messages } = await import("@/components/Messages");

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  test("ローディング中はローディングメッセージが表示される", () => {
    useCollectionDataMock.mockReturnValue([[], true, undefined, undefined]);
    render(<Messages />);
    expect(screen.getByText("loading...")).toBeTruthy();
  });

  test("ローディング完了後、メッセージ一覧が表示される", async () => {
    const message1 = messageFactory.build({
      id: "test-message1-id",
      content: "テストメッセージ1",
      senderId: "test-user-uid",
    });
    const message2 = messageFactory.build({
      id: "test-message2-id",
      content: "テストメッセージ2",
      senderId: "test-user-uid",
    });
    useCollectionDataMock.mockReturnValue([[message1, message2], false, undefined, undefined]);
    const user = userFactory.build({
      id: "test-user-uid",
      name: "てすたろう",
     });
    useUsersMock.mockReturnValue({ users: [user], usersById: { [user.id]: user }, loading: false });
    render(<Messages />);
    expect(screen.getByText("テストメッセージ1")).toBeTruthy();
    expect(screen.getByText("テストメッセージ2")).toBeTruthy();
  });
});

describe("Message", async () => {
  const { Message } = await import("@/components/Message");

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  const message = messageFactory.build({
    content: "テストのメッセージ",
    senderId: "user-id",
    createdAt: Timestamp.fromDate(new Date("2022-07-01 12:34:56+09:00")),
  });

  test("ローディング中はローディングメッセージが表示される", () => {
    useUsersMock.mockReturnValue({
      usersById: {},
      loading: true,
    });
    render(<Message message={message} />);
    expect(screen.getByText("loading...")).toBeTruthy();
  });

  test("アイコン画像が表示される", async () => {
    useUsersMock.mockReturnValue({
      usersById: { "user-id": sender },
      loading: false,
    });
    render(<Message message={message} />);
    await waitFor(() => {
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        "user-photo-url",
      );
    });
  });
  test("送信者の名前が表示される", async () => {
    useUsersMock.mockReturnValue({
      usersById: { "user-id": sender },
      loading: false,
    });
    render(<Message message={message} />);
    await waitFor(() => {
      expect(screen.getByText("テストユーザー")).toBeTruthy();
    });
  });
  test("送信時間が表示される", async () => {
    useUsersMock.mockReturnValue({
      usersById: { "user-id": sender },
      loading: false,
    });
    render(<Message message={message} />);
    await waitFor(() => {
      expect(screen.getByText("2022-07-01 12:34")).toBeTruthy();
    });
  });
  test("メッセージが表示される", async () => {
    useUsersMock.mockReturnValue({
      usersById: { "user-id": sender },
      loading: false,
    });
    render(<Message message={message} />);
    await waitFor(() => {
      expect(screen.getByText("テストのメッセージ")).toBeTruthy();
    });
  });
});

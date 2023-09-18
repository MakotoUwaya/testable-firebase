import { cleanup, render, screen } from "@testing-library/react";

import { messageFactory } from "@/../test/factories/message";
import { userFactory } from "@/../test/factories/user";

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

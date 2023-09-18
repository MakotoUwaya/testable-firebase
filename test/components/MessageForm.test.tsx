import { render, cleanup, screen, waitFor, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

const addMessageMock = vi.fn();
vi.mock("@/lib/message", () => {
  return {
    addMessage: addMessageMock,
  };
});

vi.mock('@/contexts/AuthContext', () => {
  return {
    useAuth: () => ({
      currentUser: {
        uid: 'test-user-uid',
      },
    }),
  };
});

describe("MessageForm", async () => {
  const { MessageForm } = await import("@/components/MessageForm");

  afterEach(() => {
    cleanup();
  });

  test("メッセージ入力欄が表示される", () => {
    render(<MessageForm />);
    expect(screen.getByLabelText("content-input")).toBeDefined();
  });
  test("画像入力欄が表示される", () => {
    render(<MessageForm />);
    expect(screen.getByLabelText("image-input")).toBeDefined();
  });
  test("送信ボタンが表示される", () => {
    render(<MessageForm />);
    expect(screen.getByText("送信")).toBeDefined();
  });
  test("入力が空欄のときに送信ボタンを押せない", () => {
    render(<MessageForm />);
    const button = screen.getByText<HTMLButtonElement>('送信');
    expect(button).toBeDisabled();
  });
  test("送信ボタンを押したときにメッセージ投稿処理が呼ばれる", async () => {
    render(<MessageForm />);
    const contentInput = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(contentInput, 'てすとだよ'));
    const imageInput = screen.getByLabelText<HTMLInputElement>('image-input');
    const file = new File([], "image.png", { type: "image/png" });
    await act(() => userEvent.upload(imageInput, file));
    screen.getByText<HTMLButtonElement>('送信').click();
    expect(addMessageMock).toBeCalledWith('てすとだよ', file, "test-user-uid");
  });
  test("送信ボタンを押したときにメッセージ投稿処理が呼ばれる", async () => {
    render(<MessageForm />);
    const input = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(input, 'てすとだよ'));
    screen.getByText<HTMLButtonElement>('送信').click();
    expect(addMessageMock).toBeCalled();
  });
  test("送信完了後、メッセージ入力欄がクリアされる", async () => {
    render(<MessageForm />);
    const input = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(input, 'てすとだよ'));
    expect(input).toHaveValue('てすとだよ');
    screen.getByText<HTMLButtonElement>('送信').click();
    await waitFor(() => expect(input).toHaveValue(''));
  });
  test("送信完了後、メッセージ入力欄がクリアされる", async () => {
    render(<MessageForm />);
    const contentInput = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(contentInput, 'てすとだよ'));
    const imageInput = screen.getByLabelText<HTMLInputElement>('image-input');
    const file = new File([], "image.png", { type: "image/png" });
    await act(() => userEvent.upload(imageInput, file));
    expect(contentInput).toHaveValue('てすとだよ');
    expect(imageInput.files?.[0]).toBe(file);
    screen.getByText<HTMLButtonElement>('送信').click();
    await waitFor(() => {
      expect(contentInput).toHaveValue('');
      expect(imageInput.files?.[0]).toBeUndefined();
    });
  });
});
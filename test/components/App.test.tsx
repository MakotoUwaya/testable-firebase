import { cleanup, render, screen } from "@testing-library/react";
import { App } from "@/components/App";

vi.mock('@/components/Messages', () => {
  return {
    Messages: () => <></>
  };
});

vi.mock('@/components/MessageForm', () => {
  return {
    MessageForm: () => <></>
  };
});

describe("App", () => {
  afterEach(() => cleanup());
  test("タイトル文字列が表示される", () => {
    render(<App />);
    expect(screen.getByText("Sample Chat App")).toBeTruthy();
  });
});

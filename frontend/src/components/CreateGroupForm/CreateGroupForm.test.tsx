import CreateGroupForm from "./CreateGroupForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockOnSubmit = jest.fn();
const user = userEvent.setup();

describe("CreateGroupForm", () => {
  beforeEach(() => {
    render(<CreateGroupForm onSubmit={mockOnSubmit} />);
  });

  it("フォームの内容がSubmitされる", async () => {
    await user.type(screen.getByLabelText("グループ名"), "group1");
    await user.type(screen.getByLabelText("メンバー"), "一郎, 二郎");

    expect(screen.getByDisplayValue("group1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("一郎, 二郎")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "group1",
      members: ["一郎", "二郎"],
    });

    await waitFor(() => {
      expect(screen.queryByDisplayValue("group1")).toBe(null);
      expect(screen.queryByDisplayValue("一郎, 二郎")).toBe(null);
    });
  });

  it("初期状態でSubmitするとバリデーションエラーが発生する", async () => {
    await user.click(screen.getByRole("button"));

    expect(screen.getByText("グループ名は必須です")).toBeInTheDocument();
    expect(screen.getByText("メンバーは2人以上必要です")).toBeInTheDocument();
  });
});

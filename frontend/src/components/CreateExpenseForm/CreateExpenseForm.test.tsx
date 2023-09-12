import CreateExpenseForm from "./CreateExpenseForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Group } from "../../type";

const mockOnSubmit = jest.fn();
const user = userEvent.setup();
const group: Group = {
  name: "テストグループ",
  members: ["一郎", "二郎"],
};

describe("CreateExpenseForm", () => {
  beforeEach(() => {
    render(<CreateExpenseForm group={group} onSubmit={mockOnSubmit} />);
  });

  it("フォームの内容がSubmitされる", async () => {
    await user.type(screen.getByLabelText("支出名"), "ランチ");
    await user.type(screen.getByLabelText("金額"), "1000");
    await user.selectOptions(screen.getByRole("combobox"), "一郎");

    expect(screen.getByDisplayValue("ランチ")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("一郎")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      expenseName: "ランチ",
      amount: 1000,
      groupName: "テストグループ",
      payer: "一郎",
    });

    await waitFor(() => {
      expect(screen.queryByDisplayValue("ランチ")).toBe(null);
      expect(screen.queryByDisplayValue("1000")).toBe(null);
      expect(screen.queryByDisplayValue("一郎")).toBe(null);
    });
  });

  it("初期状態でSubmitするとバリデーションエラーが発生する", async () => {
    await user.click(screen.getByRole("button"));

    expect(screen.getByText("支出名は必須です")).toBeInTheDocument();
    expect(
      screen.getByText("金額は1円以上の整数で必須です")
    ).toBeInTheDocument();
    expect(screen.getByText("支払うメンバーは必須です")).toBeInTheDocument();
  });
});

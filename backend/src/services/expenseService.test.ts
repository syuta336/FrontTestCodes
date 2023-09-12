import { ExpenseRepository } from "../repositories/expenseRepository";
import { GroupService } from "./groupService";
import { ExpenseService } from "./expenseService";
import { Expense, Group } from "../type";

describe("ExpenseService", () => {
  // 依存を注入する場合のテスト
  let mockExpenseRepo: Partial<ExpenseRepository>;
  let mockGroupService: Partial<GroupService>;
  let expenseService: ExpenseService;

  const group: Group = { name: "group1", members: ["一郎", "二郎"] };
  const expense: Expense = {
    groupName: "group1",
    expenseName: "ランチ",
    amount: 2000,
    payer: "一郎",
  };

  beforeEach(() => {
    mockExpenseRepo = {
      saveExpense: jest.fn(),
      loadExpenses: jest.fn(),
    };

    mockGroupService = {
      getGroupByName: jest.fn(),
    };

    expenseService = new ExpenseService(
      mockExpenseRepo as ExpenseRepository,
      mockGroupService as GroupService
    );
  });

  describe("addExpense", () => {
    it("支出が登録される", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepo.saveExpense).toHaveBeenCalledWith(expense);
    });

    it("グループが存在しない場合は登録されない", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(null);
      expect(() => expenseService.addExpense(expense)).toThrowError(
        `グループ： ${expense.groupName} が存在しません`
      );
    });

    it("支払い者がグループに存在しな場合は登録されない", () => {
      const nonMemberExpense: Expense = { ...expense, payer: "Charlie" }; // Charlie is not a member of the group
      const group: Group = { name: "group1", members: ["一郎", "二郎"] };
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);

      expect(() => expenseService.addExpense(nonMemberExpense)).toThrowError(
        "支払い者がメンバーの中にいません"
      );
    });
  });

  describe("getSettlements", () => {
    it("グループ内の支出が清算される", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      (mockExpenseRepo.loadExpenses as jest.Mock).mockReturnValue([expense]);
      const result = expenseService.getSettlements(group.name);
      expect(result).toEqual([{ from: "二郎", to: "一郎", amount: 1000 }]);
    });

    it("グループが存在しない場合は清算されない", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(null);
      expect(() =>
        expenseService.getSettlements(expense.groupName)
      ).toThrowError(`グループ： ${expense.groupName} が存在しません`);
    });
  });
});

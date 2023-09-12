import fs from "fs";
import { ExpenseRepository } from "./expenseRepository";
import { Expense } from "../type";

jest.mock("fs");

describe("ExpenseRepository", () => {
  const MockedFs = fs as jest.Mocked<typeof fs>;
  let repo: ExpenseRepository;

  beforeEach(() => {
    MockedFs.existsSync.mockClear();
    MockedFs.readFileSync.mockClear();
    MockedFs.writeFileSync.mockClear();
    repo = new ExpenseRepository("./expenses.json");
  });

  describe("loadExpenses", () => {
    it("ファイルから支出が取得できる", () => {
      const expense: Expense = {
        groupName: "group1",
        expenseName: "ランチ",
        amount: 2000,
        payer: "一郎",
      };

      MockedFs.existsSync.mockReturnValue(true);
      MockedFs.readFileSync.mockReturnValue(JSON.stringify([expense]));

      const result = repo.loadExpenses();

      expect(result).toEqual([expense]);
    });

    it("ファイルが存在しない場合[]が返される", () => {
      MockedFs.existsSync.mockReturnValue(false);

      const result = repo.loadExpenses();

      expect(result).toEqual([]);
    });
  });

  describe("saveExpense", () => {
    it("支出が保存される", () => {
      const expense: Expense = {
        groupName: "group1",
        expenseName: "ランチ",
        amount: 2000,
        payer: "一郎",
      };

      MockedFs.existsSync.mockReturnValue(true);
      MockedFs.readFileSync.mockReturnValue(JSON.stringify([expense]));

      repo.saveExpense(expense);

      expect(MockedFs.writeFileSync).toHaveBeenCalledWith(
        "./expenses.json",
        JSON.stringify([expense, expense])
      );
    });
  });
});

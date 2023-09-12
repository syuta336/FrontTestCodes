import express from "express";
import { ExpenseController } from "./expenseController";
import { ExpenseService } from "../services/expenseService";
import { Settlement } from "../type";

describe("ExpenseController", () => {
  let mockExpenseService: Partial<ExpenseService>;
  let expenseController: ExpenseController;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: Partial<express.NextFunction>;

  beforeEach(() => {
    mockExpenseService = {
      getSettlements: jest.fn(),
      addExpense: jest.fn(),
    };

    expenseController = new ExpenseController(
      mockExpenseService as ExpenseService
    );

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("addExpense", () => {
    it("支出が登録される", () => {
      req.body = {
        groupName: "group1",
        expenseName: "ランチ",
        payer: "一郎",
        amount: 1000,
      };

      expenseController.addExpense(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockExpenseService.addExpense).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("支出が登録されました");
    });
  });

  it("バリデーションエラー: グループ名は必須", () => {
    req.body = {
      groupName: "",
      expenseName: "ランチ",
      payer: "一郎",
      amount: 1000,
    };

    expenseController.addExpense(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(["グループ名は必須です"]);
  });

  it("バリデーションエラー: 支出名は必須", () => {
    req.body = {
      groupName: "group1",
      expenseName: "",
      payer: "一郎",
      amount: 1000,
    };

    expenseController.addExpense(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(["支出名は必須です"]);
  });

  it("バリデーションエラー: 支払うメンバーは必須", () => {
    req.body = {
      groupName: "group1",
      expenseName: "ランチ",
      payer: "",
      amount: 1000,
    };

    expenseController.addExpense(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(["支払うメンバーは必須です"]);
  });

  it("バリデーションエラー: 金額は1円以上", () => {
    req.body = {
      groupName: "group1",
      expenseName: "ランチ",
      payer: "一郎",
      amount: 0,
    };

    expenseController.addExpense(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(["金額は1円以上の整数です"]);
  });

  it("不明なエラーが起こるとnextが呼ばれる", () => {
    req.body = {
      groupName: "group1",
      expenseName: "ランチ",
      payer: "一郎",
      amount: 1000,
    };

    (mockExpenseService.addExpense as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    expenseController.addExpense(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(next).toHaveBeenCalled();
  });

  describe("getSettlements", () => {
    it("清算結果が取得できる", () => {
      const settlements: Settlement[] = [
        {
          from: "二郎",
          to: "太郎",
          amount: 1000,
        },
      ];
      (mockExpenseService.getSettlements as jest.Mock).mockReturnValue(
        settlements
      );
      req.params = { groupName: "group1" };

      expenseController.getSettlements(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockExpenseService.getSettlements).toHaveBeenCalledWith(
        req.params.groupName
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(settlements);
    });

    it("不明なエラーが起こるとnextが呼ばれる", () => {
      const settlements: Settlement[] = [
        {
          from: "二郎",
          to: "太郎",
          amount: 1000,
        },
      ];
      (mockExpenseService.getSettlements as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error();
        }
      );
      req.params = { groupName: "group1" };

      expenseController.getSettlements(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

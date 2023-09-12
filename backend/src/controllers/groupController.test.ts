import express from "express";
import { GroupController } from "./groupController";
import { GroupService } from "../services/groupService";

describe("GroupController", () => {
  let mockGroupService: Partial<GroupService>;
  let groupController: GroupController;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockGroupService = {
      getGroups: jest.fn(),
      getGroupByName: jest.fn(),
      addGroup: jest.fn(),
    };

    groupController = new GroupController(mockGroupService as GroupService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("addGroup", () => {
    it("グループが登録される", () => {
      const group = { name: "group1", members: ["一郎", "二郎"] };
      req.body = group;

      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce([]);

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockGroupService.addGroup).toHaveBeenCalledWith(group);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("バリデーションエラー: グループ名は必須", () => {
      const invalidGroup = { name: "", members: ["一郎", "二郎"] };
      req.body = invalidGroup;

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["グループ名は必須です"]);
    });

    it("バリデーションエラー: メンバーは2人以上必要", () => {
      const invalidGroup = { name: "group1", members: ["一郎"] };
      req.body = invalidGroup;

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバーは2人以上必要です"]);
    });

    it("バリデーションエラー: 同じ名前のメンバーは登録できない", () => {
      const invalidGroup = { name: "group1", members: ["一郎", "一郎"] };
      req.body = invalidGroup;

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバー名が重複しています"]);
    });

    it("重複したグループ名は登録できない", () => {
      const group = { name: "group1", members: ["一郎", "二郎"] };
      req.body = group;

      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce([group]);

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "同じ名前のグループが登録されています"
      );
    });

    it("不明なエラーが起こるとnextが呼ばれる", () => {
      const group = { name: "group1", members: ["一郎", "二郎"] };
      req.body = group;

      (mockGroupService.getGroups as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getGroupList", () => {
    it("全てのグループが取得できる", () => {
      const group = [
        { name: "group1", members: ["一郎", "二郎"] },
        { name: "group2", members: ["太郎", "花子"] },
      ];

      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce(group);

      groupController.getGroupList(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockGroupService.getGroups).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(group);
    });

    it("不明なエラーが起こるとnextが呼ばれる", () => {
      (mockGroupService.getGroups as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      groupController.getGroupList(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getGroupByName", () => {
    it("指定したグループ名でグループが取得できる", () => {
      const group = { name: "group1", members: ["一郎", "三郎"] };
      req = {
        params: { name: "group1" },
      };

      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);

      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockGroupService.getGroupByName).toHaveBeenCalledWith("group1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(group);
    });

    it("グループが存在しない場合はエラー", () => {
      req = {
        params: { name: "group1" },
      };

      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(
        undefined
      );

      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(mockGroupService.getGroupByName).toHaveBeenCalledWith("group1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("グループが存在しません");
    });

    it("不明なエラーが起こるとnextが呼ばれる", () => {
      req = {
        params: { name: "group1" },
      };

      (mockGroupService.getGroupByName as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error();
        }
      );

      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

import fs from "fs";
import { GroupRepository } from "./groupRepository";
import { Group } from "../type";

jest.mock("fs");

describe("GroupRepository", () => {
  const mockFs = jest.mocked(fs);
  let repo: GroupRepository;

  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();
    repo = new GroupRepository("./groups.json");
  });

  describe("loadGroups", () => {
    it("ファイルからグループデータが取得できる", () => {
      const group: Group = {
        name: "group1",
        members: ["一郎", "二郎"],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify([group]));

      const result = repo.loadGroups();

      expect(result).toEqual([group]);
    });

    it("ファイルが存在しない場合[]が返される", () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = repo.loadGroups();

      expect(result).toEqual([]);
    });
  });

  describe("saveGroup", () => {
    it("グループが保存される", () => {
      const loadedGroup: Group = {
        name: "group11",
        members: ["一郎", "二郎"],
      };
      const saveGroup: Group = {
        name: "group12",
        members: ["太郎", "花子"],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify([loadedGroup]));

      repo.saveGroup(saveGroup);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "./groups.json",
        JSON.stringify([loadedGroup, saveGroup])
      );
    });
  });
});

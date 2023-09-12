import { GroupService } from "./groupService";
import { GroupRepository } from "../repositories/groupRepository";
import { Group } from "../type";

describe("GroupService", () => {
  let mockGroupRepo: Partial<GroupRepository>;
  let groupService: GroupService;

  const group: Group = { name: "group1", members: ["一郎", "二郎"] };

  beforeEach(() => {
    mockGroupRepo = {
      loadGroups: jest.fn(),
      saveGroup: jest.fn(),
    };
    groupService = new GroupService(mockGroupRepo as GroupRepository);
  });

  describe("getGroups", () => {
    it("全てのグループが取得できる", () => {
      const groups: Group[] = [group];
      (mockGroupRepo.loadGroups as jest.Mock).mockReturnValue(groups);
      expect(groupService.getGroups()).toBe(groups);
    });
  });

  describe("getGroupByName", () => {
    it("名前をキーにグループが取得できる", () => {
      const groups: Group[] = [group];
      (mockGroupRepo.loadGroups as jest.Mock).mockReturnValue(groups);
      const result = groupService.getGroupByName(group.name);
      expect(result).toBe(group);
    });

    it("指定した名前のグループが存在しない場合undefinedが返される", () => {
      const groups: Group[] = [group];
      (mockGroupRepo.loadGroups as jest.Mock).mockReturnValue(groups);
      const result = groupService.getGroupByName("Nonexistent Group");
      expect(result).toBeUndefined();
    });
  });

  describe("addGroup", () => {
    it("グループが登録される", () => {
      groupService.addGroup(group);
      expect(mockGroupRepo.saveGroup).toHaveBeenCalledWith(group);
    });
  });
});

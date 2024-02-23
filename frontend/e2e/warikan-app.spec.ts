import { test, expect } from "@playwright/test";
import axios from "axios";

test.describe("割り勘アプリ", () => {
  test.beforeEach(async ({ page }) => {
    await axios.get("http://localhost:3000/init");
    await page.goto("http://localhost:3001");
  });

  test.describe("グループ作成", () => {
    test("グループが作成され支出登録ページに遷移する", async ({ page }) => {
      const groupNameInput = page.getByLabel("グループ名");
      await groupNameInput.fill("group1");
      const memberListInput = page.getByLabel("メンバー");
      await memberListInput.fill("太郎, 花子");

      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page).toHaveURL(/.+\/group\/group1/);
    });

    test("バリデーションエラーが存在する場合グループが作成されずページ遷移しない", async ({
      page,
    }) => {
      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page.getByText("グループ名は必須です")).toBeVisible();
      await expect(page.getByText("メンバーは2人以上必要です")).toBeVisible();
      await expect(page).not.toHaveURL(/.+\/group\/group1/);
    });
  });

  test.describe("支出登録機能", () => {
    test.beforeEach(async ({ page }) => {
      const groupNameInput = page.getByLabel("グループ名");
      await groupNameInput.fill("group1");
      const memberListInput = page.getByLabel("メンバー");
      await memberListInput.fill("太郎, 花子");

      const submitButton = page.getByRole("button");
      await submitButton.click();
    });

    test("支出が登録され清算リストが更新される", async ({ page }) => {
      const expenseNameInput = page.getByLabel("支出名");
      await expenseNameInput.fill("ランチ");
      const amountInput = page.getByLabel("金額");
      await amountInput.fill("1000");
      const memberSelect = page.getByLabel("支払うメンバー");
      await memberSelect.selectOption("花子");

      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page).toHaveURL(/.+\/group\/group1/);
      await expect(page.getByRole("list")).toHaveText("太郎 → 花子500円");
    });

    test("バリデーションエラーが存在する場合支出が登録されず清算リストが更新されない", async ({ page }) => {
      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page.getByText("支出名は必須です")).toBeVisible();
      await expect(page.getByText("金額は1円以上の整数で必須です")).toBeVisible();
      await expect(page.getByText("支払うメンバーは必須です")).toBeVisible();

      await expect(page.getByRole("list")).toHaveText("");
    })
  })
});

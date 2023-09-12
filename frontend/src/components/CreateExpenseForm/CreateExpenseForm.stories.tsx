import CreateExpenseForm from "./CreateExpenseForm";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "CreateExpenseForm",
  component: CreateExpenseForm,
} as Meta<typeof CreateExpenseForm>;

export default meta;

type Story = StoryObj<typeof CreateExpenseForm>;

export const Default: Story = {
  args: {
    group: {
      name: "テストグループ",
      members: ["太郎", "花子"],
    },
    onSubmit: async () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1000));
    },
  },
};

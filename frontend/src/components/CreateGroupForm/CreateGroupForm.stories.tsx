import CreateGroupForm from "./CreateGroupForm";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "CreateGroupForm",
  component: CreateGroupForm,
} as Meta<typeof CreateGroupForm>;

export default meta;

type Story = StoryObj<typeof CreateGroupForm>;

export const Default: Story = {
  args: {
    onSubmit: async () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1000))
    },
  },
};

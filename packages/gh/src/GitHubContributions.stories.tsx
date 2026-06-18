import type { Meta, StoryObj } from '@storybook/react';
import { GitHubContributions } from './GitHubContributions';

const meta = {
  title: 'gh/GitHubContributions',
  component: GitHubContributions,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof GitHubContributions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    login: 'ElJijuna',
  },
};

export const Organization: Story = {
  args: {
    login: 'facebook',
  },
};

export const CustomWeeks: Story = {
  args: {
    login: 'ElJijuna',
    weeks: 26,
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { GitHubProfile } from './GitHubProfile';

const meta = {
  title: 'gh/GitHubProfile',
  component: GitHubProfile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof GitHubProfile>;

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

export const NotFound: Story = {
  args: {
    login: 'this-user-does-not-exist-xyzxyz123',
  },
};

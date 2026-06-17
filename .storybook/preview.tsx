import '@gnome-ui/core/styles';
import '@gnome-ui/react/styles';
import '@gnome-ui/layout/styles';
import { GhClientProvider } from '@api-hooks/gh';
import { GnomeProvider } from '@gnome-ui/react';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <GnomeProvider>
        <QueryClientProvider client={queryClient}>
          <GhClientProvider options={{ token: import.meta.env.STORYBOOK_GH_TOKEN ?? '' }}>
            <Story />
          </GhClientProvider>
        </QueryClientProvider>
      </GnomeProvider>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;

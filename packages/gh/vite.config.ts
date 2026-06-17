import federation, { type SharedConfig } from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pkg from './package.json';

type Shared = Record<string, SharedConfig & { singleton?: boolean }>;

const isFederation = process.env.BUILD_MODE === 'federation';

export default defineConfig({
  plugins: [
    react(),
    isFederation &&
      federation({
        name: 'opencomp_gh',
        filename: 'remoteEntry.js',
        exposes: {
          './GitHubProfile': './src/GitHubProfile.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: pkg.peerDependencies.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: pkg.peerDependencies['react-dom'],
          },
          '@gnome-ui/react': { singleton: true },
          '@gnome-ui/icons': { singleton: true },
          '@api-hooks/gh': { singleton: true },
          '@tanstack/react-query': { singleton: true },
        } satisfies Shared,
      }),
  ].filter(Boolean),

  build: isFederation
    ? {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: '',
        emptyOutDir: false,
        rollupOptions: {
          input: './src/index.ts',
          external: ['react', 'react-dom'],
        },
      }
    : {
        lib: {
          entry: 'src/index.ts',
          name: 'OpenCompGh',
          formats: ['es', 'umd'],
          fileName: (fmt) => `index.${fmt}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: true,
      },
});

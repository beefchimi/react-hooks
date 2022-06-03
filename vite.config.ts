import {defineConfig} from 'vite';
import pluginReact from '@vitejs/plugin-react';
import dtsPlugin from 'vite-plugin-dts';
import type vitestTypes from 'vitest';

const testConfig: vitestTypes.InlineConfig = {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
};

export default defineConfig({
  test: testConfig,
  plugins: [pluginReact(), dtsPlugin()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'React Hooks',
      fileName: (format) => `react-hooks.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize dependencies that
      // SHOULD NOT be bundled into your library.
      // external: [...Object.keys(peerDependencies)]
      external: [
        'react',
        // 'react-dom',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // If we do not care about UMD, we can remove this.
        globals: {
          react: 'React',
          // 'react-dom': 'ReactDOM',
        },

        // Since we publish our ./src folder, there's no point
        // in bloating sourcemaps with another copy of it.
        // sourcemapExcludeSources: true,
      },
    },
    // sourcemap: true,

    // Reduce bloat from legacy polyfills.
    // target: 'esnext',

    // Consumer's are responsible for minifiction.
    minify: false,
  },
});

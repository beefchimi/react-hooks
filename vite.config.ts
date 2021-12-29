import fs from "fs";
import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";
import dtsPlugin from "vite-plugin-dts";

const BUILD_PATHS = {
  dtsPluginOutput: "/dist/src/",
  dtsFixedOutput: "/dist/types/",
  dtsEntryFile: "./dist/index.d.ts",
};

const DTS_ENTRY_CONTENT = `export * from './types/index';`;

// TODO: Do we actually need to include React DOM?
export default defineConfig({
  plugins: [
    pluginReact(),
    dtsPlugin({
      beforeWriteFile(filePath, content) {
        return {
          filePath: filePath.replace(
            BUILD_PATHS.dtsPluginOutput,
            BUILD_PATHS.dtsFixedOutput
          ),
          content,
        };
      },
      afterBuild() {
        fs.writeFile(
          BUILD_PATHS.dtsEntryFile,
          DTS_ENTRY_CONTENT,
          reportDtsWrite
        );
      },
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "React Hooks",
      fileName: (format) => `react-hooks.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize dependencies that
      // SHOULD NOT be bundled into your library.
      // external: [...Object.keys(peerDependencies)]
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // If we do not care about UMD, we can remove this.
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
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

function reportDtsWrite(error) {
  if (error) {
    console.error(error);
    return;
  }

  console.log("Types entry definition successfully written.");
}

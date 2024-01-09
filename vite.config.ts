import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import dotenv from "dotenv";
import path from "path";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  const MODE = process.env.NODE_ENV || "production";

  dotenv.config({
    path: path.join(path.resolve(), ".env"),
  });
  dotenv.config({
    path: path.join(path.resolve(), `.env.${MODE}`),
  });

  const host = process.env.HOST;
  const port = +(process.env.PORT || 5000);

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      host: host,
      port: port,
    },
    base: "./",
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.join(path.resolve(), "src"),
        },
      ],
    },
    build: {
      outDir: "dist",
      minify: "terser",
      cssMinify: true,
      terserOptions: {
        keep_classnames: true,
      },
    },
    plugins: [
      chunkSplitPlugin({
        strategy: "single-vendor",
        // customChunk: (args) => {
        //   // eslint-disable-next-line prefer-const
        //   let { file, id, moduleId, root } = args;
        //   // console.log("file:", file);
        //   // if (file.startsWith("src/pages")) {
        //   //   file = file.substring(4);
        //   //   file = file.replace(/\.[^.$]+$/, "");
        //   //   return file;
        //   // }
        //   return null;
        // },
        customSplitting: {
          //   "react-vendor": ["react", "react-router-dom", "react-dom"],
          dummy: [/src\/dummy/],
          libs: [/src\/libs/],
          hooks: [/src\/hooks/],
          context: [/src\/context/],
          small: [/src\/components\/atoms/, /src\/components\/moleculars/],
          organisms: [/src\/components\/organisms/],
          templates: [/src\/components\/templates/],
          util: [/src\/util/],
          pages: [/src\/pages/],
        },
      }),
      react({
        devTarget: "esnext",
        plugins: [["@swc/plugin-styled-components", {}]],
      }),
    ],
  };
});

// build.js
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/**/*.ts"],
  outdir: "dist",
  bundle: false,
  platform: "node",
  format: "esm",
  target: "node18",
  outExtension: { ".js": ".js" },
  plugins: [
    {
      name: "add-js-extension",
      setup(build) {
        // Handle .ts imports
        build.onResolve({ filter: /^\.\.?\/.*$/ }, (args) => {
          if (args.path.endsWith(".ts")) {
            return { path: args.path.replace(/\.ts$/, ".js"), external: true };
          }
          // Add .js to relative imports that don't have an extension
          if (!args.path.match(/\.[a-z]+$/i)) {
            return { path: args.path + ".js", external: true };
          }
        });
      },
    },
  ],
});

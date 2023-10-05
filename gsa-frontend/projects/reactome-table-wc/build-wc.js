const fs = require("fs-extra");
const concat = require("concat");

const build = async () => {
  const files = [
    "./dist/reactome-table-wc/main.js",
    "./dist/reactome-table-wc/polyfills.js",
    "./dist/reactome-table-wc/runtime.js"
  ]

  await fs.ensureDir('dist/reactome-table-wc');
  await concat(files, "web-component-demo/reactome-table-wc.js");
  await fs.copy("./dist/reactome-table-wc/styles.css", "web-component-demo/reactome-table-styles.css");
  await fs.copy("./dist/reactome-table-wc/RobotoMono.ttf", "web-component-demo/RobotoMono.ttf")
  console.log("Files concatenated successfully!");
}

build();

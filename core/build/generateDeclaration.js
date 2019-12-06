const path = require("path");
const fs = require("fs");
const { recurseDirFiles } = require("../../utils/TraverseUtil");

const SRC_PATH = path.resolve(__dirname, "../src");
const DIST_PATH = path.resolve(__dirname, "../dist");

const importLines = recurseDirFiles(DIST_PATH).filter(p=>{
    return /\.d\.ts$/.test(p);
}).map(p=>{
    const paths = path.relative(DIST_PATH, p).replace(/\\+/g, "/").replace(/^(.*)\.d\.ts$/, "./$1");
    const datas = paths.split("/");
    const name = datas[datas.length - 1];
    return `import * as ${name} from '${paths}';`;
});
fs.writeFileSync(path.join(DIST_PATH, "index.d.ts"), importLines.join("\n"));
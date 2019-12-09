const path = require("path");
const fs = require("fs");
const { recurseDirFiles } = require("../../../utils/TraverseUtil");

const DIST_PATH = path.resolve(__dirname, "../dist");

const importLines = recurseDirFiles(DIST_PATH).filter(p=>{
    // 只生成自身的引用描述，因此要用.js.map文件作为标识
    return /\.js\.map$/.test(p);
}).map(p=>{
    const paths = path.relative(DIST_PATH, p).replace(/\\+/g, "/").replace(/^(.*)\.js\.map$/, "./$1");
    const datas = paths.split("/");
    const name = datas[datas.length - 1];
    return `import * as ${name} from '${paths}';`;
});
fs.writeFileSync(path.join(DIST_PATH, "index.d.ts"), importLines.join("\n"));
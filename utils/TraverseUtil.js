const path = require("path");
const fs = require("fs");

exports.recurseDirFiles = function(dirPath)
{
    const targets = fs.readdirSync(dirPath);
    let result = [];
    for(let target of targets)
    {
        const targetPath = path.join(dirPath, target);
        const stat = fs.statSync(targetPath);
        if(stat.isDirectory())
        {
            // 递归
            result = result.concat(exports.recurseDirFiles(targetPath));
        }
        else
        {
            // 是文件，推入
            result.push(targetPath);
        }
    }
    return result;
};
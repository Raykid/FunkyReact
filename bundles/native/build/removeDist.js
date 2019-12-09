const fs = require("fs");
const path = require("path");

const DIST_PATH = path.resolve(__dirname, "../dist");

function emptyDir(path)
{
    if(fs.existsSync(path))
    {
		fs.readdirSync(path).forEach(file=>{
			const curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory())
            {
                // recurse
				emptyDir(curPath);
            }
            else
            {
                // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}
emptyDir(DIST_PATH);
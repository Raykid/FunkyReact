#!/usr/bin/env node

const npm = require("npm");
const path = require('path');
const fs = require("fs");
const copy = require("copy");

// 解析命令
const regCmd = /^(\w+)(.*)$/;
const resultCmd = regCmd.exec(process.argv.slice(2).join(" "));
const cmd = resultCmd[1];
if(!cmd) throw new Error("没有提供需要执行的命令");
// 解析参数
const params = resultCmd[2];
const regParams = /\s+\-\-(\w+)(\s+(\w+))?/g;
const paramsDict = {};
let resultParams;
while(resultParams = regParams.exec(params))
{
	paramsDict[resultParams[1]] = resultParams[3] == null ? true : resultParams[3];
}
// 开始拷贝
switch(cmd)
{
	case "init":
		init(paramsDict);
		break;
	default:
		throw new Error("没有找到命令：" + cmd);
}

function init(paramsDict)
{
	if(paramsDict.bundle !== "dom" && paramsDict.bundle !== "native")
	{
		throw new Error("init命令需要提供bundle参数，且值为\"dom\"或\"native\"");
	}
	const srcDir = path.join(__dirname, `./templates/${paramsDict.bundle}/`);
	const distDir = process.cwd();
	// 拷贝所有文件
	copy(srcDir + "/**/*", distDir, function(err, files)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			// 生成.gitignore文件
			str = '/node_modules/\n/.vscode/\n/dist/\n/package-lock.json\n.history';
			fs.writeFileSync(path.join(distDir, "./.gitignore"), str);
			// 生成.vscode/launch.json文件
			str = '{\n    // 使用 IntelliSense 了解相关属性。 \n    // 悬停以查看现有属性的描述。\n    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387\n    "version": "0.2.0",\n    "configurations": [\n        {\n            "type": "chrome",\n            "request": "attach",\n            "name": "Attach to Chrome",\n            "port": 9222,\n            "webRoot": "${workspaceRoot}"\n        },\n        {\n            "type": "chrome",\n            "request": "launch",\n            "name": "Launch Chrome against localhost",\n            "url": "http://localhost:8080",\n            "webRoot": "${workspaceRoot}"\n        }\n    ]\n}';
			fs.mkdirSync(".vscode");
			fs.writeFileSync(path.join(distDir, "./.vscode/launch.json"), str);
			// 安装依赖库
			npm.load((err, result)=>{
				npm.commands.install(distDir, [], ()=>{
					// 更新库到可用的最新版本
					npm.commands.update([], ()=>{
						// 汇报状态
						console.log("done.");
					});
				});
			});
		}
	});
}
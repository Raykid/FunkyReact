#!/usr/bin/env node

const npm = require("npm");
const path = require("path");
const fs = require("fs");

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

function copy(src, dest, generateSelf)
{
    // 先去获取目标类型
    const stat = fs.statSync(src);
    // 创建目录
    try
    {
        fs.mkdirSync(dest);
    }
    catch(err)
    {}
    // 先解析出目录或文件名来
    const names = src.split(/[\\\/]+/);
    if(names[0] === "") names.shift();
    if(names[names.length - 1] === "") names.pop();
    const targetName = names.pop();
    // 判断是否是目录
    if(stat.isDirectory())
    {
        // 是目录，读取目录
        const files = fs.readdirSync(src);
        // 遍历目录
        files.forEach(file=>{
            copy(path.join(src, file), generateSelf ? path.join(dest, targetName) : dest, true);
        });
    }
    else
    {
        // 是文件，执行拷贝
        const data = fs.readFileSync(src);
        // 写入目标文件
        fs.writeFileSync(path.join(dest, targetName), data)
    }
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
	copy(srcDir, distDir, false);
	// 安装依赖库
	npm.load((err, result)=>{
		npm.commands.install(distDir, [], ()=>{
			// 更新库到可用的最新版本
			npm.commands.update([], ()=>{
				// 汇报状态
				console.log("");
				console.log("");
				console.log("脚手架项目执行完毕");
				switch(paramsDict.bundle)
				{
					case "dom":
						console.log("运行本地调试请执行“npm run start”");
						console.log("打包项目请执行“npm run build”");
						break;
					case "native":
						console.log("Android调试请使用数据线连接手机后执行“npm run android”");
						console.log("iOS调试请使用数据线连接手机后执行“npm run ios”");
						console.log("如果报错无法运行，请重启“npm run start”后再试一次，还不行请重新安装一遍");
						break;
				}
			});
		});
	});
}
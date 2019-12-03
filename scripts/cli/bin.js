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
			let str;
			// 生成.gitignore文件
			str = '/node_modules/\n/.vscode/\n/dist/\n/package-lock.json\n.history';
			fs.writeFileSync(path.join(distDir, "./.gitignore"), str);
			// 生成.vscode/launch.json文件
			str = '{\n    // 使用 IntelliSense 了解相关属性。 \n    // 悬停以查看现有属性的描述。\n    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387\n    "version": "0.2.0",\n    "configurations": [\n        {\n            "type": "chrome",\n            "request": "attach",\n            "name": "Attach to Chrome",\n            "port": 9222,\n            "webRoot": "${workspaceRoot}"\n        },\n        {\n            "type": "chrome",\n            "request": "launch",\n            "name": "Launch Chrome against localhost",\n            "url": "http://localhost:8080",\n            "webRoot": "${workspaceRoot}"\n        }\n    ]\n}';
			fs.mkdirSync(".vscode");
			fs.writeFileSync(path.join(distDir, "./.vscode/launch.json"), str);
			if(paramsDict.bundle === "native")
			{
				// 生成.buckconfig文件
				str = '\n[android]\n  target = Google Inc.:Google APIs:23\n\n[maven_repositories]\n  central = https://repo1.maven.org/maven2\n';
				fs.writeFileSync(path.join(distDir, "./.buckconfig"), str);
				// 生成.eslintrc.js文件
				str = "module.exports = {\n  root: true,\n  extends: '@react-native-community',\n};\n";
				fs.writeFileSync(path.join(distDir, "./.eslintrc.js"), str);
				// 生成.flowconfig文件
				str = "[ignore]\n; We fork some components by platform\n.*/*[.]android.js\n\n; Ignore \"BUCK\" generated dirs\n<PROJECT_ROOT>/\.buckd/\n\n; Ignore polyfills\nnode_modules/react-native/Libraries/polyfills/.*\n\n; These should not be required directly\n; require from fbjs/lib instead: require('fbjs/lib/warning')\nnode_modules/warning/.*\n\n; Flow doesn't support platforms\n.*/Libraries/Utilities/LoadingView.js\n\n[untyped]\n.*/node_modules/@react-native-community/cli/.*/.*\n\n[include]\n\n[libs]\nnode_modules/react-native/Libraries/react-native/react-native-interface.js\nnode_modules/react-native/flow/\n\n[options]\nemoji=true\n\nesproposal.optional_chaining=enable\nesproposal.nullish_coalescing=enable\n\nmodule.file_ext=.js\nmodule.file_ext=.json\nmodule.file_ext=.ios.js\n\nmunge_underscores=true\n\nmodule.name_mapper='^react-native$' -> '<PROJECT_ROOT>/node_modules/react-native/Libraries/react-native/react-native-implementation'\nmodule.name_mapper='^react-native/\(.*\)$' -> '<PROJECT_ROOT>/node_modules/react-native/\1'\nmodule.name_mapper='^[./a-zA-Z0-9$_-]+\.\(bmp\|gif\|jpg\|jpeg\|png\|psd\|svg\|webp\|m4v\|mov\|mp4\|mpeg\|mpg\|webm\|aac\|aiff\|caf\|m4a\|mp3\|wav\|html\|pdf\)$' -> '<PROJECT_ROOT>/node_modules/react-native/Libraries/Image/RelativeImageStub'\n\nsuppress_type=$FlowIssue\nsuppress_type=$FlowFixMe\nsuppress_type=$FlowFixMeProps\nsuppress_type=$FlowFixMeState\n\nsuppress_comment=\\(.\\|\n\\)*\\$FlowFixMe\\($\\|[^(]\\|(\\(<VERSION>\\)? *\\(site=[a-z,_]*react_native\\(_ios\\)?_\\(oss\\|fb\\)[a-z,_]*\\)?)\\)\nsuppress_comment=\\(.\\|\n\\)*\\$FlowIssue\\((\\(<VERSION>\\)? *\\(site=[a-z,_]*react_native\\(_ios\\)?_\\(oss\\|fb\\)[a-z,_]*\\)?)\\)?:? #[0-9]+\nsuppress_comment=\\(.\\|\n\\)*\\$FlowExpectedError\n\n[lints]\nsketchy-null-number=warn\nsketchy-null-mixed=warn\nsketchy-number=warn\nuntyped-type-import=warn\nnonstrict-import=warn\ndeprecated-type=warn\nunsafe-getters-setters=warn\ninexact-spread=warn\nunnecessary-invariant=warn\nsignature-verification-failure=warn\ndeprecated-utility=error\n\n[strict]\ndeprecated-type\nnonstrict-import\nsketchy-null\nunclear-type\nunsafe-getters-setters\nuntyped-import\nuntyped-type-import\n\n[version]\n^0.105.0\n";
				fs.writeFileSync(path.join(distDir, "./.flowconfig"), str);
				// 生成.gitattributes文件
				str = '*.pbxproj -text\n';
				fs.writeFileSync(path.join(distDir, "./.gitattributes"), str);
				// 生成.prettierrc.js文件
				str = "module.exports = {\n  bracketSpacing: false,\n  jsxBracketSameLine: true,\n  singleQuote: true,\n  trailingComma: 'all',\n};\n";
				fs.writeFileSync(path.join(distDir, "./.prettierrc.js"), str);
				// 生成.watchmanconfig文件
				str = "{}";
				fs.writeFileSync(path.join(distDir, "./.watchmanconfig"), str);
			}
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
	});
}
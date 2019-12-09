/// <reference types="funky-react"/>
/// <reference types="funky-react-native"/>
/// <reference path="./types.d.ts"/>

import { reactBundle } from 'funky-react-native/dist/ReactBundleNative';
import App from 'funky-react/dist/mvc/App';
import React from 'react';
import { AppRegistry, UIManager } from 'react-native';
import First from './src/routes/First/First';

AppRegistry.registerComponent("test_native", ()=>main);

function main(props:any):React.ReactElement
{
    // 关闭全部黄色警告
    console.disableYellowBox = true;
    // 允许动画布局
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // 使用高阶组件App对FunkyReact框架进行初始化，从FunkyReactNative中获取bundle对象，并告知入口模块是First
    return <App bundle={reactBundle} first={First}/>;
}
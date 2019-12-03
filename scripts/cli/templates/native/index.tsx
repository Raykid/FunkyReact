/// <reference path="./types.d.ts"/>

import { reactBundle } from 'funky-react-native/dist/ReactBundleNative';
import App from 'funky-react/dist/mvc/App';
import React from 'react';
import { AppRegistry, UIManager } from 'react-native';
import First from './src/routes/First/First';

AppRegistry.registerComponent("test_native", ()=>main);

function main(props:any):React.ReactElement
{
    console.disableYellowBox = true;
    // 初始化
    App.initialize();
    // 允许动画布局
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // 返回结果
    return <App bundle={reactBundle} first={First}/>;
}
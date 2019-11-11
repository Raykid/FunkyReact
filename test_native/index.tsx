/// <reference path="./types.d.ts"/>

import React from 'react';
import { AppRegistry } from 'react-native';
import { reactBundle } from '../src/bundles/native/ReactBundleNative';
import App from '../src/mvc/App';
import { name as appName } from './app.json';
import Landing from './Landing';

AppRegistry.registerComponent(appName, ()=>main);

function main(props:any):React.ReactElement
{
    // 返回结果
    return <App bundle={reactBundle} first={Landing}/>;
}
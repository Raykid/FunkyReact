
/// <reference types="funky-react"/>
/// <reference types="funky-react-dom"/>
/// <reference path="./types.d.ts"/>

import { reactBundle } from 'funky-react-dom/dist/ReactBundleDOM';
import App from 'funky-react/dist/mvc/App';
import React from 'react';
import ReactDOM from 'react-dom';
import './global/global.scss';
import Home from './pages/Home/Home';

ReactDOM.render(
  // 使用高阶组件App对FunkyReact框架进行初始化，从FunkyReactDOM中获取bundle对象，并告知入口模块是Home
  <App bundle={reactBundle} first={Home}/>,
  // 要将FunkyReact渲染到的DOM节点
  document.getElementById('root'),
);

/********************* 下面是移动端需要打开的 *********************/

// 设置rem
const resizeHandler = () => {
  let width = document.body.clientWidth || document.documentElement.clientWidth;
  let height = document.body.clientHeight || document.documentElement.clientHeight;
  document.documentElement.style.fontSize = Math.min(width, height) / 25 + "px";
};
window.addEventListener("resize", resizeHandler);
resizeHandler();
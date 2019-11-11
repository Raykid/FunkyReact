import React from 'react';
import { RouteProps } from 'react-router';

/**
 * 这个接口负责统一DOM和Native两个渲染引擎的差异
 *
 * @author Raykid
 * @date 2019-10-10
 * @export
 * @interface IReactBundle
 */
export default interface IReactBundle
{
    /**
     * 创建一个层容器，要确保脱离文档流、覆盖全屏、不可点击
     *
     * @author Raykid
     * @date 2019-10-10
     * @param {React.ReactNode} [children] 层中对象
     * @returns {React.ReactNode}
     * @memberof IReactBundle
     */
    createLayer(children:React.ReactNode):React.ReactNode;

    /**
     * 创建一个遮罩
     *
     * @author Raykid
     * @date 2019-10-10
     * @param {number} alpha 遮罩透明度，范围是[0, 1]
     * @param {React.ReactNode} [children] 遮罩内要显示的对象
     * @returns {React.ReactNode}
     * @memberof IReactBundle
     */
    createMask(alpha:number, children?:React.ReactNode):React.ReactNode;

    /**
     * 将路由表翻译为可显示的React节点
     *
     * @author Raykid
     * @date 2019-08-08
     * @param {RouteProps[]} routers 路由表数据
     * @returns {React.ReactNode}
     * @memberof IReactBundle
     */
    translateRouters(routers:RouteProps[]):React.ReactNode;

    /**
     * 获取路由模块数量
     *
     * @type {number}
     * @memberof IReactBundle
     */
    readonly routeCount:number;

    /**
     * 获取当前路由路径
     *
     * @type {string}
     * @memberof IReactBundle
     */
    readonly curRoutePath:string;

    /**
     * 推入路由
     *
     * @author Raykid
     * @date 2019-08-08
     * @template P
     * @param {string} path
     * @param {P} [props]
     * @memberof IReactBundle
     */
    pushRoute<P = {}>(path:string, props?:P):void;

    /**
     * 弹出路由
     *
     * @author Raykid
     * @date 2019-08-08
     * @param {number} count 弹出的路由个数
     * @memberof IReactBundle
     */
    popRoute(count:number):void;

    /**
     * 替换路由
     *
     * @author Raykid
     * @date 2019-09-16
     * @template P
     * @param {string} path
     * @param {P} [props]
     * @memberof IReactBundle
     */
    replaceRoute<P = {}>(path:string, props?:P):void;
}
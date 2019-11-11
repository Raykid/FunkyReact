import React from 'react';
import { RouteProps } from 'react-router';
import IReactBundle from '../bundles/IReactBundle';
import ICancelable from '../interfaces/ICancelable';
import MaskModel from '../models/MaskModel';
import { getInject } from '../mvc/Model';

let bundle:IReactBundle;
const routers:RouteProps[] = [];
const routersChangeDatas:[(routers:RouteProps[])=>void, any][] = [];

export interface ReactRouterProps
{
    /**
     * 必须生成一个对应的Bundle对象
     *
     * @type {IReactBundle}
     * @memberof ReactRouterProps
     */
    bundle:IReactBundle;

    /**
     * 首模块
     *
     * @type {ReactRouteClass}
     * @memberof ReactRouterProps
     */
    first:ReactRouteClass;

    /**
     * 首模块参数
     *
     * @type {ReactRouteProps}
     * @memberof ReactRouterProps
     */
    firstProps?:ReactRouteProps;
}

interface ReactRouterState
{
    routers:RouteProps[];
}

/**
 * 将此类作为渲染根组件
 *
 * @author Raykid
 * @date 2019-08-03
 * @export
 * @class ReactRouter
 * @extends {React.Component<{}, {routers:RouteProps[]}>}
 */
export default class ReactRouter extends React.Component<ReactRouterProps, ReactRouterState>
{
    public constructor(props)
    {
        super(props);
        bundle = this.props.bundle;
        if(!bundle)
        {
            throw new Error("必须提供合法的bundle参数");
        }
        this.state = {
            routers,
        };
        // 监听routers变化
        listenRoutersChange(routers=>{
            // 更新最新的routers
            this.setState({
                routers
            });
        });
    }

    public render():React.ReactNode
    {
        return bundle.translateRouters(this.state.routers);
    }
}

export type ReactRouteData = string|string[]|RouteProps;
// export type ReactRouteProps<P = {}> = RouteComponentProps<{}, StaticContext, P>;
export type ReactRouteProps<P = {}> = P;
export type ReactRouteClass<P = {}, S = React.ComponentState> = React.ComponentClass<ReactRouteProps<P>, S>|Promise<{default: React.ComponentClass<ReactRouteProps<P>, S>}>;

/**
 * 记录React路由的装饰器
 *
 * @author Raykid
 * @date 2019-08-03
 * @export
 * @param {ReactRouteData} data 路由数据
 * @returns {ClassDecorator}
 */
export function ReactRoute(data:ReactRouteData):ClassDecorator
{
    return function(cls:any)
    {
        // 整合路由参数
        let props:RouteProps;
        if(typeof data === "string" || Array.isArray(data))
        {
            props = {
                path: data,
                component: cls,
                exact: true
            };
        }
        else
        {
            props = data;
        }
        // 记录路由表，要反向记录，因为装饰器执行顺序和依赖顺序是反着的，被依赖的会先执行
        routers.unshift(props);
        // 触发路由数据变更
        routersChangeDatas.forEach(data=>data[0].call(data[1], routers));
        return cls;
    };
}

/**
 * 监听Routers变化
 *
 * @author Raykid
 * @date 2019-08-05
 * @export
 * @param {(routers:RouteProps[])=>void} handler
 * @param {*} [thisArg]
 */
export function listenRoutersChange(handler:(routers:RouteProps[])=>void, thisArg?:any):void
{
    routersChangeDatas.push([handler, thisArg]);
}

/**
 * 取消监听Routers变化
 *
 * @author Raykid
 * @date 2019-08-05
 * @export
 * @param {(routers:RouteProps[])=>void} handler
 * @param {*} [thisArg]
 */
export function unlistenRoutersChange(handler:(routers:RouteProps[])=>void, thisArg?:any):void
{
    for(let i:number, len:number = routersChangeDatas.length; i < len; i++)
    {
        const [ tempHandler, tempThisArg ] = routersChangeDatas[i];
        if(tempHandler === handler && tempThisArg === thisArg)
        {
            routersChangeDatas.splice(i, 1);
            i --;
            len --;
        }
    }
}

/**
 * 获取当前路由数量
 *
 * @author Raykid
 * @date 2019-09-17
 * @export
 * @returns {number}
 */
export function getRouteCount():number
{
    return bundle.routeCount;
}

/**
 * 推入路由模块
 *
 * @author Raykid
 * @date 2019-08-03
 * @export
 * @template P
 * @template S
 * @param {ReactRouteClass<P, S>} route
 * @param {P} [props]
 * @returns {Promise<void>}
 */
export async function pushRoute<P = {}, S = React.ComponentState>(route:ReactRouteClass<P, S>, props?:P):Promise<void>
{
    const maskModel:MaskModel = getInject(MaskModel);
    const cancel:ICancelable = maskModel.showMask(0);
    const wrapper:React.ComponentClass<ReactRouteProps<P>, S>|{default: React.ComponentClass<ReactRouteProps<P>, S>} = await route;
    const cls:React.ComponentClass<P, S> = wrapper["default"] || wrapper;
    routers.forEach(router=>{
        if(router.component === cls)
        {
            const path:string = Array.isArray(router.path) ? router.path[router.path.length - 1] : router.path;
            bundle.pushRoute(path, props);
        }
    });
    cancel.cancel();
}

/**
 * 弹出顶端路由模块
 *
 * @author Raykid
 * @date 2019-08-08
 * @export
 * @param {number} [count=1] 弹出的路由个数，如果是负数，则表示从前往后的索引数，例如-1表示跳转到第1个路由处。默认为1
 * @returns {Promise<void>}
 */
export async function popRoute(count:number=1):Promise<void>
{
    const totalCount:number = getRouteCount();
    // 如果是负数，表示从前往后的索引数
    if(count < 0)
    {
        count = totalCount + count;
    }
    // 判断最小边界
    if(count < 1)
    {
        count = 1;
    }
    // 判断最大边界
    if(count >= totalCount)
    {
        count = totalCount - 1;
    }
    // 如果还有数量，则开始跳转
    if(count > 0)
    {
        bundle.popRoute(count);
    }
}

/**
 * 替换路由模块
 *
 * @author Raykid
 * @date 2019-09-16
 * @export
 * @template P
 * @template S
 * @param {ReactRouteClass<P, S>} route
 * @param {P} [props]
 * @returns {Promise<void>}
 */
export async function replaceRoute<P = {}, S = React.ComponentState>(route:ReactRouteClass<P, S>, props?:P):Promise<void>
{
    const wrapper:React.ComponentClass<ReactRouteProps<P>, S>|{default: React.ComponentClass<ReactRouteProps<P>, S>} = await route;
    const cls:React.ComponentClass<P, S> = wrapper["default"] || wrapper;
    routers.forEach(router=>{
        if(router.component === cls)
        {
            const path:string = Array.isArray(router.path) ? router.path[router.path.length - 1] : router.path;
            bundle.replaceRoute(path, props);
        }
    });
}
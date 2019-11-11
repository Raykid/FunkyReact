import IReactBundle from 'funky-react/dist/bundles/IReactBundle';
import RouterModel from 'funky-react/dist/models/RouterModel';
import { Inject } from 'funky-react/dist/mvc/Model';
import { Action, createBrowserHistory, History, Location } from 'history';
import React from 'react';
import AnimatedRouter from 'react-animated-router';
import { Redirect, Route, RouteProps, Router, Switch } from 'react-router';
import './ReactBundleDOM.scss';

export default class ReactBundleDOM implements IReactBundle
{
    @Inject
    private _routerModel:RouterModel;

    private _history:History;

    public constructor()
    {
        this._history = createBrowserHistory();
        this._history.listen((location:Location, action:Action)=>{
            this._routerModel.updateRoutes(this.routeCount, this.curRoutePath);
        });
    }

    public createLayer(children:React.ReactNode):React.ReactNode
    {
        return <div className="react-layer">{ children }</div>;
    }

    public createMask(alpha:number, children?:React.ReactNode):React.ReactNode
    {
        return <div className="react-mask">
            <div className="background" style={{
                backgroundColor: "black",
                opacity: alpha,
            }}/>
            { children }
        </div>;
    }

    public translateRouters(routers:RouteProps[]):React.ReactNode
    {
        if(routers.length === 0)
        {
            return <Router history={this._history}>
                <AnimatedRouter>
                    <Switch></Switch>
                </AnimatedRouter>
            </Router>;
        }
        else
        {
            const firstRouter:RouteProps = routers[0];
            const firstPath:string = Array.isArray(firstRouter.path) ? firstRouter.path[firstRouter.path.length - 1] : firstRouter.path;
            return <Router history={this._history}>
                <AnimatedRouter>
                    <Switch>
                        {
                            routers.map(router=>{
                                const path:string = Array.isArray(router.path) ? router.path[router.path.length - 1] : router.path;
                                return <Route key={path} {...router}></Route>;
                            })
                        }
                        <Redirect to={firstPath}></Redirect>
                    </Switch>
                </AnimatedRouter>
            </Router>;
        }
    }

    public get routeCount():number
    {
        return this._history.length;
    }

    public get curRoutePath():string
    {
        return this._history.location.pathname;
    }

    public pushRoute<P = {}>(path:string, props?:P):void
    {
        this._history.push(path, props);
    }

    public popRoute(count:number):void
    {
        if(count > 0)
        {
            this._history.go(-count);
        }
    }

    public replaceRoute<P = {}>(path:string, props?:P):void
    {
        this._history.replace(path, props);
    }
}
// 导出一个实例
export const reactBundle:IReactBundle = new ReactBundleDOM();
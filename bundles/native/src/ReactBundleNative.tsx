import IReactBundle from 'funky-react/dist/bundles/IReactBundle';
import RouterModel from 'funky-react/dist/models/RouterModel';
import { Inject } from 'funky-react/dist/mvc/Model';
import React from 'react';
import { View } from 'react-native';
import { Actions, Router, Scene } from 'react-native-router-flux';
import { createStyleSheet, mergeStyles, Style } from 'react-native-visitor/ReactNativeVisitor';
import { RouteProps } from 'react-router';

export default class ReactBundleNative implements IReactBundle
{
    @Inject
    private _routerModel:RouterModel;

    private _curRoutes:any[] = [];

    public constructor()
    {
        Actions.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    public createLayer(children:React.ReactNode):React.ReactNode
    {
        return <View style={styles.layer} pointerEvents={children ? "auto" : "none"}>{ children }</View>;
    }

    public createMask(alpha:number, children?:React.ReactNode):React.ReactNode
    {
        return <View style={styles.mask}>
            <View style={mergeStyles(styles.mask, {
                backgroundColor: "black",
                opacity: alpha,
            })}/>
            { children }
        </View>;
    }

    private onNavigationStateChange(prevState, currentState, action):void
    {
        switch(action.type)
        {
            case "Navigation/INIT":
            case "Navigation/COMPLETE_TRANSITION":
                this._curRoutes = currentState.routes[0].routes;
                this._routerModel.updateRoutes(this.routeCount, this.curRoutePath);
                break;
        }
    }

    public translateRouters(routers:RouteProps[]):React.ReactNode
    {
        return <Router>
            <View>
                <Scene hideNavBar>
                {
                    routers.map(router=>{
                        const path:string = Array.isArray(router.path) ? router.path[router.path.length - 1] : router.path;
                        return <Scene gesturesEnabled={false} key={path} {...router}></Scene>;
                    })
                }
                </Scene>
            </View>
        </Router>;
    }

    public get routeCount():number
    {
        return this._curRoutes.length;
    }

    public get curRoutePath():string
    {
        const curRoute = this._curRoutes[this._curRoutes.length - 1];
        return curRoute && curRoute.routeName;
    }

    public pushRoute<P = {}>(path:string, props?:P):void
    {
        Actions.push(path, props);
    }

    public popRoute(count:number):void
    {
        const pop:Function = Actions.pop;
        while(count-- > 0)
        {
            try
            {
                pop.call(Actions, {
                    refresh: {
                        from: Actions.currentScene
                    }
                });
            }
            catch(err)
            {
            }
        }
    }

    public replaceRoute<P = {}>(path:string, props?:P):void
    {
        Actions.replace(path, props);
    }
}

const styles = createStyleSheet({
    layer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    } as Style,

    mask: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    } as Style,
});

// 导出一个实例
export const reactBundle:IReactBundle = new ReactBundleNative();

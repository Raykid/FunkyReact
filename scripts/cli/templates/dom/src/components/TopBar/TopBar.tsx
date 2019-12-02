import RouterModel from 'funky-react/dist/models/RouterModel';
import Mediator from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import './TopBar.scss';

export interface TopBarProps
{
    /**
     * TopBar显示标题
     *
     * @type {string}
     * @memberof TopBarProps
     */
    title?:string;
}

interface TopBarState
{
    curRouteCount:number;
}

export default class TopBar extends Mediator<TopBarProps, TopBarState>
{
    @Inject
    private _routerModel:RouterModel;

    public constructor(props:TopBarProps)
    {
        super(props);
        this.state = {
            curRouteCount: this._routerModel.routeCount,
        };
    }

    public render():React.ReactNode
    {
        return <div className="top-bar">
            { this.props.title && <div className="title">{ this.props.title }</div> }
            {
                this.props.children && <div className="children-container">
                    { this.props.children }
                </div>
            }
            {
                this.state.curRouteCount > 1 && <div className="back-button" onClick={()=>{
                    // 点击回退路由
                    popRoute();
                }}/>
            }
        </div>;
    }
}
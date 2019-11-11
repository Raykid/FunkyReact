import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { pushRoute } from 'funky-react/dist/router/ReactRouter';
import React from "react";
import Second from '../Second/Second';
import './First.scss';

@MediatorClass("/first")
export default class First extends BaseScene
{
    public render():React.ReactNode
    {
        return <div className="first">
            <div className="title">这是第一个模块</div>
            <div className="button" onClick={()=>{
                pushRoute(Second);
            }}>点我</div>
        </div>;
    }
}
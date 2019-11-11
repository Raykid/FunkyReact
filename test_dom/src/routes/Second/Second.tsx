import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import './Second.scss';

@MediatorClass("/second")
export default class Second extends BaseScene
{
    public render():React.ReactNode
    {
        return <div className="second">
            <div className="title">这是第二个模块</div>
            <div className="button" onClick={()=>{
                popRoute();
            }}>返回</div>
        </div>;
    }
}
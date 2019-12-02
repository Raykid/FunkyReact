import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import TopBar from '../../components/TopBar/TopBar';
import PromptModel from '../../models/PromptModel';
import './Second.scss';

export interface SecondProps
{
}

interface SecondState
{
}

@MediatorClass("/second")
export default class Second extends BaseScene<SecondProps, SecondState>
{
    @Inject
    private _promptModel:PromptModel;

    public componentDidMount():void
    {
        this._promptModel.alert("你来到了第二个模块儿", "这是Alert");
    }

    public render():React.ReactNode
    {
        return <div className="second">
            <TopBar title="第二个模块儿"/>
            <div className="content">
                <div className="title">这是第二个模块儿</div>
                <div className="button" onClick={()=>{
                    this._promptModel.confirm("确定回去吗？", "这是Confirm", ()=>{
                        popRoute();
                    });
                }}>回去</div>
            </div>
        </div>;
    }
}
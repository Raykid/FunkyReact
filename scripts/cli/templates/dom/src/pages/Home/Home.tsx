import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import DialogModel from 'funky-react/dist/models/DialogModel';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import { pushRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import TopBar from '../../components/TopBar/TopBar';
import TestDialog from '../../dialogs/TestDialog/TestDialog';
import Second from '../Second/Second';
import './Home.scss';

export interface HomeProps
{
}

interface HomeState
{
}

/**
 * 这是首页路由页面
 *
 * @author Raykid
 * @date 2019-12-02
 * @export
 * @class Home
 * @extends {BaseScene<HomeProps, HomeState>}
 */
@MediatorClass("/home")
export default class Home extends BaseScene<HomeProps, HomeState>
{
    @Inject
    private _dialogModel:DialogModel;

    public constructor(props:HomeProps)
    {
        super(props);
        this.state = {};
    }

    public render():React.ReactNode
    {
        return <div className="home">
            <TopBar title="首页">
                <div className="test-dialog-button" onClick={()=>{
                    this._dialogModel.openDialog(TestDialog);
                }}>测试弹窗</div>
            </TopBar>
            <div className="content">
                <div className="title">这是首个模块儿</div>
                <div className="button" onClick={()=>{
                    pushRoute(Second);
                }}>测试模块跳转</div>
            </div>
        </div>;
    }
}
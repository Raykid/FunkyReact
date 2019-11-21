import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import DialogModel from 'funky-react/dist/models/DialogModel';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import React from 'react';
import TestDialog from '../../dialogs/TestDialog';
import './Second.scss';

@MediatorClass("/second")
export default class Second extends BaseScene
{
    @Inject
    private _dialogModel:DialogModel;

    public render():React.ReactNode
    {
        return <div className="second">
            <div className="title">这是第二个模块</div>
            <div className="button" onClick={()=>{
                this._dialogModel.openDialog(TestDialog, {
                    msg: "这是传入参数",
                });
            }}>返回</div>
        </div>;
    }
}
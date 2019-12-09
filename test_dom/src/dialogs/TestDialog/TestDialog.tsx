import Dialog from 'funky-react-dom/dist/components/Dialog/Dialog';
import ICancelable from 'funky-react/dist/interfaces/ICancelable';
import { Inject } from 'funky-react/dist/mvc/Model';
import { system } from 'funky-react/dist/utils/System';
import React from 'react';
import LoadingMaskModel from '../../models/LoadingMaskModel';
import './TestDialog.scss';

export default class TestDialog extends Dialog
{
    @Inject
    private _loadingMaskModel:LoadingMaskModel;
    
    public render():React.ReactNode
    {
        return <div className="test-dialog">
            <div className="button" onClick={()=>{
                const cancel:ICancelable = this._loadingMaskModel.showLoading();
                system.setTimeout(3000, ()=>{
                    cancel.cancel();
                });
            }}>测试Loading 3秒</div>
            <div className="button" onClick={()=>{
                window.open("./dist/report.html");
            }}>看看打包报告</div>
            <div className="close-button" onClick={()=>{
                this.close();
            }}>×</div>
        </div>;
    }
}
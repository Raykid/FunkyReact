import Dialog from 'funky-react-dom/dist/components/Dialog/Dialog';
import { DialogProps, DialogState } from 'funky-react/dist/components/Dialog/BaseDialog';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import './TestDialog.scss';

export interface TestDialogProps extends DialogProps
{
    msg:string;
}

interface TestDialogState extends DialogState
{
}

export default class TestDialog extends Dialog<TestDialogProps, TestDialogState>
{
    public render():React.ReactNode
    {
        return <div className="test-dialog">
            <div className="container">
                <div className="msg">{ this.props.msg }</div>
                <div className="button" onClick={async ()=>{
                    await this.close();
                    popRoute();
                }}>点击后退</div>
            </div>
        </div>;
    }
}
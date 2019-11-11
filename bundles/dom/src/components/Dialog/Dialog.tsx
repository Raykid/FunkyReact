import BaseDialog, { DialogProps, DialogState } from 'funky-react/dist/components/Dialog/BaseDialog';
import React from 'react';
import './Dialog.scss';
import BackDialogPolicy from './policies/BackDialogPolicy';

export default class Dialog<P extends DialogProps = DialogProps, S extends DialogState = DialogState> extends BaseDialog<P, S>
{
    public componentDidMount():void
    {
        if(!this.state.policy)
        {
            this.syncState({
                policy: BackDialogPolicy.instance
            })
        }
    }

    protected onRender():React.ReactNode
    {
        return <>{
            this.state.show && <div className="dialog">
                <div className="dialog-modal-mask" style={{opacity: 0.5}}></div>
                <div className="dialog-content" ref="content">
                    {super.onRender()}
                </div>
            </div>
        }</>;
    }
}
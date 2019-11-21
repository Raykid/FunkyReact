import React from 'react';
import { AnyAction } from 'redux';
import BaseDialog, { DialogProps, DialogState as _DialogState } from '../components/Dialog/BaseDialog';
import ICancelable, { createICancelable } from '../interfaces/ICancelable';
import Model, { Inject, ModelClass } from '../mvc/Model';
import { getCurApp } from '../mvc/MVC';
import Dictionary from '../utils/Dictionary';
import { createReactNode } from '../utils/ReactUtil';
import MaskModel from './MaskModel';

interface DialogState
{
    dialogs:BaseDialog[];
}

@ModelClass
export default class DialogModel extends Model<DialogState>
{
    @Inject
    private _maskModel:MaskModel;

    private _dialogCancelDict:Dictionary<{node:React.ReactNode}, ICancelable> = new Dictionary();

    /**
     * 获取弹窗数量
     *
     * @readonly
     * @type {number}
     * @memberof DialogModel
     */
    public get dialogCount():number
    {
        return this._dialogCancelDict.keys.length;
    }

    public handleAction(state:Readonly<DialogState>, action:AnyAction):DialogState
    {
        if(!state)
        {
            state = {
                dialogs: [],
            };
        }
        switch(action.type)
        {
        }
        return state;
    }

    private updateDialogs():void
    {
        const dialogs = this._dialogCancelDict.keys.map(key=>key.node);
        getCurApp().updateDialogs(dialogs);
    }

    private _dialogIndex:number = 0;
    /**
     * 显示一个弹窗
     *
     * @author Raykid
     * @template P
     * @template CD
     * @param {{new(props:P):BaseDialog<P>}} cls 弹窗类型
     * @param {P} [props={} as P] 弹窗参数
     * @returns {ICancelable<CD>} 可关闭弹窗的对象
     * @memberof DialogModel
     */
    /**
     *
     *
     * @author Raykid
     * @date 2019-11-21
     * @template P
     * @template CD
     * @param {{new(props:P):BaseDialog<P>}} cls
     * @param {P} [props={} as P]
     * @returns {ICancelable<CD>}
     * @memberof DialogModel
     */
    public openDialog<P extends DialogProps = DialogProps, S extends _DialogState = _DialogState, CD = void>(cls:{new(props:P):BaseDialog<P, S, CD>}, props:P={} as P):ICancelable<CD>
    {
        const cancelMask:ICancelable = this._maskModel.showMask(0.5);
        let dialog:BaseDialog<P, S, CD>;
        const node:React.ReactNode = createReactNode(cls, {...props, key: "dialog_" + (++ this._dialogIndex)}, null, ref=>{
            dialog = ref;
            if(dialog)
            {
                // 显示弹窗
                dialog.open();
                // 篡改close方法
                const oriClose = dialog.close;
                dialog.close = async (data?:CD)=>{
                    // 移除添加的方法
                    delete dialog.close;
                    // 调用原始方法
                    closeData = await oriClose.call(dialog, data);
                    // 移除记录
                    const cancel:ICancelable = this._dialogCancelDict.delete(key);
                    // 为了确保取消，调用cancel方法
                    cancel.cancel();
                    // 更新显示
                    this.updateDialogs();
                    // 返回结果
                    return closeData;
                };
            }
            cancelMask.cancel();
        });
        const key:{node:React.ReactNode} = { node };
        let closeData:CD;
        const cancel:ICancelable<CD> = createICancelable<CD>(()=>{
            cancelMask.cancel();
            dialog.close(closeData);
            return closeData;
        });
        // 记录
        this._dialogCancelDict.set(key, cancel);
        // 更新显示
        this.updateDialogs();
        // 返回可关闭弹窗的对象
        return cancel;
    }
}
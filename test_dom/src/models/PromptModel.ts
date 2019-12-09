import { DialogProps } from 'funky-react/dist/components/Dialog/BaseDialog';
import DialogModel from 'funky-react/dist/models/DialogModel';
import Model, { getInject, ModelClass } from 'funky-react/dist/mvc/Model';
import { AnyAction } from 'redux';
import Prompt from '../dialogs/Prompt/Prompt';

export enum EnumPromptButtonType
{
    normal,
    important,
}

export interface PromptButton
{
    /**
     * 按钮数据
     *
     * @type {*}
     * @memberof PromptButton
     */
    data:any;

    /**
     * 按钮文本，如没有提供则使用data.toString()
     *
     * @type {string}
     * @memberof PromptButton
     */
    text?:string;

    /**
     * 按钮样式
     *
     * @type {EnumPromptButtonType}
     * @memberof PromptButton
     */
    type?:EnumPromptButtonType;

    /**
     * 按钮点击回调
     *
     * @memberof PromptButton
     */
    handler?:(data:any)=>void;
}

export interface PromptData
{
    /**
     * 标题文本
     *
     * @type {string}
     * @memberof PromptProps
     */
    title?:string;

    /**
     * 内容文本
     *
     * @type {string}
     * @memberof PromptProps
     */
    content?:string;

    /**
     * 按钮数据
     *
     * @type {PromptButton}
     * @memberof PromptProps
     */
    buttons?:PromptButton[];
}

export interface PromptProps extends DialogProps
{
    /**
     * 通用提示框数据
     *
     * @type {PromptData}
     * @memberof PromptProps
     */
    data:PromptData;
}

export interface PromptState
{
}

@ModelClass
export default class PromptModel extends Model<PromptState>
{
    /**
     * 弹出一个包含任意按钮的弹窗
     *
     * @author Raykid
     * @date 2019-09-09
     * @param {string} [content]
     * @param {string} [title]
     * @param {PromptButton[]} [buttons]
     * @memberof PromptModel
     */
    public prompt(content?:string, title?:string, buttons?:PromptButton[]):void
    {
        // 弹出Prompt弹窗
        getInject(DialogModel).openDialog(Prompt, {
            data: {
                title,
                content,
                buttons,
            },
        });
    }

    /**
     * 弹出一个仅包含一个"确定"按钮的弹窗
     *
     * @author Raykid
     * @date 2019-09-09
     * @param {string} [content]
     * @param {string} [title]
     * @param {()=>{}} [handler]
     * @memberof PromptModel
     */
    public alert(content?:string, title?:string, handler?:()=>void):void
    {
        this.prompt(
            content,
            title,
            [
                {
                    data: "确定",
                    handler,
                    type: EnumPromptButtonType.important,
                }
            ]
        );
    }

    /**
     * 弹出一个包含“确定”和“取消”两个按钮的弹窗
     *
     * @author Raykid
     * @date 2019-09-09
     * @param {string} [content]
     * @param {string} [title]
     * @param {()=>void} [confirmHandler]
     * @param {()=>void} [cancelHandler]
     * @memberof PromptModel
     */
    public confirm(content?:string, title?:string, confirmHandler?:()=>void, cancelHandler?:()=>void):void
    {
        this.prompt(
            content,
            title,
            [
                {
                    data: "取消",
                    handler: cancelHandler,
                },
                {
                    data: "确定",
                    handler: confirmHandler,
                    type: EnumPromptButtonType.important,
                }
            ]
        );
    }

    public handleAction(state:Readonly<PromptState>, action:AnyAction):PromptState
    {
        if(!state)
        {
            state = {
            };
        }
        switch(action.type)
        {
        }
        return state;
    }
}
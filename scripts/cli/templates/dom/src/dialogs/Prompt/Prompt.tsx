import Dialog from 'funky-react-dom/dist/components/Dialog/Dialog';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import React from 'react';
import { EnumPromptButtonType, PromptProps } from '../../models/PromptModel';
import './Prompt.scss';

@MediatorClass
export default class Prompt extends Dialog<PromptProps>
{
    public render():React.ReactNode
    {
        return <div className="prompt-dialog">
            <div className="title">{ this.props.data.title }</div>
            <div className="content">{ this.props.data.content }</div>
            <div className="button-container">
            {
                this.props.data.buttons && this.props.data.buttons.map((button, i)=>{
                    const buttonClasses:string[] = ["button", EnumPromptButtonType[(button.type || EnumPromptButtonType.normal)]];
                    return <div key={"button_" + i} className={buttonClasses.join(" ")} onClick={()=>{
                        // 先关闭自身
                        this.close();
                        // 调用回调
                        button.handler && button.handler(button.data);
                    }}>
                        { button.text || button.data.toString() }
                    </div>;
                })
            }
            </div>
        </div>;
    }
}
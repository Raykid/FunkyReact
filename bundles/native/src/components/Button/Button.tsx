import Mediator from 'funky-react/dist/mvc/Mediator';
import { system } from 'funky-react/dist/utils/System';
import React from 'react';
import { GestureResponderEvent, TouchableHighlight, TouchableHighlightProps, TouchableNativeFeedback, TouchableNativeFeedbackProps, TouchableOpacity, TouchableOpacityProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native';

export interface ButtonProps<P extends TouchableWithoutFeedbackProps> extends TouchableWithoutFeedbackProps
{
    /**
     * 可触摸渲染器类型
     *
     * @type {React.ComponentClass<P>}
     * @memberof ButtonProps
     */
    touchableClass:React.ComponentClass<P>;

    /**
     * disable的时长，单位毫秒，默认300
     *
     * @type {number}
     * @memberof ButtonProps
     */
    disableDuration?:number;
}

interface ButtonState
{
    disableDuration:number;
}

export default class Button<P extends TouchableWithoutFeedbackProps> extends Mediator<ButtonProps<P>, ButtonState>
{
    private static _globalCooldown:boolean = false;

    /**
     * 添加一个公共冷却延时
     *
     * @author Raykid
     * @date 2019-11-08
     * @static
     * @param {number} duration
     * @returns {Promise<void>}
     * @memberof Button
     */
    public static async delayCooldown(duration:number):Promise<void>
    {
        if(duration > 0)
        {
            // 禁用
            Button._globalCooldown = true;
            // 延时恢复
            system.setTimeout(duration, ()=>{
                Button._globalCooldown = false;
            });
        }
    }

    public constructor(props:ButtonProps<P>)
    {
        super(props);
        this.state = {
            disableDuration: props.disableDuration != null && props.disableDuration >= 0 ? props.disableDuration : 300,
        };
    }

    public render():React.ReactNode
    {
        // 组织类型
        const classWrapper:any = { touchableClass: this.props.touchableClass };
        // 组织参数
        const propsWrapper:any = {
            ...this.props,
            disabled: this.props.disabled,
            onPress: async (event:GestureResponderEvent)=>{
                if(!Button._globalCooldown)
                {
                    // 添加冷却
                    Button.delayCooldown(this.state.disableDuration);
                    // 调用回调
                    try
                    {
                        this.props.onPress && this.props.onPress(event);
                    }
                    catch(err)
                    {
                    }
                }
            },
        };
        delete propsWrapper.touchableClass;
        delete propsWrapper.children;
        // 渲染
        return <classWrapper.touchableClass {...propsWrapper}>
            { this.props.children }
        </classWrapper.touchableClass>;
    }
}

export type ButtonPropsWrapper<P> = Omit<ButtonProps<P>, "touchableClass"> & P;

export class ButtonWithoutFeedback<P extends TouchableWithoutFeedbackProps> extends Mediator<ButtonPropsWrapper<P>>
{
    public render():React.ReactNode
    {
        return <Button touchableClass={TouchableWithoutFeedback} {...this.props}>
            { this.props.children }
        </Button>;
    }
}

export class ButtonOpacity<P extends TouchableOpacityProps> extends Mediator<ButtonPropsWrapper<P>>
{
    public render():React.ReactNode
    {
        return <Button touchableClass={TouchableOpacity} {...this.props}>
            { this.props.children }
        </Button>;
    }
}

export class ButtonHighlight<P extends TouchableHighlightProps> extends Mediator<ButtonPropsWrapper<P>>
{
    public render():React.ReactNode
    {
        return <Button touchableClass={TouchableHighlight} {...this.props}>
            { this.props.children }
        </Button>;
    }
}

export class ButtonNativeFeedback<P extends TouchableNativeFeedbackProps> extends Mediator<ButtonPropsWrapper<P>>
{
    public render():React.ReactNode
    {
        return <Button touchableClass={TouchableNativeFeedback} {...this.props}>
            { this.props.children }
        </Button>;
    }
}
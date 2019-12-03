import React, { ErrorInfo } from 'react';
import { connect, shallowEqual } from 'react-redux';
import { AnyAction } from 'redux';
import ICancelable from '../interfaces/ICancelable';
import { ReactRoute, ReactRouteData } from '../router/ReactRouter';
import { mvc } from './MVC';

/**
 * 中介者基类
 *
 * @author Raykid
 * @export
 * @class Mediator
 * @extends {React.Component<P, S, SS>}
 * @template P
 * @template S
 * @template SS
 */
export default class Mediator<P = {}, S = {}, SS = any> extends React.Component<P, S, SS>
{
    private _oriRender:()=>React.ReactNode;
    private _cancelables:ICancelable[];
    private _unmounted:boolean = false;

    public constructor(props:P)
    {
        super(props);
        // 篡改render方法，改为调用自己的
        this._oriRender = this.render;
        this.render = this.onRender;
    }

    protected onRender():React.ReactNode
    {
        // 直接转调，如果有渲染函数，则交给渲染函数渲染，否则渲染子节点
        return this._oriRender ? this._oriRender.call(this) : this.props.children;
    }

    protected dispatch(action:AnyAction):AnyAction
    {
        return mvc.store.dispatch(action);
    }
    
    /**
     * 该方法为setState的包装方法，将之前同步执行的方式包装为异步执行
     *
     * @author Raykid
     * @protected
     * @template K
     * @param {(((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null))} state
     * @returns {Promise<void>}
     * @memberof Mediator
     */
    protected syncState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
    ):Promise<void>
    {
        return new Promise(resolve=>{
            if(!this._unmounted)
            {
                this.setState(state, resolve);
            }
            else
            {
                resolve();
            }
        });
    }

    /**
     * 重写setState方法，增加浅表对比，如果各项都相同则不进行更新
     *
     * @author Raykid
     * @template K
     * @param {(((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null))} state
     * @param {() => void} [callback]
     * @memberof Mediator
     */
    public setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
        callback?: () => void
    ):void
    {
        if(!this.state)
        {
            super.setState(state, callback);
        }
        else
        {
            // 如果传入的是方法，则执行使其变为对象
            if(state instanceof Function)
            {
                state = state(this.state, this.props);
            }
            if(!state)
            {
                // 传入的是null的话则变为强制更新
                this.forceUpdate(callback);
            }
            else
            {
                // 进行一次浅表对比，传入的必须是个对象才能进行对比
                let needSet:boolean = false;
                for(let key of Object.keys(state))
                {
                    if(state[key] !== this.state[key])
                    {
                        needSet = true;
                        break;
                    }
                }
                if(needSet)
                {
                    // 不同，调用父级方法
                    super.setState(state, callback);
                }
                else
                {
                    // 相同则直接回调
                    callback && callback();
                }
            }
        }
    }

    /**
     * 托管可取消对象
     *
     * @author Raykid
     * @param {ICancelable} cancelable
     * @returns {ICancelable} 将被托管的对象再返回回来
     * @memberof Mediator
     */
    public delegateCancelable(cancelable:ICancelable):ICancelable
    {
        if(!cancelable.canceled)
        {
            if(this._unmounted)
            {
                // 组件已注销，直接cancel
                cancelable.cancel();
            }
            else
            {
                if(!this._cancelables)
                {
                    this._cancelables = [];
                }
                if(this._cancelables.indexOf(cancelable) < 0)
                {
                    this._cancelables.push(cancelable);
                    // 如果提前被cancel了，则移除之，防止销毁时列表过长
                    cancelable.then(()=>{
                        const index:number = this._cancelables ? this._cancelables.indexOf(cancelable) : -1;
                        if(index >= 0)
                        {
                            this._cancelables.splice(index, 1);
                        }
                    });
                }
            }
        }
        return cancelable;
    }

    public componentWillMount():void
    {
        // 子类可重写
    }

    public UNSAFE_componentWillMount():void
    {
        // 子类可重写
    }

    public componentWillReceiveProps(nextProps:Readonly<P>, nextContext:any):void
    {
        // 子类可重写
    }
    
    public UNSAFE_componentWillReceiveProps(nextProps:Readonly<P>, nextContext:any):void
    {
        // 子类可重写
    }
    
    public componentWillUpdate(nextProps:Readonly<P>, nextState:Readonly<S>, nextContext:any):void
    {
        // 子类可重写
    }
    
    public UNSAFE_componentWillUpdate(nextProps:Readonly<P>, nextState:Readonly<S>, nextContext:any):void
    {
        // 子类可重写
    }

    public componentDidMount():void
    {
        // 子类可重写
    }

    public shouldComponentUpdate(nextProps:Readonly<P>, nextState:Readonly<S>, nextContext:any):boolean
    {
        // 子类可重写
        // 默认对props和state进行浅表对比
        return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
    }

    public componentDidCatch(error:Error, errorInfo:ErrorInfo):void
    {
        // 子类可重写
    }

    public componentWillUnmount():void
    {
        this._unmounted = true;
        // 子类可重写
        if(this._cancelables)
        {
            for(let i:number = 0, len:Number = this._cancelables.length; i < len; i++)
            {
                this._cancelables.pop().cancel();
            }
            this._cancelables = null;
        }
    }
}

/**
 * 无参数组件装饰器
 *
 * @author Raykid
 * @export
 * @param {typeof React.Component} prototype
 */
export function MediatorClass(prototype:typeof React.Component):any;
/**
 * 参数化组件装饰器
 *
 * @author Raykid
 * @export
 * @param {ReactRouteData} route 路由数据
 * @returns {ClassDecorator}
 */
export function MediatorClass(route:ReactRouteData):ClassDecorator;
/**
 * @private
 */
export function MediatorClass(arg:typeof React.Component|ReactRouteData):ClassDecorator|typeof React.Component
{
    if(typeof arg === "function")
    {
        // 是无参数装饰器
        let cls:typeof React.Component = arg;
        cls = connect(state=>{
            return { state };
        }, null, null, {forwardRef: true})(cls) as any;
        return cls;
    }
    else
    {
        // 是有参数装饰器，转调ReactRoute装饰器
        const route:ReactRouteData = arg;
        const clsMapper:(cls:typeof React.Component)=>typeof React.Component = ReactRoute.call(this, route);
        return function(cls:any):any
        {
            cls = connect(state=>{
                return { state };
            }, null, null, {forwardRef: true})(cls);
            cls = clsMapper.call(this, cls);
            return cls;
        };
    }
}
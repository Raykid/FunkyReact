import React from 'react';
import { Provider } from 'react-redux';
import { AnyAction, createStore } from 'redux';
import IReactBundle from '../bundles/IReactBundle';
import ReactRouter, { ReactRouterProps } from '../router/ReactRouter';
import { getModelName, modelDict } from './Model';
import { IApp, mvc, setCurApp } from './MVC';

interface LayerProps
{
    bundle:IReactBundle;
}

interface LayerState
{
    children:React.ReactNode;
}

class Layer extends React.Component<LayerProps, LayerState>
{
    public constructor(props:LayerProps)
    {
        super(props);
        this.state = {
            // 初始子节点使用参数传入的
            children: this.props.children,
        };
    }

    /**
     * 更新内容
     *
     * @author Raykid
     * @param {React.ReactNode} children
     * @returns {Promise<void>}
     * @memberof Layer
     */
    public async updateChildren(children:React.ReactNode):Promise<void>
    {
        if(!children)
        {
            children = null;
        }
        if(Array.isArray(children) && children.length === 0)
        {
            children = null;
        }
        this.setState({
            children,
        });
    }

    public render():React.ReactNode
    {
        return this.props.bundle.createLayer(this.state.children);
    }
}

/**
 * App组件为最外层高阶组件，包装了redux的Provider作为数据提供商，以及ReactRouter组件作为router实现
 *
 * @author Raykid
 * @export
 * @class App
 * @extends {React.Component<ReactRouterProps>}
 */
export default class App extends React.Component<ReactRouterProps> implements IApp
{
    private static _initialized:boolean = false;

    public static initialize():void
    {
        if(!App._initialized)
        {
            // 生成react store
            mvc.store = createStore((state:any = {}, action:AnyAction)=>{
                const newResult:any = {};
                let hasChange:boolean = false;
                for(let model of modelDict.values)
                {
                    const name:string = getModelName(model);
                    const prevState:any = state[name];
                    // 新状态要被冻结，因为redux不允许修改状态，只能新建
                    newResult[name] = model.handleAction(prevState, action);
                    if(!hasChange && newResult[name] !== prevState)
                    {
                        hasChange = true;
                    }
                }
                return hasChange ? newResult : state;
            }/*, composeWithDevTools(applyMiddleware(
                createLogger({collapsed: true, diff: true})
            ))*/);
            App._initialized = true;
        }
    }

    public constructor(props:ReactRouterProps)
    {
        super(props);
        setCurApp(this);
        if(!App._initialized)
        {
            console.warn("建议在渲染App之前先执行App.initialize()方法");
            App.initialize();
        }
    }

    private _dialogLayer:Layer;
    private _maskLayer:Layer;

    /**
     * 更新弹窗
     *
     * @author Raykid
     * @param {React.ReactNode[]} dialogs 弹窗列表
     * @returns {Promise<void>}
     * @memberof App
     */
    public async updateDialogs(dialogs:React.ReactNode[]):Promise<void>
    {
        await this._dialogLayer.updateChildren(dialogs);
    }

    /**
     * 更新遮罩
     *
     * @author Raykid
     * @param {boolean} shown 是否显示遮罩
     * @param {number} [alpha=0] 遮罩透明度，范围[0, 1]
     * @param {React.ReactNode} [children] 子对象
     * @returns {Promise<void>}
     * @memberof App
     */
    public async updateMask(shown:boolean, alpha:number=0, children?:React.ReactNode):Promise<void>
    {
        await this._maskLayer.updateChildren(shown && this.props.bundle.createMask(alpha, children));
    }

    public render():React.ReactNode
    {
        return <Provider store={mvc.store}>
            {/* 场景层，用ReactRouter实现 */}
            <ReactRouter {...this.props}/>
            {/* 弹窗层 */}
            <Layer ref={ref=>this._dialogLayer = ref} bundle={this.props.bundle}/>
            {/* 遮罩层 */}
            <Layer ref={ref=>this._maskLayer = ref} bundle={this.props.bundle}/>
        </Provider>;
    }
}
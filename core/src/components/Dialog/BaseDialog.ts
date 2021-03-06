import Mediator from '../../mvc/Mediator';
import { IMiddleware, runMiddlewares } from '../../utils/MiddlewareUtil';
import IDialogPolicy from './IDialogPolicy';

export interface DialogProps
{
    /**
     * 弹出策略
     *
     * @type {IDialogPolicy}
     * @memberof DialogProps
     */
    policy?:IDialogPolicy;

    /**
     * 开启回调
     *
     * @type {IMiddleware}
     * @memberof DialogProps
     */
    onOpen?:IMiddleware;

    /**
     * 关闭回调
     *
     * @type {IMiddleware}
     * @memberof DialogProps
     */
    onClose?:IMiddleware;
}

export interface DialogState
{
    show:boolean;
    policy:IDialogPolicy;
}

export default class BaseDialog<P extends DialogProps = DialogProps, S extends DialogState = DialogState, CD = void> extends Mediator<P, S>
{
    private _closeData:CD;

    public get shown():boolean
    {
        return this.state.show;
    }

    public constructor(props:P)
    {
        super(props);
        this.state = {
            show: false,
            policy: props.policy,
        } as S & DialogState;
    }

    public onOpen(context:P, next:()=>Promise<void>):void|Promise<void>
    {
        // 留待子类完善
    }

    /**
     * 打开弹窗
     *
     * @author Raykid
     * @returns {Promise<void>}
     * @memberof BaseDialog
     */
    public async open():Promise<void>
    {
        if(!this.state.show)
        {
            // 运行中间件
            await runMiddlewares([
                this.props.onOpen,
                (context, next)=>this.onOpen(context, next),
                async ()=>{
                    // 设置开启
                    await this.syncState({
                        show: true
                    });
                    // 调用Policy
                    this.state.policy && this.state.policy.open && await this.state.policy.open(this.refs.content as Element);
                }
            ], this.props);
        }
    }

    public onClose(context:CD, next:()=>Promise<void>):void|Promise<void>
    {
        // 留待子类完善
    }

    /**
     * 关闭弹窗
     *
     * @author Raykid
     * @param {CD} [data] 关闭参数
     * @returns {Promise<CD>}
     * @memberof BaseDialog
     */
    public async close(data?:CD):Promise<CD>
    {
        if(this.state.show)
        {
            this._closeData = data;
            // 运行中间件
            try
            {
                await runMiddlewares([
                    this.props.onClose,
                    (context, next)=>this.onClose(context, next),
                    async ()=>{
                        // 调用Policy
                        this.state.policy && this.state.policy.close && await this.state.policy.close(this.refs.content as Element);
                        // 设置关闭
                        await this.syncState({
                            show: false
                        });
                    }
                ], data);
            }
            catch(err)
            {}
        }
        return this._closeData;
    }
}
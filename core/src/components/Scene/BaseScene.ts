import RouterModel from '../../models/RouterModel';
import Mediator from '../../mvc/Mediator';
import { Inject } from '../../mvc/Model';
import { system } from '../../utils/System';

export default class BaseScene<P = {}, S = {}, SS = any> extends Mediator<P , S, SS>
{
    @Inject
    private __routerModel:RouterModel;

    private _entered:boolean = false;

    public constructor(props)
    {
        super(props);
        if(props.name)
        {
            this.delegateCancelable(this.__routerModel.listenRoutesChange(this.onRoutesChange.bind(this)));
            this.onRoutesChange(this.__routerModel.curRoutePath, props.name);
        }
    }

    private onRoutesChange(fromPath:string, toPath:string):void
    {
        const myName:string = this.props["name"];
        if(myName)
        {
            if(this._entered)
            {
                if(fromPath === myName)
                {
                    this._entered = false;
                    this.onExit(toPath);
                }
            }
            else
            {
                if(toPath === myName)
                {
                    this._entered = true;
                    this.onEnter(fromPath);
                }
            }
        }
    }

    public onEnter(fromPath:string):void
    {
        // 子类可重写此方法
    }

    public onExit(toPath:string):void
    {
        // 子类可重写此方法
    }

    public componentWillUnmount():void
    {
        // 这里也要调用一次onExit
        system.nextFrame(()=>{
            this.onExit(this.__routerModel.curRoutePath);
        });
        super.componentWillUnmount();
    }
}
import { AnyAction } from 'redux';
import ICancelable, { createICancelable } from '../interfaces/ICancelable';
import Model, { ModelClass } from '../mvc/Model';

export interface RouterState
{
    count:number;
    curPath:string;
}

@ModelClass
export default class RouterModel extends Model<RouterState>
{
    public static ACTION_ROUTER_ROUTES_CHANGE:string = "ACTION_ROUTER_ROUTES_CHANGE";

    private _routesChangeHandlers:((fromPath:string, toPath:string)=>void)[] = [];

    /**
     * 获取路由数量
     *
     * @readonly
     * @type {number}
     * @memberof RouterModel
     */
    public get routeCount():number
    {
        return this.state.count;
    }

    /**
     * 获取当前路由地址
     *
     * @readonly
     * @type {string}
     * @memberof RouterModel
     */
    public get curRoutePath():string
    {
        return this.state.curPath;
    }

    /**
     * 更新路由数据
     *
     * @author Raykid
     * @date 2019-09-17
     * @param {number} count
     * @memberof RouterModel
     */
    public updateRoutes(count:number, curPath:string):void
    {
        const lastPath:string = this.state.curPath;
        this.dispatch({
            type: RouterModel.ACTION_ROUTER_ROUTES_CHANGE,
            count,
            curPath,
        });
        this._routesChangeHandlers.forEach(handler=>handler(lastPath, curPath));
    }

    /**
     * 监听路由数据变化
     *
     * @author Raykid
     * @date 2019-09-17
     * @param {(fromPath:string, toPath:string)=>void} handler
     * @returns {ICancelable}
     * @memberof RouterModel
     */
    public listenRoutesChange(handler:(fromPath:string, toPath:string)=>void):ICancelable
    {
        if(this._routesChangeHandlers.indexOf(handler) < 0)
        {
            this._routesChangeHandlers.push(handler);
        }
        return createICancelable(()=>{
            const index:number = this._routesChangeHandlers.indexOf(handler);
            if(index >= 0)
            {
                this._routesChangeHandlers.splice(index, 1);
            }
        });
    }

    public handleAction(state:Readonly<RouterState>, action:AnyAction):RouterState
    {
        if(!state)
        {
            state = {
                count: 0,
                curPath: null,
            };
        }
        switch(action.type)
        {
            case RouterModel.ACTION_ROUTER_ROUTES_CHANGE:
                state = {...state, count: action.count, curPath: action.curPath};
                break;
        }
        return state;
    }
}
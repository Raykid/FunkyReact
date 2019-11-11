import { AnyAction } from 'redux';
import Dictionary from '../utils/Dictionary';
import { getObjectHash } from '../utils/ObjectUtil';
import { mvc } from './MVC';

/**
 * 数据模型基类
 *
 * @author Raykid
 * @date 2019-08-10
 * @export
 * @class Model
 */
export default abstract class Model<S = any>
{
    /**
     * 获取当前Model维护的只读state
     *
     * @readonly
     * @type {Readonly<S>}
     * @memberof Model
     */
    public get state():Readonly<S>
    {
        const name:string = getModelName(this);
        return mvc.store.getState()[name];
    }

    public initialize():void
    {
        // 子类可重写，用于初始化数据模型
    }

    /**
     * 处理Action
     *
     * @author Raykid
     * @date 2019-08-10
     * @abstract
     * @param {Readonly<S>} state 之前的状态，不允许被直接修改
     * @param {AnyAction} action 动作
     * @returns {S} 返回新的状态，如果没有新状态，应返回老状态
     * @memberof Model
     */
    public abstract handleAction(state:Readonly<S>, action:AnyAction):S;

    protected dispatch(action:AnyAction):AnyAction
    {
        return mvc.store.dispatch(action);
    }
}

export function getModelName(model:Model):string
{
    return getObjectHash(model) + "(" + model.constructor.name + ")";
}

export const modelDict:Dictionary<{new ():Model}, Model> = new Dictionary();
const modelInitedDict:{[modelHash:string]:Model} = {};

function ensureInitModel(target:Model<any>):void
{
    const hash:string = getObjectHash(target);
    if(!modelInitedDict[hash])
    {
        modelInitedDict[hash] = target;
        target.initialize();
    }
}

/**
 * 获取注入的Model
 *
 * @author Raykid
 * @date 2019-09-05
 * @export
 * @template S
 * @template T
 * @param {{new ():T}} cls
 * @returns {T}
 */
export function getInject<S, T extends Model<S>>(cls:{new ():T}):T
{
    const model:T = modelDict.get(cls) as T;
    // 返回一个Proxy，在调用任何属性或方法前执行初始化
    return model && new Proxy(model, {
        get: (target:T, key:PropertyKey)=>{
            ensureInitModel(target);
            return target[key];
        },
        set: (target:T, key:PropertyKey, value:any)=>{
            ensureInitModel(target);
            target[key] = value;
            return true;
        },
    });
}

/**
 * Model类型装饰器
 *
 * @author Raykid
 * @date 2019-08-12
 * @export
 * @param {*} cls
 */
export function ModelClass(cls:any):void
{
    const model:Model = new cls();
    // 注册自身
    modelDict.set(cls, model);
}

/**
 * 依赖注入装饰器，可注入Model
 *
 * @author Raykid
 * @date 2019-08-12
 * @export
 * @param {*} prototype
 * @param {string} propertyKey
 */
export function Inject(prototype:any, propertyKey:string):void
{
    const cls:{new ():Model} = Reflect.getMetadata("design:type", prototype, propertyKey);
    const model:Model = getInject(cls);
    if(model)
    {
        prototype[propertyKey] = model;
    }
}
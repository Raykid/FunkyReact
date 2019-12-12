import { AnyAction } from 'redux';
import Dictionary from '../utils/Dictionary';
import { getObjectHash } from '../utils/ObjectUtil';
import { mvc } from './MVC';

export interface InjectOptions
{
    /**
     * 指明是否在依赖的Model初始化时自动初始化该被依赖的Model
     *
     * @type {boolean}
     * @memberof InjectOptions
     */
    initialize?:boolean;
}

interface InjectData
{
    /**
     * 注入的Model
     *
     * @type {Model}
     * @memberof InjectData
     */
    model:Model;

    /**
     * 注入的选项
     *
     * @type {InjectOptions}
     * @memberof InjectData
     */
    options?:InjectOptions;
}

/**
 * 数据模型基类
 *
 * @author Raykid
 * @export
 * @class Model
 */
export default abstract class Model<S = any>
{
    private __injectDatas:InjectData[];

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

    private _initialized:boolean = false;
    /**
     * 获取是否初始化完毕
     *
     * @readonly
     * @type {boolean}
     * @memberof Model
     */
    public get initialized():boolean
    {
        return this._initialized;
    }

    private _initializedPromise:Promise<void>;
    public initialize():Promise<void>
    {
        if(!this._initializedPromise)
        {
            this._initializedPromise = new Promise(async (resolve, reject)=>{
                // 先等待store
                await mvc.storePromise;
                // 再等待所有依赖的Model初始化完毕
                if(this.__injectDatas)
                {
                    await Promise.all(
                        this.__injectDatas
                        .filter(data=>{
                            return data.options == null || data.options.initialize !== false;
                        })
                        .map(data=>data.model.initialize())
                    );
                }
                // 调用模板方法
                try
                {
                    await this.onInitialize();
                    // 更新状态
                    this._initialized = true;
                    // 结束
                    resolve();
                }
                catch(err)
                {
                    console.error(`Model[ ${this.constructor.name} ]初始化失败`, err.toString());
                    // 拒绝
                    reject(err);
                }
            });
        }
        // 等待初始化完毕
        return this._initializedPromise;
    }

    public onInitialize():void|Promise<void>
    {
        // 子类可重写，用于初始化数据模型
    }

    /**
     * 处理Action
     *
     * @author Raykid
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
 * @export
 * @param {*} cls
 */
export function ModelClass(cls:any):void
{
    const model:Model = new cls();
    // 注册自身
    modelDict.set(cls, model);
}

function doInject(prototype:any, propertyKey:string, options?:InjectOptions):void
{
    const cls:{new ():Model} = Reflect.getMetadata("design:type", prototype, propertyKey);
    const model:Model = getInject(cls);
    if(model)
    {
        prototype[propertyKey] = model;
        // 添加依赖数据
        if(!prototype.__injectDatas)
        {
            prototype.__injectDatas = [];
        }
        prototype.__injectDatas.push({
            model,
            options,
        });
    }
}

export function Inject(options?:InjectOptions):PropertyDecorator;
/**
 * 依赖注入装饰器，可注入Model
 *
 * @author Raykid
 * @export
 * @param {*} prototype
 * @param {string} propertyKey
 */
export function Inject(prototype:any, propertyKey:string):void;
export function Inject(arg1?:any, arg2?:string):PropertyDecorator|void
{
    if(typeof arg2 === "string")
    {
        // 无参数
        doInject(arg1, arg2);
    }
    else
    {
        // 有参数，arg1是options
        return function(prototype:any, propertyKey:string):void
        {
            doInject(prototype, propertyKey, arg1);
        };
    }
}
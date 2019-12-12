import { Store } from 'redux';
import '../libs/Reflect';

export interface MVC
{
    storePromise:Promise<Store>;
    store:Store;
}

let store:Store;
let storePromiseResolve:(store:Store)=>void;
export const mvc:MVC = {
    storePromise: new Promise(resolve=>{
        storePromiseResolve = resolve;
    }),
    get store():Store
    {
        return store;
    },
    set store(value:Store)
    {
        store = value;
        storePromiseResolve(value);
    },
};

export interface IApp
{
    /**
     * 更新弹窗
     *
     * @author Raykid
     * @param {React.ReactNode[]} dialogs 弹窗列表
     * @returns {Promise<void>}
     * @memberof App
     */
    updateDialogs(dialogs:React.ReactNode[]):Promise<void>;

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
    updateMask(shown:boolean, alpha?:number, children?:React.ReactNode):Promise<void>;
}

let curApp:IApp;
/**
 * 获取当前app引用
 *
 * @author Raykid
 * @export
 * @returns {IApp}
 */
export function getCurApp():IApp
{
    return curApp;
}

/**
 * 设置当前app引用，仅App可以调用
 *
 * @author Raykid
 * @date 2019-11-12
 * @export
 * @param {IApp} value
 */
export function setCurApp(value:IApp):void
{
    curApp = value;
}
export default interface ICancelable<T = any> extends Promise<T>
{
    /**
     * 判断是否已被取消
     *
     * @type {boolean}
     * @memberof ICancelable
     */
    readonly canceled:boolean;
    
    /**
     * 调用即取消
     *
     * @author Raykid
     * @date 2019-08-30
     * @returns {T}
     * @memberof ICancelable
     */
    cancel():T;
}

/**
 * 创建一个可取消对象
 *
 * @author Raykid
 * @date 2019-08-30
 * @export
 * @template T
 * @param {()=>T} handler
 * @returns {ICancelable<T>}
 */
export function createICancelable<T = any>(handler:()=>T):ICancelable<T>
{
    let canceled:boolean = false;
    let cancelResolve:(value:T)=>void;
    const promise:Promise<T> = new Promise(resolve=>{
        cancelResolve = resolve;
    });
    Object.defineProperty(promise, "canceled", {
        configurable: true,
        enumerable: true,
        get: ()=>{
            return canceled;
        }
    });
    let result:T;
    promise["cancel"] = ()=>{
        if(!canceled)
        {
            try
            {
                // 调用取消回调
                result = handler();
            }
            finally
            {
                // resolve
                cancelResolve(result);
                // 标记已取消
                canceled = true;
            }
        }
        return result;
    };
    return promise as ICancelable;
}
import ICancelable, { createICancelable } from '../interfaces/ICancelable';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
*/
export default class System
{
    private _tickList:Function[] = [];

    private _timer:number = 0;
    /**
     * 获取从程序运行到当前所经过的毫秒数
     * 
     * @returns {number} 毫秒数
     * @memberof System
     */
    public getTimer():number
    {
        return this._timer;
    }

    public constructor()
    {
        if(requestAnimationFrame instanceof Function)
        {
            const handler:(timer:number)=>void = (timer:number)=>{
                // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
                this._timer = timer;
                // 调用tick方法
                this.tick();
                // 计划下一次执行
                requestAnimationFrame(handler);
            };
            requestAnimationFrame(handler);
        }
        else
        {
            // 如果不支持requestAnimationFrame则改用setTimeout计时，延迟时间1000/60毫秒
            const startTime:number = Date.now();
            setInterval(()=>{
                const curTime:number = Date.now();
                // 赋值timer
                this._timer = curTime - startTime;
                // 调用tick方法
                this.tick();
            }, 1000/60);
        }
    }

    private tick():void
    {
        // 调用下一帧回调
        for(let i:number = 0, len:number = this._tickList.length; i < len; i++)
        {
            const handler:Function = this._tickList[i];
            if(handler instanceof Function)
            {
                handler();
            }
            else
            {
                this._tickList.splice(i, 1);
                i --;
                len --;
            }
        }
    }

    /**
     * 每帧执行某个方法，直到取消为止
     * 
     * @param {Function} handler 每帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public enterFrame(handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        this._tickList.push(onTick);
        return createICancelable(()=>{
            const index:number = this._tickList.indexOf(onTick);
            if(index >= 0)
            {
                this._tickList.splice(index, 1);
            }
        });

        function onTick():void
        {
            // 调用回调
            handler.apply(thisArg, args);
        }
    }

    /**
     * 在下一帧执行某个方法
     * 
     * @param {Function} handler 希望在下一帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public nextFrame(handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        const cancel:ICancelable = this.enterFrame(onEnterFrame, this);
        return cancel;

        function onEnterFrame():void
        {
            // 调用回调
            handler.apply(thisArg, args);
            // 第一次就立即取消
            cancel.cancel();
        }
    }

    /**
     * 设置延迟回调
     * 
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public setTimeout(duration:number, handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        const startTime:number = this._timer;
        // 启动计时器
        const cancel:ICancelable = this.enterFrame(tick, this);
        return cancel;
        
        function tick():void
        {
            if(this._timer - startTime >= duration)
            {
                handler.apply(thisArg, args);
                cancel.cancel();
            }
        }
    }

    /**
     * 设置延时间隔
     * 
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public setInterval(duration:number, handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        let lastTime:number = this._timer;
        return this.enterFrame(onEnterFrame, this);

        function onEnterFrame():void
        {
            const delta:number = this._timer - lastTime;
            if(delta >= duration)
            {
                // 触发回调
                handler.apply(thisArg, args);
                // 精确计算lastTime
                lastTime = this._timer - (delta - duration);
            }
        }
    }

    /**
     * 等待指定毫秒后resolve
     *
     * @author Raykid
     * @date 2019-05-31
     * @param {number} duration 要等待的毫秒数
     * @returns {ICancelable} 支持cancel操作
     * @memberof System
     */
    public sleep(duration:number):ICancelable
    {
        return this.setTimeout(duration, ()=>{});
    }
}

export const system = new System();
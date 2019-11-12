import { AnyAction } from 'redux';
import ICancelable, { createICancelable } from '../interfaces/ICancelable';
import Model, { ModelClass } from '../mvc/Model';
import { getCurApp, IApp } from '../mvc/MVC';

interface MaskData
{
    /**
     * 遮罩的透明度
     *
     * @type {number}
     * @memberof MaskData
     */
    alpha:number;

    /**
     * 可以携带子对象
     *
     * @type {React.ReactNode}
     * @memberof MaskData
     */
    children?:React.ReactNode;
}

interface MaskState
{
}

@ModelClass
export default class MaskModel extends Model<MaskState>
{
    /**
     * 遮罩数据的栈
     *
     * @type {MaskData[]}
     * @memberof MaskModel
     */
    private _maskDataStack:MaskData[] = [];
    private _maskCancelList:ICancelable[] = [];

    /**
     * 获取遮罩数量
     *
     * @readonly
     * @type {number}
     * @memberof MaskModel
     */
    public get maskCount():number
    {
        return this._maskDataStack.length;
    }

    public handleAction(state:Readonly<MaskState>, action:AnyAction):MaskState
    {
        if(!state)
        {
            state = {
            };
        }
        switch(action.type)
        {
        }
        return state;
    }

    private updateMasks():void
    {
        // 更新app
        const app:IApp = getCurApp();
        if(app)
        {
            if(this._maskDataStack.length > 0)
            {
                const maskData:MaskData = this._maskDataStack[this._maskDataStack.length - 1];
                app.updateMask(true, maskData.alpha, maskData.children);
            }
            else
            {
                app.updateMask(false);
            }
        }
    }

    /**
     * 显示遮罩层
     *
     * @author Raykid
     * @param {number} [alpha=0] 遮罩透明度，范围是[0, 1]，默认是0
     * @param {React.ReactNode} [children] 可以添加子对象
     * @returns {ICancelable}
     * @memberof MaskModel
     */
    public showMask(alpha:number=0, children?:React.ReactNode):ICancelable
    {
        // 简单判断一下边界
        if(alpha < 0)
        {
            alpha = 0;
        }
        else if(alpha > 1)
        {
            alpha = 1;
        }
        // 添加数据
        const maskData:MaskData = {
            alpha,
            children,
        };
        this._maskDataStack.push(maskData);
        // 更新遮罩
        this.updateMasks();
        // 返回取消对象
        const cancel:ICancelable = createICancelable(()=>{
            const index:number = this._maskDataStack.indexOf(maskData);
            if(index >= 0)
            {
                this._maskDataStack.splice(index, 1);
                // 更新遮罩
                this.updateMasks();
            }
        });
        this._maskCancelList.push(cancel);
        return cancel;
    }

    /**
     * 隐藏所有遮罩
     *
     * @author Raykid
     * @memberof MaskModel
     */
    public hideAll():void
    {
        for(let i:number = 0, len:number = this._maskCancelList.length; i < len; i++)
        {
            this._maskCancelList.pop().cancel();
        }
    }
}
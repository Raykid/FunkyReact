export default interface IDialogPolicy
{
    /**
     * 弹出动画
     *
     * @author Raykid
     * @param {Element} dialog 弹窗实体
     * @returns {Promise<void>}
     * @memberof IDialogPolicy
     */
    open?(dialog:Element):Promise<void>;
    
    /**
     * 关闭动画
     *
     * @author Raykid
     * @param {Element} dialog 弹窗实体
     * @returns {Promise<void>}
     * @memberof IDialogPolicy
     */
    close?(dialog:Element):Promise<void>;
}
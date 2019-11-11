import IDialogPolicy from 'funky-react/dist/components/Dialog/IDialogPolicy';
import { system } from 'funky-react/dist/utils/System';

export default class BackDialogPolicy implements IDialogPolicy
{
    private static _instance:BackDialogPolicy;
    /**
     * 获取单例
     *
     * @readonly
     * @static
     * @type {BackDialogPolicy}
     * @memberof BackDialogPolicy
     */
    public static get instance():BackDialogPolicy
    {
        if(!BackDialogPolicy._instance)
        {
            BackDialogPolicy._instance = new BackDialogPolicy();
        }
        return BackDialogPolicy._instance;
    }

    public async open(dialog:HTMLElement):Promise<void>
    {
        dialog.style.transform = `scale(0)`;
        dialog.style.transition = "transform 0.3s cubic-bezier(0, 0, 0.6, 1.6)";
        await system.sleep(50);
        dialog.style.transform = `scale(1)`;
        await system.sleep(300);
    }

    public async close(dialog:HTMLElement):Promise<void>
    {
        dialog.style.transform = `scale(1)`;
        dialog.style.transition = "transform 0.3s cubic-bezier(0.6, -0.8, 1, 1)";
        await system.sleep(50);
        dialog.style.transform = `scale(0)`;
        await system.sleep(300);
    }
}
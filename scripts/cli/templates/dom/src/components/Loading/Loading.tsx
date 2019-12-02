import Mediator from 'funky-react/dist/mvc/Mediator';
import React from 'react';
import './Loading.scss';

/**
 * 显示一个加载中的图标
 *
 * @author Raykid
 * @date 2019-12-02
 * @export
 * @class Loading
 * @extends {Mediator}
 */
export default class Loading extends Mediator
{
    public render():React.ReactNode
    {
        return <div className="loading-image"/>;
    }
}
import ICancelable from 'funky-react/dist/interfaces/ICancelable';
import MaskModel from 'funky-react/dist/models/MaskModel';
import Model, { getInject, ModelClass } from 'funky-react/dist/mvc/Model';
import React from 'react';
import { AnyAction } from 'redux';
import Loading from '../components/Loading/Loading';

interface LoadingMaskState
{
}

@ModelClass
export default class LoadingMaskModel extends Model<LoadingMaskState>
{
    public showLoading():ICancelable
    {
        return getInject(MaskModel).showMask(0.3, <Loading/>);
    }

    public hideAll():void
    {
        getInject(MaskModel).hideAll();
    }

    public handleAction(state:Readonly<LoadingMaskState>, action:AnyAction):LoadingMaskState
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
}
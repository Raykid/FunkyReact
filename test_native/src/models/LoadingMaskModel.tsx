import ICancelable from 'funky-react/dist/interfaces/ICancelable';
import MaskModel from 'funky-react/dist/models/MaskModel';
import Model, { Inject, ModelClass } from 'funky-react/dist/mvc/Model';
import React from 'react';
import { AnyAction } from 'redux';
import Loading from '../components/Loading/Loading';

interface LoadingMaskState
{
}

@ModelClass
export default class LoadingMaskModel extends Model<LoadingMaskState>
{
    @Inject
    private _maskModel:MaskModel;

    public showLoading():ICancelable
    {
        return this._maskModel.showMask(0.3, <Loading/>);
    }

    public hideAll():void
    {
        this._maskModel.hideAll();
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
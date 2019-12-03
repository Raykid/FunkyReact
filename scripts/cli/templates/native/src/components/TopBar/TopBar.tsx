import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import RouterModel from 'funky-react/dist/models/RouterModel';
import Mediator from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import { Image, ImageStyle, Platform, Text, View } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';
import imgBack from './assets/back.png';

export interface TopBarProps
{
    /**
     * TopBar显示标题
     *
     * @type {string}
     * @memberof TopBarProps
     */
    title?:string;
}

interface TopBarState
{
}

export default class TopBar extends Mediator<TopBarProps, TopBarState>
{
    @Inject
    private _routerModel:RouterModel;

    private _curRouteCount:number;

    public shouldComponentUpdate(nextProps:Readonly<TopBarProps>, nextState:Readonly<TopBarState>, nextContext:any):boolean
    {
        if(this._routerModel.routeCount !== this._curRouteCount)
        {
            this._curRouteCount = this._routerModel.routeCount;
            return true;
        }
        else
        {
            return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        }
    }

    public render():React.ReactNode
    {
        return <View style={styles.topBar}>
            { this.props.title && <Text style={styles.topBar.title}>{ this.props.title }</Text> }
            { this.props.children && <View style={styles.topBar.childrenContainer}>{ this.props.children }</View>}
            {
                Platform.OS === "ios" && this._routerModel.routeCount > 1 && <ButtonOpacity style={styles.topBar.backButton} onPress={()=>{
                    popRoute();
                }}>
                    <Image style={styles.topBar.backButton.image} source={imgBack}/>
                </ButtonOpacity>
            }
        </View>;
    }
}

const styles = createStyleSheet({
    topBar: {
        position: "relative",
        width: "100%",
        height: getPixel(100),
        borderBottomWidth: getPixel(2),
        borderBottomColor: "grey",

        backButton: {
            width: getPixel(100),
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            image: {
                width: getPixel(72),
                height: getPixel(48),
            } as ImageStyle,
        } as Style,

        title: {
            position: "absolute",
            width: "100%",
            height: getPixel(80),
            lineHeight: getPixel(80),
            textAlign: "center",
            fontSize: getPixel(36),
            fontWeight: "bold",
            color: "#4D4D4D",
        } as Style,

        childrenContainer: {
            position: "absolute",
            width: "100%",
            height: "100%",
        } as Style,
    } as Style,
});
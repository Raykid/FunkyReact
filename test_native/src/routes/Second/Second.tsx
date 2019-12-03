import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { Inject } from 'funky-react/dist/mvc/Model';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';
import TopBar from '../../components/TopBar/TopBar';
import PromptModel from '../../models/PromptModel';

@MediatorClass("/second")
export default class Second extends BaseScene
{
    @Inject
    private _promptModel:PromptModel;

    public componentDidMount():void
    {
        this._promptModel.alert("你来到了第二个模块儿", "这是Alert");
    }
    
    public render():React.ReactNode
    {
        return <SafeAreaView style={styles.root}>
            <StatusBar hidden animated></StatusBar>
            <TopBar title="第二个模块儿"/>
            <View style={styles.root.contentContainer}>
                <Text style={styles.root.contentContainer.title}>这是第二个模块</Text>
                <ButtonOpacity style={styles.root.contentContainer.button} onPress={()=>{
                    this._promptModel.confirm("要回到首模块吗？", "这是Confirm", ()=>popRoute());
                }}>
                    <Text style={styles.root.contentContainer.button.text}>回去</Text>
                </ButtonOpacity>
            </View>
        </SafeAreaView>;
    }
}

const styles = createStyleSheet({
    root: {
        width: "100%",
        height: "100%",

        contentContainer: {
            flex: 1,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",

            title: {
                fontSize: getPixel(60),
            } as Style,

            button: {
                backgroundColor: "green",
                padding: getPixel(20),

                text: {
                    fontSize: getPixel(24),
                    color: "white",
                } as Style,
            } as Style,
        } as Style,
    } as Style,
});
import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import { MediatorClass } from 'funky-react/dist//mvc/Mediator';
import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import DialogModel from 'funky-react/dist/models/DialogModel';
import { Inject } from 'funky-react/dist/mvc/Model';
import { pushRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';
import TopBar from '../../components/TopBar/TopBar';
import TestDialog from '../../dialogs/TestDialog/TestDialog';
import Second from '../Second/Second';

@MediatorClass("/first")
export default class First extends BaseScene
{
    @Inject
    private _dialogModel:DialogModel;

    public render():React.ReactNode
    {
        return <SafeAreaView style={styles.root}>
            <StatusBar hidden animated></StatusBar>
            <TopBar title="第一个模块儿">
                <ButtonOpacity style={styles.root.testDialogButton} onPress={()=>{
                    // 打开弹窗
                    this._dialogModel.openDialog(TestDialog);
                }}>
                    <Text style={styles.root.testDialogButton.text}>测试弹窗</Text>
                </ButtonOpacity>
            </TopBar>
            <View style={styles.root.contentContainer}>
                <Text style={styles.root.contentContainer.title}>这是第一个模块儿</Text>
                <ButtonOpacity style={styles.root.contentContainer.button} onPress={()=>{
                    pushRoute(Second);
                }}>
                    <Text style={styles.root.contentContainer.button.text}>打开模块儿</Text>
                </ButtonOpacity>
            </View>
        </SafeAreaView>;
    }
}

const styles = createStyleSheet({
    root: {
        width: "100%",
        height: "100%",

        testDialogButton: {
            position: "absolute",
            right: getPixel(20),
            top: getPixel(10),
            backgroundColor: "red",
            borderRadius: getPixel(50),
            padding: getPixel(16),

            text: {
                color: "white",
            } as Style,
        } as Style,

        contentContainer: {
            flex: 1,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",

            title: {
                fontSize: getPixel(40),
            } as Style,
    
            button: {
                backgroundColor: "red",
                borderRadius: getPixel(50),
                padding: getPixel(20),
    
                text: {
                    fontSize: getPixel(36),
                    color: "white",
                } as Style,
            } as Style,
        } as Style,
    } as Style,
});
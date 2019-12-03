import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import Dialog from 'funky-react-native/dist/components/Dialog/Dialog';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import ICancelable from 'funky-react/dist/interfaces/ICancelable';
import { Inject } from 'funky-react/dist/mvc/Model';
import { system } from 'funky-react/dist/utils/System';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';
import LoadingMaskModel from '../../models/LoadingMaskModel';

export default class TestDialog extends Dialog
{
    @Inject
    private _loadingMaskModel:LoadingMaskModel;

    public render():React.ReactNode
    {
        return <View style={styles.root}>
            <ButtonOpacity style={styles.root.button} onPress={()=>{
                const cancel:ICancelable = this._loadingMaskModel.showLoading();
                system.setTimeout(3000, cancel.cancel);
                this.close();
            }}>
                <Text style={styles.root.button.text}>测试Loading 3秒</Text>
            </ButtonOpacity>
            <ButtonOpacity style={styles.root.closeButton} onPress={()=>{
                this.close();
            }}>
                <Text style={styles.root.closeButton.text}>×</Text>
            </ButtonOpacity>
        </View>;
    }
}

const { width, height } = Dimensions.get("window");
const styles = createStyleSheet({
    root: {
        position: "absolute",
        left: (width - getPixel(600)) / 2,
        top: (height - getPixel(480)) / 2,
        width: getPixel(600),
        height: getPixel(480),
        backgroundColor: "white",
        borderRadius: getPixel(50),
        display: "flex",
        justifyContent: "space-around",

        closeButton: {
            position: "absolute",
            right: 0,
            top: 0,
            width: getPixel(60),
            height: getPixel(60),
            backgroundColor: "red",
            borderRadius: getPixel(10),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            text: {
                fontSize: getPixel(40),
                color: "white",
            } as Style,
        } as Style,

        button: {
            backgroundColor: "red",
            borderRadius: getPixel(50),
            padding: getPixel(10),
            margin: getPixel(20),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            text: {
                fontSize: getPixel(40),
                color: "white",
            } as Style,
        } as Style,
    } as Style,
});
import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { popRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';

@MediatorClass("/second")
export default class Second extends BaseScene
{
    public render():React.ReactNode
    {
        return <SafeAreaView style={styles.root}>
            <StatusBar hidden animated></StatusBar>
            <Text style={styles.root.title}>这是第二个模块</Text>
            <ButtonOpacity style={styles.root.button} onPress={()=>{
                popRoute();
            }}>
                <Text style={styles.root.button.text}>点我</Text>
            </ButtonOpacity>
        </SafeAreaView>;
    }
}

const styles = createStyleSheet({
    root: {
        width: "100%",
        height: "100%",
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
});
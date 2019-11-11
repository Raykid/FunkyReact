import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import { createStyleSheet, getPixel, Style } from 'funky-react-native/dist/utils/NativeUtil';
import { MediatorClass } from 'funky-react/dist//mvc/Mediator';
import BaseScene from 'funky-react/dist/components/Scene/BaseScene';
import { pushRoute } from 'funky-react/dist/router/ReactRouter';
import React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import Second from '../Second/Second';

@MediatorClass("/first")
export default class First extends BaseScene
{
    public render():React.ReactNode
    {
        return <SafeAreaView style={styles.root}>
            <StatusBar hidden animated></StatusBar>
            <Text style={styles.root.title}>这是第一个模块</Text>
            <ButtonOpacity style={styles.root.button} onPress={()=>{
                pushRoute(Second);
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
            fontSize: getPixel(40),
        } as Style,

        button: {
            backgroundColor: "red",
            padding: getPixel(20),

            text: {
                fontSize: getPixel(24),
                color: "white",
            } as Style,
        } as Style,
    } as Style,
});
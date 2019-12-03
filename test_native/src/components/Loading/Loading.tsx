import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import Mediator from 'funky-react/dist/mvc/Mediator';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { createStyleSheet, Style } from 'react-native-visitor';
import imgLoading from './assets/loading.gif';

export default class Loading extends Mediator
{
    public render():React.ReactNode
    {
        return <View style={styles.loading}>
            <Image source={imgLoading} style={styles.loading.image}/>
            <Text style={styles.loading.prompt}>如果你看到的是静止的图片，说明你的项目不支持gif动画，教程请自行参考网络。</Text>
        </View>;
    }
}

const styles = createStyleSheet({
    loading: {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        image: {
            width: getPixel(108),
            height: getPixel(88),
        } as Style,

        prompt: {
            color: "white",
            fontSize: getPixel(30),
            maxWidth: "80%",
        } as Style,
    } as Style,
});
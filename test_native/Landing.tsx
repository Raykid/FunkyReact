import React from 'react';
import { Text, View } from 'react-native';
import BaseScene from '../src/components/Scene/BaseScene';
import { MediatorClass } from '../src/mvc/Mediator';
import { ReactRouteProps } from '../src/router/ReactRouter';
import { createStyleSheet, Style } from '../src/utils/NativeUtil';

@MediatorClass("/landing")
export default class Landing extends BaseScene<ReactRouteProps>
{
    public render():React.ReactNode
    {
        return <View style={styles.root}>
            <Text>Hello Funky React!</Text>
        </View>;
    }
}

const styles = createStyleSheet({
    root: {
        width: "100%",
        height: "100%",
    } as Style,
});
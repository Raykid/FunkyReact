import BaseDialog, { DialogProps, DialogState } from 'funky-react/dist/components/Dialog/BaseDialog';
import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { createStyleSheet, Style } from '../../utils/NativeUtil';

export default class Dialog<P extends DialogProps = DialogProps, S extends DialogState = DialogState> extends BaseDialog<P, S>
{
    protected onRender():React.ReactNode
    {
        // 弹窗默认有动画
        LayoutAnimation.easeInEaseOut();
        return <View style={styles.root}>
            <View style={styles.root.background}/>
            { super.onRender() }
        </View>;
    }
}

const styles = createStyleSheet({
    root: {
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,

        background: {
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundColor: "#00000066",
        } as Style,
    } as Style,
});

import { ButtonOpacity } from 'funky-react-native/dist/components/Button/Button';
import Dialog from 'funky-react-native/dist/components/Dialog/Dialog';
import { getPixel } from 'funky-react-native/dist/utils/NativeUtil';
import { MediatorClass } from 'funky-react/dist/mvc/Mediator';
import { system } from 'funky-react/dist/utils/System';
import React from 'react';
import { Text, View } from 'react-native';
import { createStyleSheet, crossMergeStyles, Style } from 'react-native-visitor';
import { EnumPromptButtonType, PromptProps } from '../../models/PromptModel';

@MediatorClass
export default class Prompt extends Dialog<PromptProps>
{
    public render():React.ReactNode
    {
        return <View style={styles.root}>
            <Text style={styles.root.title}>{ this.props.data.title }</Text>
            <Text style={styles.root.content}>{ this.props.data.content }</Text>
            <View style={styles.root.buttonContainer}>
            {
                this.props.data.buttons && this.props.data.buttons.map((button, i)=>{
                    const buttonStyle:any = crossMergeStyles(styles.root.buttonContainer.button, [
                        "_" + EnumPromptButtonType[(button.type || EnumPromptButtonType.normal)]
                    ]);
                    return <ButtonOpacity key={"button_" + i} style={buttonStyle} onPress={()=>{
                        // 先关闭自身
                        this.close();
                        // 延迟回调，防止卡界面                        
                        system.nextFrame(()=>{
                            // 调用回调
                            button.handler && button.handler(button.data);
                        });
                    }}>
                        <Text style={buttonStyle.text}>
                            { button.text || button.data.toString() }
                        </Text>
                    </ButtonOpacity>;
                })
            }
            </View>
        </View>;
    }
}

const styles = createStyleSheet({
    root: {
        position: "absolute",
        width: "80%",
        left: "10%",
        top: "35%",
        backgroundColor: "white",
        paddingTop: getPixel(92),
        borderRadius: getPixel(34),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",

        title: {
            fontSize: getPixel(36),
            fontWeight: "bold",
            color: "#4D4D4D",
        } as Style,
        
        content: {
            paddingHorizontal:getPixel(30),
            fontSize: getPixel(28),
            fontWeight: "500",
            color: "#4D4D4D",
        } as Style,

        buttonContainer: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginTop: getPixel(92),

            button: {
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: getPixel(91),
                borderWidth: getPixel(2),
                borderColor: "#F0F0F4",

                text: {
                    fontSize: getPixel(32),
                    color: "#A0A0A0",
                },

                _important: {
                    text: {
                        color: "#12B7F5",
                    }
                }
            } as Style
        } as Style,
    } as Style
});
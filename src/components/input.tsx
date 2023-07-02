import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme, Theme as theme } from '../constants';
import { InputProps } from 'galio-framework';
import Imageicon from "./icon";
import { TouchableRipple } from 'react-native-paper';

interface inputProps extends InputProps {
    onPress?: () => void,
}

const Input = (props: inputProps) => {
    const {
        style,
        textInputStyle,
        type,
        placeholderTextColor,
        label,
        labelStyles,
        color,
        help,
        helpStyles,
        bgColor,
        borderless,
        viewPass,
        rounded,
        icon,
        family,
        left,
        right,
        iconColor,
        topHelp,
        bottomHelp,
        iconSize,
        iconContent,
        password,
        onRef,
        error,
        onPress,
        ...rest
    } = props;
    const [isPassword, setIsPassword] = React.useState(false);
    React.useEffect(() => {
        setIsPassword(password!!);
    }, []);

    const inputViewStyles = [
        styles.inputStyle,
        styles.inputContainer,
        bgColor && { backgroundColor: bgColor },
        rounded && styles.rounded,
        borderless && styles.borderless,
        error && { borderColor: theme.COLORS.ERROR },
        style,
    ];

    const inputStyles = [
        styles.inputView,
        borderless && icon && styles.inputIcon,
        styles.inputText,
        color && { color },
        textInputStyle || {}
    ];

    const iconInstance = icon ? (
        <TouchableRipple onPress={onPress}>
            <Imageicon
                source={icon}
                size={iconSize || theme.SIZES.BASE * 1.0625}
                iconStyle={{ marginRight: left && !right ? 4 : 0 }}
                color={(error && theme.COLORS.ERROR) || iconColor || placeholderTextColor || theme.COLORS.PLACEHOLDER}
            />
        </TouchableRipple>

    ) : (
        iconContent
    );

    const viewPassElement = password && viewPass && (
        <TouchableRipple style={{ marginLeft: 2 }} onPress={() => setIsPassword(!isPassword)}>
            <Imageicon
                size={iconSize || theme.SIZES.BASE * 1.0625}
                color={iconColor || theme.COLORS.BLACK}
                source="eye"
            />
        </TouchableRipple>
    );
    const labelContent = label && <Text style={[styles.label, labelStyles || {}]}>{label}</Text>;
    const helpContent = help && <Text style={[styles.helpText, helpStyles || {}]}>{help}</Text>;

    return (
        <View
            style={{
                marginVertical: theme.SIZES.BASE / 2,
                alignContent: 'center',
            }}>
            {labelContent}
            {topHelp && !bottomHelp && helpContent}
            <View style={inputViewStyles}>
                {left && !right && iconInstance}
                <TextInput
                    ref={onRef}
                    style={inputStyles}
                    keyboardType={type}
                    secureTextEntry={isPassword}
                    placeholderTextColor={placeholderTextColor || Theme.COLORS.MUTED}
                    underlineColorAndroid="transparent"
                    {...rest}
                />
                {right && iconInstance}
                {viewPassElement}
            </View>
            {bottomHelp && helpContent}
        </View>
    );
}

Input.defaultProps = {
    type: 'default',
    password: false,
    placeholderTextColor: null,
    label: null,
    help: null,
    rounded: false,
    left: true,
    right: false,
    viewPass: false,
    topHelp: true,
    bottomHelp: false,
    style: null,
    textInputStyle: null,
    borderless: false,
    bgColor: null,
    iconColor: null,
    icon: null,
    family: null,
    color: null,
    styles: {},
    iconSize: null,
    iconContent: null,
    onRef: null,
};

const styles = StyleSheet.create({
    inputStyle: {
        backgroundColor: theme.COLORS.WHITE,
        borderRadius: theme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth: theme.SIZES.INPUT_BORDER_WIDTH,
        borderColor: theme.COLORS.INPUT,
        height: theme.SIZES.INPUT_HEIGHT,
        paddingHorizontal: theme.SIZES.INPUT_HORIZONTAL,
        width: '100%',
    },
    inputText: {
        color: theme.COLORS.BLACK,
        fontSize: theme.SIZES.INPUT_TEXT,
        textDecorationColor: 'transparent',
        textShadowColor: 'transparent',
        fontFamily: Theme.FONTFAMILY.MEDIUM,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView: {
        flex: 1,
    },
    inputIcon: {
        marginHorizontal: theme.SIZES.BASE,
    },
    label: {
        fontWeight: '500',
        fontSize: 14,
        marginVertical: theme.SIZES.INPUT_VERTICAL_LABEL,
        paddingHorizontal: theme.SIZES.INPUT_HORIZONTAL
    },
    helpText: {
        color: theme.COLORS.SECONDARY,
        marginVertical: 8,
        paddingHorizontal: 16,
        fontSize: 14
    },
    rounded: {
        borderRadius: theme.SIZES.INPUT_ROUNDED,
    },
    borderless: {
        borderColor: 'transparent',
        borderWidth: 0,
    },
});
export default Input;

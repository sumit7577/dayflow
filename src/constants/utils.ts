import { Dimensions, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import Theme from "./theme";

const { height, width } = Dimensions.get("window");

const textBold: StyleProp<TextStyle> = {
    fontFamily: Theme.FONTFAMILY.BOLD,
    fontSize: 16,
    color: Theme.COLORS.BLACK
}

const textExtraBold: StyleProp<TextStyle> = {
    fontFamily: Theme.FONTFAMILY.EXTRABOLD,
    fontSize: 16,
    color: Theme.COLORS.BLACK
}

const textWhite: StyleProp<TextStyle> = {
    color: Theme.COLORS.WHITE
}

const text: StyleProp<TextStyle> = {
    fontFamily: Theme.FONTFAMILY.MEDIUM,
    fontSize: 16,
    color: Theme.COLORS.BLACK,
}

const container: StyleProp<ViewStyle> = {
    paddingHorizontal: "5%",
    backgroundColor: Theme.COLORS.WHITE,
    height: "100%"
}

const inputStyles: StyleProp<ViewStyle> = {
    borderColor: Theme.COLORS.BG2,
    height: height / 16,
    borderRadius: 15
}

export function humanReadableDuration(msDuration: number): string {
    console.log("dur",msDuration)
    const h = Math.floor(msDuration / 1000 / 60 / 60);
    const m = Math.floor((msDuration / 1000 / 60 / 60 - h) * 60);
    const s = Math.floor(((msDuration / 1000 / 60 / 60 - h) * 60 - m) * 60);

    // To get time format 00:00:00
    const seconds: string = s < 10 ? `0${s}` : `${s}`;
    const minutes: string = m < 10 ? `0${m}` : `${m}`;
    const hours: string = h < 10 ? `0${h}` : `${h}`;
    return `${hours}:${minutes}`;

}

export default { height, width, textExtraBold, textBold, textWhite, text, container, inputStyles, humanReadableDuration };
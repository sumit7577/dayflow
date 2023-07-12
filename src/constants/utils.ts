import { Dimensions, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import Theme from "./theme";
import { timeCreater } from "../networking/controller";

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
    const h = Math.floor(msDuration / 1000 / 60 / 60);
    const m = Math.floor((msDuration / 1000 / 60 / 60 - h) * 60);
    const s = Math.floor(((msDuration / 1000 / 60 / 60 - h) * 60 - m) * 60);

    // To get time format 00:00:00
    const seconds: string = s < 10 ? `0${s}` : `${s}`;
    const minutes: string = m < 10 ? `0${m}` : `${m}`;
    const hours: string = h < 10 ? `0${h}` : `${h}`;
    return `${hours}:${minutes}`;

}

const timeToArray = (start: string | null | undefined, end: string | null | undefined) => {
    const starting = start !== null && typeof start == 'string' ? start.split(":")[0] : "8";
    const ending = end !== null && typeof end == 'string' ? end.split(":")[0] : "18"
    const dataArray = [];
    for (let i = parseInt(starting); i <= parseInt(ending); i++) {
        if (i === parseInt(ending)) break;
        dataArray.push({ start: timeCreater(`${i}:00:00`).toISOString(), end: timeCreater(`${i + 1}:00:00`).toISOString() })
    }
    return dataArray;
}

export default { height, width, textExtraBold, textBold, textWhite, text, container, inputStyles, humanReadableDuration, timeToArray };
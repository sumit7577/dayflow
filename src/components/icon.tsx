import * as React from 'react';
import {
  I18nManager,
  Image,
  ImageSourcePropType,
  Platform,
  AccessibilityProps,
  ViewProps,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageProps
} from 'react-native';
import { Pictures, Theme } from '../constants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

type Props = IconProps & {
  color?: string;
  source: string;
  iconStyle?: StyleProp<ViewStyle>,
  imageStyle?: StyleProp<ImageStyle>
};

const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'string' &&
    source !== null &&
    source.includes("http")) ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' ||

  typeof source === "string" &&
  source.includes("file") ||
  // image url on web
  (Platform.OS === 'web' &&
    typeof source === 'string' &&
    (source.startsWith('data:image') ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)));

const Icon = ({
  source,
  color,
  size,
  iconStyle,
  imageStyle,
  ...rest
}: Props) => {

  const iconColor =
    color || Theme.COLORS.BLACK

  const s = typeof source == "string" && (source.includes("http") || source?.includes("file")) ? { uri: source } : source;

  if (isImageSource(source)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: `contain`,
          },
          imageStyle && imageStyle
        ]}
        accessibilityIgnoresInvertColors
      />
    );
  } else if (typeof s === 'string') {
    const IconStyle = [iconStyle && iconStyle,
    styles.icon,
    {
      lineHeight: size,
    }
    ]
    return (
      <MaterialCommunityIcons
        allowFontScaling={false}
        name={source}
        color={iconColor}
        size={size}
        style={IconStyle}
        pointerEvents="none"
        selectable={false}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  icon: {
    backgroundColor: 'transparent',
  },
});

export default Icon;

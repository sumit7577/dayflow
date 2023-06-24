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
  ViewStyle
} from 'react-native';
import { Theme } from '../constants';
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
  source: any;
  iconStyle?: StyleProp<ViewStyle>
};

const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string') ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' ||
  // image url on web
  (Platform.OS === 'web' &&
    typeof source === 'string' &&
    (source.startsWith('data:image') ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)));

const getIconId = (source: any) => {
  if (
    typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string'
  ) {
    return source.uri;
  }

  return source;
};

export const isValidIcon = (source: any) =>
  typeof source === 'string' ||
  typeof source === 'function' ||
  isImageSource(source);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

const Icon = ({
  source,
  color,
  size,
  iconStyle,
  ...rest
}: Props) => {
  const direction =
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.getConstants().isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;

  const s =
    typeof source === 'object' && source.direction && source.source
      ? source.source
      : source;
  const iconColor =
    color || Theme.COLORS.BLACK

  if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: `contain`,
          },
        ]}
        accessibilityIgnoresInvertColors
      />
    );
  } else if (typeof s === 'string') {
    const IconStyle = [iconStyle && iconStyle,
    styles.icon,
    {
      transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
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

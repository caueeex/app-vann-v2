// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'clock.fill': 'schedule',
  'person.fill': 'person',
  'map.fill': 'map',
  'bell.fill': 'notifications',
  'car.fill': 'directions-car',
  'location.fill': 'location-on',
  'message.fill': 'message',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.circle': 'radio-button-unchecked',
  'checkmark': 'check',
  'exclamationmark.triangle.fill': 'warning',
  'creditcard.fill': 'credit-card',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'envelope': 'email',
  'lock': 'lock',
  'globe': 'language',
  'calendar': 'calendar-today',
  'number': 'tag',
  'person.3.fill': 'people',
  'flame.fill': 'local-fire-department',
  'list.bullet': 'list',
  'play.fill': 'play-arrow',
  'arrow.right': 'arrow-forward',
  'xmark.circle.fill': 'cancel',
  'text.bubble.fill': 'chat-bubble',
  'chevron.left': 'chevron-left',
  'plus': 'add',
  'minus': 'remove',
  'chart.bar.fill': 'bar-chart',
  'xmark': 'close',
  'google': 'google',
  'facebook': 'facebook',
  'shield.checkmark.fill': 'verified-user',
} as const;

type IconMapping = typeof MAPPING;
type IconSymbolName = keyof IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];
  if (!iconName) {
    console.warn(`Icon "${name}" not found in mapping`);
    return <MaterialIcons color={color} size={size} name="help-outline" style={style} />;
  }
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}

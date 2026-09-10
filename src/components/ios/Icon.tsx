/**
 * Icon — SF Symbols.
 *
 * Apple's icon set is part of what makes an app look like it belongs on the
 * system: the glyphs share the text baseline, optical weight and scale of the
 * surrounding type. `SymbolView` renders them natively on iOS; elsewhere the
 * `fallback` asset (one of the app's own SVGs) takes over.
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SymbolView, type SFSymbol, type SymbolWeight } from 'expo-symbols';
import { Asset } from '@components/ui/Asset';

export type { SFSymbol };

export interface IconProps {
  name: SFSymbol;
  size?: number;
  color?: string;
  weight?: SymbolWeight;
  /** Hierarchical rendering gives depth to multi-layer glyphs. */
  hierarchical?: boolean;
  /** File name of the SVG shown where SF Symbols are unavailable. */
  fallbackAsset?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 22,
  color,
  weight = 'regular',
  hierarchical = false,
  fallbackAsset,
  style,
}) => (
  <SymbolView
    name={name}
    size={size}
    tintColor={color}
    weight={weight}
    type={hierarchical ? 'hierarchical' : 'monochrome'}
    resizeMode="scaleAspectFit"
    style={[{ width: size, height: size }, style]}
    fallback={
      fallbackAsset ? (
        <Asset imageName={fallbackAsset} width={size} height={size} fill={color} />
      ) : null
    }
  />
);

/** A symbol seated in a rounded tinted tile — the iOS settings-row treatment. */
export const IconTile: React.FC<
  IconProps & { background: string; tileSize?: number; radius?: number }
> = ({ background, tileSize = 30, radius = 8, size = 17, style, ...icon }) => (
  <View
    style={[
      styles.tile,
      { width: tileSize, height: tileSize, borderRadius: radius, backgroundColor: background },
      style,
    ]}
  >
    <Icon {...icon} size={size} />
  </View>
);

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
});

export default Icon;

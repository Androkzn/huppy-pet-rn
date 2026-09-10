/**
 * Asset primitives — ports of the web app's
 * Image.components.js, ImageCircle.components.js, Spinner.components.js and
 * LoadingAndError.components.js.
 *
 * Assets keep being addressed by file name, as on the web; SVG names resolve to
 * components (so `fill` still tints them), bitmap names to <Image> sources.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Image as RNImage,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { svgAssets, imageAssets } from '../assets';
import { symbolFor, toneColor } from '../ios/symbolMap';
import { useAppTheme } from '@theme/ThemeProvider';
import * as colors from '../../theme/colors';

const spinnerFrames = [
  require('../assets/spinner/activity_indicator1.png'),
  require('../assets/spinner/activity_indicator2.png'),
  require('../assets/spinner/activity_indicator3.png'),
  require('../assets/spinner/activity_indicator4.png'),
  require('../assets/spinner/activity_indicator5.png'),
];

interface AssetProps {
  /** File name as used on the web, e.g. 'arrow_down_green.svg'. */
  imageName: string;
  width?: number;
  height?: number;
  /** SVG only — overrides the icon color, as the web `fill` prop did. */
  fill?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Web's Image centers itself in a full-width container; opt out when inline. */
  block?: boolean;
}

/**
 * Web: <Image imageName="x.svg" width="20" height="20" />
 *
 * Icon names that have an SF Symbol equivalent render as that symbol on iOS —
 * which is how the whole app picked up the system icon set without every call
 * site changing. Artwork (placeholders, the wordmark, the spinner) keeps its
 * own asset. The symbol path is iOS-only, so `Icon`'s own fallback to this
 * component cannot loop back into it.
 */
export const Asset: React.FC<AssetProps> = ({
  imageName,
  width = 48,
  height = 48,
  fill,
  onPress,
  style,
  block = false,
}) => {
  const { colors: palette } = useAppTheme();
  const Svg = svgAssets[imageName];
  const bitmap = imageAssets[imageName];
  const mapping = Platform.OS === 'ios' ? symbolFor(imageName) : null;

  let content: React.ReactNode = null;
  if (mapping) {
    const size = Math.min(width, height);
    content = (
      <SymbolView
        name={mapping.symbol}
        size={size}
        tintColor={fill ?? toneColor(mapping.tone, palette)}
        weight="semibold"
        resizeMode="scaleAspectFit"
        style={{ width: size, height: size }}
        fallback={Svg ? <Svg width={width} height={height} fill={fill} /> : null}
      />
    );
  } else if (Svg) {
    content = <Svg width={width} height={height} fill={fill} />;
  } else if (bitmap) {
    content = <RNImage source={bitmap} style={{ width, height }} resizeMode="contain" />;
  }

  const body = (
    <View style={[block ? styles.blockContainer : styles.inlineContainer, style]}>
      {content}
    </View>
  );

  if (!onPress) return body;
  return <TouchableOpacity onPress={onPress}>{body}</TouchableOpacity>;
};

interface ImageCircleProps {
  imageName: string;
  /** A remote/base64 avatar; falls back to the named placeholder asset. */
  imageDataUrl?: string | null;
  width?: number;
  borderWidth?: number;
  borderColor?: string;
  onPress?: () => void;
}

/**
 * Web: ImageCircle — a round, white-bordered image with a placeholder fallback.
 */
export const ImageCircle: React.FC<ImageCircleProps> = ({
  imageName,
  imageDataUrl,
  width = 50,
  borderWidth = 2,
  borderColor,
  onPress,
}) => {
  const { colors: palette } = useAppTheme();
  const [failed, setFailed] = useState(false);
  // The ring separates the picture from whatever it sits on, so it follows the
  // surface colour rather than being pinned white.
  const ring = borderColor ?? palette.groupedSurface;

  useEffect(() => {
    setFailed(false);
  }, [imageDataUrl]);

  const source =
    !imageDataUrl || failed ? imageAssets[imageName] : { uri: imageDataUrl };

  const image = (
    <RNImage
      source={source}
      onError={() => setFailed(true)}
      style={{
        width,
        height: width,
        borderRadius: width / 2,
        borderWidth,
        borderColor: ring,
        backgroundColor: palette.tertiaryFill,
      }}
    />
  );

  if (!onPress) return image;
  return <TouchableOpacity onPress={onPress}>{image}</TouchableOpacity>;
};

/**
 * Web: Spinner — a five-frame paw animation cycling every 200ms.
 */
export const Spinner: React.FC<{ width?: number }> = ({ width = 60 }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setFrame((prev) => (prev + 1) % spinnerFrames.length),
      200
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <RNImage
      source={spinnerFrames[frame]}
      style={{ width, height: width }}
      resizeMode="contain"
    />
  );
};

interface LoadingAndErrorProps {
  isLoading?: boolean;
  isError?: boolean;
  placeholder?: string;
}

/**
 * Web: LoadingAndError — spinner while loading, error artwork on failure,
 * nothing once the data has arrived.
 */
export const LoadingAndError: React.FC<LoadingAndErrorProps> = ({
  isLoading,
  isError,
  placeholder = 'general_error.png',
}) => {
  if (isLoading) {
    return (
      <View style={styles.placeholder}>
        <Spinner />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.placeholder}>
        <Asset imageName={placeholder} width={200} height={250} />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
});

/**
 * TitleAndSlider — splitting 100% between two values.
 *
 * The iOS slider: a 4pt track that fills with the tint up to a round, raised
 * thumb. The two shares are named above the track and update live as it moves.
 */

import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Label } from '@components/ios/Text';

interface Props {
  title: string;
  firstValueTitle: string;
  secondValueTitle: string;
  firstValue: number;
  secondValue: number;
  onChange: (firstValue: number, secondValue: number) => void;
}

const THUMB_SIZE = 26;
const TRACK_HEIGHT = 4;

export const TitleAndSlider: React.FC<Props> = ({
  title,
  firstValueTitle,
  secondValueTitle,
  firstValue,
  secondValue,
  onChange,
}) => {
  const theme = useAppTheme();
  const { colors } = theme;

  // The slider position is the share held by the second value.
  const [value, setValue] = useState(
    secondValue === 0 ? 0 : 100 - firstValue + secondValue
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const valueRef = useRef(value);
  const lastHapticRef = useRef(value);

  const first = Math.floor(100 - value);
  const second = 100 - first;

  const setFromPosition = (x: number) => {
    const width = trackWidthRef.current;
    if (width <= 0) return;
    const next = Math.max(0, Math.min(100, Math.round((x / width) * 100)));
    valueRef.current = next;
    setValue(next);
    // A tick every ten points gives the drag some texture without chattering.
    if (Math.abs(next - lastHapticRef.current) >= 10) {
      lastHapticRef.current = next;
      haptics.selection();
    }
  };

  // Built once and read during render to spread its handlers onto the track.
  // A ref would have to be read during render to do that, which React forbids;
  // a memo is the same "create once" with none of that.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => setFromPosition(event.nativeEvent.locationX),
        onPanResponderMove: (event) => setFromPosition(event.nativeEvent.locationX),
        onPanResponderRelease: () => {
          const settled = Math.floor(100 - valueRef.current);
          onChange(settled, 100 - settled);
        },
      }),
    // The handlers only read refs and the latest `onChange`, so this is built
    // once for the life of the control.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  return (
    <View style={styles.container}>
      <Label variant="body">{title}</Label>

      <View style={styles.values}>
        <View style={styles.value}>
          <Label variant="footnote" role="secondary">
            {firstValueTitle}
          </Label>
          <Label variant="headline">{first}</Label>
        </View>
        <View style={[styles.value, styles.valueEnd]}>
          <Label variant="footnote" role="secondary">
            {secondValueTitle}
          </Label>
          <Label variant="headline">{second}</Label>
        </View>
      </View>

      <View
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: 100, now: second }}
        style={styles.track}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.trackBackground,
            { backgroundColor: colors.tertiaryFill },
          ]}
        />
        <View
          style={[
            styles.trackFill,
            { width: (trackWidth * value) / 100, backgroundColor: colors.tint },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: Math.max(
                -THUMB_SIZE / 2,
                Math.min(
                  (trackWidth * value) / 100 - THUMB_SIZE / 2,
                  trackWidth - THUMB_SIZE / 2
                )
              ),
              backgroundColor: colors.groupedSurface,
              borderColor: colors.separator,
              ...theme.shadow('sm'),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  values: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    gap: 1,
  },
  valueEnd: {
    alignItems: 'flex-end',
  },
  track: {
    height: THUMB_SIZE + 12,
    justifyContent: 'center',
  },
  trackBackground: {
    height: TRACK_HEIGHT,
    borderRadius: radius.capsule,
  },
  trackFill: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: radius.capsule,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default TitleAndSlider;

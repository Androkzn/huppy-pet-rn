/**
 * TitleAndSlider — port of the web app's TitleAndSlider (Form.components.js):
 * a lightBrown panel with the title, the two labelled values, and a green
 * slider splitting 100% between them.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

interface Props {
  title: string;
  firstValueTitle: string;
  secondValueTitle: string;
  firstValue: number;
  secondValue: number;
  onChange: (firstValue: number, secondValue: number) => void;
}

const THUMB_SIZE = 20;

export const TitleAndSlider: React.FC<Props> = ({
  title,
  firstValueTitle,
  secondValueTitle,
  firstValue,
  secondValue,
  onChange,
}) => {
  // Web: the slider position is the share held by the second value.
  const [value, setValue] = useState(
    secondValue === 0 ? 0 : 100 - firstValue + secondValue
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const valueRef = useRef(value);

  const first = Math.floor(100 - value);
  const second = 100 - first;

  const setFromPosition = (x: number) => {
    const width = trackWidthRef.current;
    if (width <= 0) return;
    const next = Math.max(0, Math.min(100, Math.round((x / width) * 100)));
    valueRef.current = next;
    setValue(next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        setFromPosition(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        setFromPosition(event.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {
        const settled = Math.floor(100 - valueRef.current);
        onChange(settled, 100 - settled);
      },
    })
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.sliderContainer}>
        <View style={styles.valueContainer}>
          <Text style={styles.valueTitle}>{firstValueTitle}</Text>
          <Text style={styles.valueTitle}>{first}</Text>
        </View>

        <View style={styles.track} onLayout={onLayout} {...panResponder.panHandlers}>
          <View style={styles.trackBackground} />
          <View
            style={[
              styles.trackFill,
              { width: (trackWidth * value) / 100 },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: Math.max(
                  0,
                  (trackWidth * value) / 100 - THUMB_SIZE / 2
                ),
              },
            ]}
          />
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.valueTitle}>{secondValueTitle}</Text>
          <Text style={styles.valueTitle}>{second}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    margin: 3,
    backgroundColor: colors.lightBrown,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    marginVertical: 5,
    color: colors.black,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  valueContainer: {
    alignItems: 'center',
    width: 100,
  },
  valueTitle: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  track: {
    flex: 1,
    height: THUMB_SIZE + 10,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  trackBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lightBrown2,
  },
  trackFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.green,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.green,
  },
});

export default TitleAndSlider;

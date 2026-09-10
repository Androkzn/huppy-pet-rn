/**
 * ChartPie — the diet balance, as a ring.
 *
 * One arc per food category, sized by weight and filled with the category's
 * colour, around a 60% cutout. The ring reads as a single figure, so the empty
 * state is a quiet track in the system fill rather than a coloured circle.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useAppTheme } from '@theme/ThemeProvider';

export interface PieDatum {
  name: string;
  weight: number;
  percentage: number;
  color: string;
}

interface Props {
  data: PieDatum[];
  size?: number;
}

export const ChartPie: React.FC<Props> = ({ data, size = 200 }) => {
  const { colors } = useAppTheme();
  const total = data.reduce((sum, item) => sum + item.weight, 0);

  // cutout: '60%' — the ring is the outer 40% of the radius.
  const outerRadius = size / 2;
  const strokeWidth = outerRadius * 0.4;
  const radius = outerRadius - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Rotate so the first arc starts at 12 o'clock, as Chart.js does. */}
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {total === 0 ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.tertiaryFill}
              strokeWidth={strokeWidth}
              fill="none"
            />
          ) : (
            data.map((item) => {
              const fraction = item.weight / total;
              const dash = circumference * fraction;
              const circle = (
                <Circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return circle;
            })
          )}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChartPie;

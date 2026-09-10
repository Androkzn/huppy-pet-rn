/**
 * StatisticBarChart — the daily totals for the selected metric.
 *
 * Rounded tint bars on a quiet baseline, with the value above each bar while
 * the range is short enough to read. The average and goal are dashed reference
 * lines, switched on from the legend beneath — kept out of the plot until asked
 * for, so the shape of the data reads first.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Label } from './ios/Text';

export interface ChartPoint {
  name: string;
  amount: number;
  average: number;
}

interface Props {
  data: ChartPoint[];
  title: string;
  goal: number;
}

const CHART_HEIGHT = 260;
const PLOT_TOP = 22;
const PLOT_BOTTOM = CHART_HEIGHT - 34;
const AXIS_LEFT = 38;

export const StatisticBarChart: React.FC<Props> = ({ data, title, goal }) => {
  const { colors } = useAppTheme();
  const [showAverage, setShowAverage] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const average = data[0]?.average ?? 0;
  const chartWidth = Math.max(
    Math.min(windowWidth, 700) - layout.screenPadding * 2 - spacing.xl,
    200
  );
  const plotWidth = chartWidth - AXIS_LEFT - 8;

  const maxValue = Math.max(
    ...data.map((point) => point.amount),
    showAverage ? average : 0,
    showGoal ? goal : 0,
    1
  );

  const scaleY = (value: number) =>
    PLOT_BOTTOM - (value / maxValue) * (PLOT_BOTTOM - PLOT_TOP);

  const slot = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.max(slot * 0.62, 3);

  /** Past eight points there is only room for the day number. */
  const formatLabel = (name: string) => {
    if (data.length < 9) return name;
    const match = name.match(/(\d+)/);
    return match ? match[1] : name;
  };

  const legendChip = (
    label: string,
    active: boolean,
    color: string,
    onToggle: () => void
  ) => (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      accessibilityLabel={label}
      onPress={() => {
        haptics.selection();
        onToggle();
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.tintSoft : colors.tertiaryFill,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.chipDash, { backgroundColor: color, opacity: active ? 1 : 0.4 }]} />
      <Label variant="footnote" role={active ? 'primary' : 'secondary'} weight="600">
        {label}
      </Label>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {title ? (
        <Label variant="subheadline" role="secondary" style={styles.title}>
          {title}
        </Label>
      ) : null}

      <Svg width={chartWidth} height={CHART_HEIGHT}>
        {/* Baseline */}
        <Line
          x1={AXIS_LEFT}
          y1={PLOT_BOTTOM}
          x2={AXIS_LEFT + plotWidth}
          y2={PLOT_BOTTOM}
          stroke={colors.separator}
          strokeWidth={1}
        />

        {data.map((point, index) => {
          const x = AXIS_LEFT + index * slot + (slot - barWidth) / 2;
          const y = scaleY(point.amount);
          const showAnnotation = point.amount !== 0 && data.length <= 10;

          return (
            <React.Fragment key={`${point.name}-${index}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(PLOT_BOTTOM - y, 0)}
                rx={Math.min(barWidth / 2, 6)}
                fill={colors.tint}
                opacity={0.85}
              />
              {showAnnotation ? (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fontSize={11}
                  fontWeight="600"
                  fill={colors.secondaryLabel}
                  textAnchor="middle"
                >
                  {String(point.amount)}
                </SvgText>
              ) : null}
              <SvgText
                x={x + barWidth / 2}
                y={PLOT_BOTTOM + 18}
                fontSize={11}
                fill={colors.tertiaryLabel}
                textAnchor="middle"
              >
                {formatLabel(point.name)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Value axis: only the extremes, as a sparkline-style chart does. */}
        <SvgText
          x={AXIS_LEFT - 8}
          y={PLOT_TOP + 4}
          fontSize={11}
          fill={colors.tertiaryLabel}
          textAnchor="end"
        >
          {String(maxValue)}
        </SvgText>
        <SvgText
          x={AXIS_LEFT - 8}
          y={PLOT_BOTTOM}
          fontSize={11}
          fill={colors.tertiaryLabel}
          textAnchor="end"
        >
          0
        </SvgText>

        {showAverage && average !== 0 ? (
          <Line
            x1={AXIS_LEFT}
            y1={scaleY(average)}
            x2={AXIS_LEFT + plotWidth}
            y2={scaleY(average)}
            stroke={colors.blue}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
        ) : null}
        {showGoal && goal !== 0 ? (
          <Line
            x1={AXIS_LEFT}
            y1={scaleY(goal)}
            x2={AXIS_LEFT + plotWidth}
            y2={scaleY(goal)}
            stroke={colors.green}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
        ) : null}
      </Svg>

      <View style={styles.legend}>
        {average !== 0
          ? legendChip('Average', showAverage, colors.blue, () =>
              setShowAverage((current) => !current)
            )
          : null}
        {goal !== 0
          ? legendChip('Goal', showGoal, colors.green, () =>
              setShowGoal((current) => !current)
            )
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.capsule,
    borderCurve: 'continuous',
  },
  chipDash: {
    width: 14,
    height: 2,
    borderRadius: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default StatisticBarChart;

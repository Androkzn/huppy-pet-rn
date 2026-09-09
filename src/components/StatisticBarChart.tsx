/**
 * StatisticBarChart — port of the web app's StatisticBarChart.component.js.
 *
 * The web renders a Google ComboChart; here the same picture is drawn with
 * react-native-svg: lightOrange bars, green value annotations (hidden at zero
 * or beyond ten points), green axis labels, and optional average / goal lines
 * behind the two toggles underneath.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';

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

const CHART_HEIGHT = 320;
// Web chartArea: 75% width, 80% height.
const PLOT_TOP = 20;
const PLOT_BOTTOM = CHART_HEIGHT - 40;
const AXIS_LEFT = 40;

export const StatisticBarChart: React.FC<Props> = ({ data, title, goal }) => {
  const [showAverage, setShowAverage] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const average = data[0]?.average ?? 0;
  const chartWidth = Math.max(windowWidth - 40, 200);
  const plotWidth = chartWidth - AXIS_LEFT - 10;

  const maxValue = Math.max(
    ...data.map((d) => d.amount),
    showAverage ? average : 0,
    showGoal ? goal : 0,
    1
  );

  const scaleY = (value: number) =>
    PLOT_BOTTOM - (value / maxValue) * (PLOT_BOTTOM - PLOT_TOP);

  const slot = plotWidth / Math.max(data.length, 1);
  // Web bar.groupWidth: 65%.
  const barWidth = slot * 0.65;

  /** Past eight points the web shows only the day number. */
  const formatLabel = (name: string) => {
    if (data.length < 9) return name;
    const match = name.match(/(\d+)/);
    return match ? match[1] : name;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>{title}</Text>

      <Svg width={chartWidth} height={CHART_HEIGHT}>
        {/* Bars and their annotations */}
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
                fill={colors.lightOrange}
              />
              {showAnnotation && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 4}
                  fontSize={11}
                  fontFamily={fontFamily.bold}
                  fill={colors.green}
                  textAnchor="middle"
                >
                  {String(point.amount)}
                </SvgText>
              )}
              <SvgText
                x={x + barWidth / 2}
                y={PLOT_BOTTOM + 16}
                fontSize={12}
                fontFamily={fontFamily.regular}
                fill={colors.green}
                textAnchor="middle"
              >
                {formatLabel(point.name)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Value axis */}
        <SvgText
          x={AXIS_LEFT - 6}
          y={PLOT_TOP + 4}
          fontSize={12}
          fontFamily={fontFamily.regular}
          fill={colors.green}
          textAnchor="end"
        >
          {String(maxValue)}
        </SvgText>
        <SvgText
          x={AXIS_LEFT - 6}
          y={PLOT_BOTTOM}
          fontSize={12}
          fontFamily={fontFamily.regular}
          fill={colors.green}
          textAnchor="end"
        >
          0
        </SvgText>

        {showAverage && average !== 0 && (
          <Line
            x1={AXIS_LEFT}
            y1={scaleY(average)}
            x2={AXIS_LEFT + plotWidth}
            y2={scaleY(average)}
            stroke={colors.blue}
            strokeWidth={2}
          />
        )}
        {showGoal && goal !== 0 && (
          <Line
            x1={AXIS_LEFT}
            y1={scaleY(goal)}
            x2={AXIS_LEFT + plotWidth}
            y2={scaleY(goal)}
            stroke={colors.lightGreen2}
            strokeWidth={2}
          />
        )}
      </Svg>

      <View style={styles.buttonContainer}>
        {average !== 0 && (
          <View style={styles.toggleRow}>
            <View style={[styles.circle, { backgroundColor: colors.blue }]} />
            <Text style={styles.toggleTitle}>Average</Text>
            <Switch
              value={showAverage}
              onValueChange={setShowAverage}
              trackColor={{ false: colors.olive, true: colors.orange }}
              thumbColor={colors.white}
            />
          </View>
        )}
        {goal !== 0 && (
          <View style={styles.toggleRow}>
            <View
              style={[styles.circle, { backgroundColor: colors.lightGreen2 }]}
            />
            <Text style={styles.toggleTitle}>Goal</Text>
            <Switch
              value={showGoal}
              onValueChange={setShowGoal}
              trackColor={{ false: colors.olive, true: colors.orange }}
              thumbColor={colors.white}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  chartTitle: {
    color: colors.green,
    fontSize: 17,
    fontFamily: fontFamily.bold,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  toggleTitle: {
    color: colors.grayDark,
    fontSize: 15,
    fontFamily: fontFamily.regular,
    marginHorizontal: 5,
  },
});

export default StatisticBarChart;

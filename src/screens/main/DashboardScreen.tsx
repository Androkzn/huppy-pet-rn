/**
 * Dashboard Screen - Statistics
 * View nutrition statistics and charts
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { Title, Body, Card } from '@components/ui';
import { useProfile } from '@contexts/ProfileContext';
import { useGetFoodForPeriod } from '@hooks/useGraphQL';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = MainTabScreenProps<'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const { currentProfile } = useProfile();

  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (period === 'week' ? 7 : 30));

  const {
    data: foodData,
    isLoading,
  } = useGetFoodForPeriod(
    currentProfile?._id || '',
    currentProfile?._id || '',
    startDate,
    new Date()
  );

  const calculateStats = () => {
    if (!foodData || foodData.length === 0) {
      return {
        totalWeight: 0,
        totalCalories: 0,
        averageDaily: 0,
        daysTracked: 0,
      };
    }

    const totalWeight = foodData.reduce((sum, item) => sum + (item.weight || 0), 0);
    const totalCalories = foodData.reduce((sum, item) => sum + (item.calories || 0), 0);
    const daysTracked = period === 'week' ? 7 : 30;
    const averageDaily = totalWeight / daysTracked;

    return {
      totalWeight: Math.round(totalWeight),
      totalCalories: Math.round(totalCalories),
      averageDaily: Math.round(averageDaily),
      daysTracked,
    };
  };

  const stats = calculateStats();

  if (!currentProfile) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="chart-line"
          size={80}
          color={theme.colors.primary}
        />
        <Title style={styles.emptyTitle}>No Profile Found</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Title style={styles.title}>Statistics</Title>
      <Body style={styles.subtitle}>
        {period === 'week' ? 'Last 7 days' : 'Last 30 days'}
      </Body>

      {/* Summary Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="food"
                size={32}
                color={theme.colors.primary}
              />
              <Body style={styles.statLabel}>Total Food</Body>
              <Title style={styles.statValue}>{stats.totalWeight}g</Title>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="fire"
                size={32}
                color={theme.colors.secondary}
              />
              <Body style={styles.statLabel}>Total Calories</Body>
              <Title style={styles.statValue}>{stats.totalCalories}</Title>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Average Daily */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Daily Average</Title>
          <View style={styles.infoRow}>
            <Body>Average per day:</Body>
            <Body style={styles.value}>{stats.averageDaily}g</Body>
          </View>
          <View style={styles.infoRow}>
            <Body>Target daily:</Body>
            <Body style={styles.value}>{currentProfile.dailyPortion}g</Body>
          </View>
          <View style={styles.infoRow}>
            <Body>Difference:</Body>
            <Body
              style={[
                styles.value,
                {
                  color:
                    stats.averageDaily >= currentProfile.dailyPortion
                      ? theme.colors.primary
                      : theme.colors.error,
                },
              ]}
            >
              {stats.averageDaily >= currentProfile.dailyPortion ? '+' : ''}
              {Math.round(stats.averageDaily - currentProfile.dailyPortion)}g
            </Body>
          </View>
        </Card.Content>
      </Card>

      {/* Placeholder for Charts */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Weekly Trends</Title>
          <Body style={styles.placeholderText}>
            Charts will be displayed here using Victory Native XL
          </Body>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Category Breakdown</Title>
          <Body style={styles.placeholderText}>
            Food category pie chart will be displayed here
          </Body>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontWeight: '600',
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.6,
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

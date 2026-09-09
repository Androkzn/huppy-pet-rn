/**
 * Dashboard Screen — port of the web app's Dashboard.page.js.
 *
 * A From / To date range, the Calories | Activities | Trainings filter tabs,
 * and the bar chart for the selected metric — or the no-data artwork.
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import {
  useGetFoodForPeriod,
  useGetActivitiesForPeriod,
  useGetTrainingsForPeriod,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import CustomDatePicker from '@components/CustomDatePicker';
import StatisticBarChart, { ChartPoint } from '@components/StatisticBarChart';
import { FilterStatistic } from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

type Props = MainTabScreenProps<'Dashboard'>;

// Constants.helper.js: estimated calories per 1kg of dog weight.
const EST_CALORIES = 18.59;

const dateOneWeekAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

/** Every day between two dates, inclusive — the web's getDatesBetween. */
const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};

const formatDay = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function DashboardScreen({}: Props) {
  const { currentProfile } = useProfile();
  const { user } = useAuth();

  const [fromDate, setFromDate] = useState(dateOneWeekAgo());
  const [toDate, setToDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<string>(
    FilterStatistic.CALORIES
  );

  const userId = user?.id || '';
  const profileId = currentProfile?._id || '';

  const {
    data: food,
    isLoading: isLoadingFood,
    isError: isErrorFood,
  } = useGetFoodForPeriod(userId, profileId, fromDate, toDate);
  const { data: activities } = useGetActivitiesForPeriod(
    userId,
    profileId,
    fromDate,
    toDate
  );
  const { data: trainings } = useGetTrainingsForPeriod(
    userId,
    profileId,
    fromDate,
    toDate
  );

  const getDataSource = (): any[] | undefined => {
    switch (selectedFilter) {
      case FilterStatistic.CALORIES:
        return food;
      case FilterStatistic.ACTIVITIES:
        return activities;
      case FilterStatistic.TRAININGS:
        return trainings?.filter((training: any) => training.isCompleted);
      default:
        return [];
    }
  };

  const chartData: ChartPoint[] = useMemo(() => {
    const source = getDataSource();
    if (!source || source.length === 0) return [];

    // Total per day for the selected metric.
    const groupedData = source.reduce((result: any[], currentItem: any) => {
      const formattedDate = formatDay(new Date(currentItem.date));
      const existingIndex = result.findIndex(
        (item) => item.name === formattedDate
      );

      if (existingIndex !== -1) {
        if (selectedFilter === FilterStatistic.CALORIES) {
          result[existingIndex].amount += Math.floor(
            (currentItem.calories / 100) * currentItem.weight
          );
        } else if (selectedFilter === FilterStatistic.ACTIVITIES) {
          result[existingIndex].amount += currentItem.duration;
        } else if (
          selectedFilter === FilterStatistic.TRAININGS &&
          currentItem.isCompleted
        ) {
          result[existingIndex].amount += 1;
        }
        return result;
      }

      const newItem = { name: formattedDate, amount: 0 };
      if (selectedFilter === FilterStatistic.CALORIES) {
        newItem.amount = Math.floor(
          (currentItem.calories / 100) * currentItem.weight
        );
        result.push(newItem);
      } else if (selectedFilter === FilterStatistic.ACTIVITIES) {
        newItem.amount = currentItem.burnedCalories;
        result.push(newItem);
      } else if (
        selectedFilter === FilterStatistic.TRAININGS &&
        currentItem.isCompleted
      ) {
        newItem.amount = 1;
        result.push(newItem);
      }
      return result;
    }, []);

    // Days with no entries still get a zero column.
    const filledData = getDatesBetween(new Date(fromDate), new Date(toDate)).map(
      (date) => {
        const formattedDate = formatDay(date);
        return (
          groupedData.find((item: any) => item.name === formattedDate) ?? {
            name: formattedDate,
            amount: 0,
          }
        );
      }
    );

    const total = filledData.reduce(
      (sum: number, item: any) => sum + item.amount,
      0
    );
    const overallAverage = Math.floor(
      filledData.length !== 0 ? total / filledData.length : 0
    );

    return filledData.map((item: any) => ({ ...item, average: overallAverage }));
  }, [food, activities, trainings, selectedFilter, fromDate, toDate]);

  const getChartTitle = (): string => {
    const source = getDataSource();
    if (!source || source.length === 0) return '';
    switch (selectedFilter) {
      case FilterStatistic.CALORIES:
        return 'Total calories per day, kcal';
      case FilterStatistic.ACTIVITIES:
        return 'Burned calories per day, kcal';
      case FilterStatistic.TRAININGS:
        return 'Compleated trainings per day';
      default:
        return '';
    }
  };

  /** Daily calorie goal from the pet's weight and daily ratio. */
  const getGoal = (): number => {
    const source = getDataSource();
    if (!source || source.length === 0) return 0;
    if (selectedFilter === FilterStatistic.CALORIES && currentProfile) {
      return Math.floor(
        EST_CALORIES * currentProfile.weight * currentProfile.dailyRatio
      );
    }
    return 0;
  };

  return (
    <PageContainer>
      <View style={styles.selectDateContainer}>
        <View style={styles.datePickerContainer}>
          <CustomDatePicker
            label="From"
            value={fromDate}
            onChange={setFromDate}
            style={styles.datePicker}
          />
          <CustomDatePicker
            label="To"
            value={toDate}
            onChange={setToDate}
            style={styles.datePicker}
          />
        </View>

        <View style={styles.tabs}>
          {Object.values(FilterStatistic).map((filter) => {
            const isSelected = filter === selectedFilter;
            return (
              <Pressable
                key={filter}
                style={[styles.tab, isSelected && styles.tabSelected]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isLoadingFood || isErrorFood ? (
        <View style={styles.placeholderContainer}>
          <LoadingAndError isLoading={isLoadingFood} isError={isErrorFood} />
        </View>
      ) : chartData.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Asset imageName="no_data_placeholder.png" width={200} height={170} />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <StatisticBarChart
            data={chartData}
            title={getChartTitle()}
            goal={getGoal()}
          />
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  selectDateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '95%',
  },
  datePicker: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  tabs: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  // Web selected tab: orange label on a 10% green wash.
  tabSelected: {
    backgroundColor: 'rgba(43, 99, 98, 0.1)',
  },
  tabLabel: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  tabLabelSelected: {
    color: colors.orange,
  },
  placeholderContainer: {
    marginVertical: 100,
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

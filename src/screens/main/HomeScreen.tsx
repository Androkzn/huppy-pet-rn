/**
 * Home Screen - Daily Diary
 * Main screen for tracking daily meals and activities
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { Container, Title, Body, Card, Button } from '@components/ui';
import { useProfile } from '@contexts/ProfileContext';
import {
  useGetMealsForDate,
  useGetFoodForDate,
  useGetActivitiesForDate,
  useAddMeal,
} from '@hooks/useGraphQL';
import { useTheme, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddActivityDialog, AddTrainingDialog, EditActivityDialog } from '@components/dialogs';
import { useNavigation } from '@react-navigation/native';
import type { Activity } from '../../types';

type Props = MainTabScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const rootNavigation = useNavigation<any>();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [showEditActivityDialog, setShowEditActivityDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Fetch data for current date
  const {
    data: meals,
    isLoading: mealsLoading,
    refetch: refetchMeals,
  } = useGetMealsForDate(currentProfile?._id || '', currentDate, currentDate);

  const {
    data: food,
    isLoading: foodLoading,
    refetch: refetchFood,
  } = useGetFoodForDate(currentProfile?._id || '', currentProfile?._id || '', currentDate);

  const {
    data: activities,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useGetActivitiesForDate(currentProfile?._id || '', currentDate);

  const { mutate: addMeal } = useAddMeal();

  const isLoading = mealsLoading || foodLoading || activitiesLoading;

  // Auto-create meal if none exists (like old Home.page.js)
  useEffect(() => {
    if (!mealsLoading && !meals || (meals && meals.length === 0)) {
      if (currentProfile) {
        addMeal({
          userId: currentProfile.userId,
          profileId: currentProfile._id,
          date: currentDate,
        });
      }
    }
  }, [mealsLoading, meals, currentProfile, currentDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMeals(), refetchFood(), refetchActivities()]);
    setRefreshing(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const calculateDailyTotals = () => {
    if (!food || food.length === 0) {
      return {
        totalWeight: 0,
        totalCalories: 0,
        percentageOfDaily: 0,
      };
    }

    const totalWeight = food.reduce((sum, item) => sum + (item.weight || 0), 0);
    const totalCalories = food.reduce(
      (sum, item) => sum + (item.calories || 0),
      0
    );
    const percentageOfDaily = currentProfile?.dailyPortion
      ? (totalWeight / currentProfile.dailyPortion) * 100
      : 0;

    return {
      totalWeight: Math.round(totalWeight),
      totalCalories: Math.round(totalCalories),
      percentageOfDaily: Math.round(percentageOfDaily),
    };
  };

  const totals = calculateDailyTotals();

  if (!currentProfile) {
    return (
      <Container style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="dog"
            size={80}
            color={theme.colors.primary}
          />
          <Title style={styles.emptyTitle}>No Profile Found</Title>
          <Body style={styles.emptyBody}>
            Please create a pet profile to start tracking meals.
          </Body>
        </View>
      </Container>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.profileName}>{currentProfile.name}'s Diary</Title>
        </View>

        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
          <Button
            mode="text"
            onPress={goToPreviousDay}
            compact
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.primary}
            />
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {formatDate(currentDate)}
          </Button>
          <Button
            mode="text"
            onPress={goToNextDay}
            compact
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </Button>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Daily Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Daily Summary</Title>
            <View style={styles.summaryRow}>
              <Body>Total Weight:</Body>
              <Body style={styles.summaryValue}>
                {totals.totalWeight}g / {currentProfile.dailyPortion}g
              </Body>
            </View>
            <View style={styles.summaryRow}>
              <Body>Progress:</Body>
              <Body
                style={{
                  ...styles.summaryValue,
                  color:
                    totals.percentageOfDaily >= 100
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                }}
              >
                {totals.percentageOfDaily}%
              </Body>
            </View>
            <View style={styles.summaryRow}>
              <Body>Calories:</Body>
              <Body style={styles.summaryValue}>{totals.totalCalories} kcal</Body>
            </View>
          </Card.Content>
        </Card>

        {/* Meals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Meals</Title>
            <Button
              mode="text"
              compact
              onPress={() => {
                if (meals && meals.length > 0) {
                  rootNavigation.navigate('Food', {
                    screen: 'SearchFood',
                    params: { mealId: meals[0]._id },
                  });
                }
              }}
            >
              Add Food
            </Button>
          </View>

          {isLoading ? (
            <Card style={styles.card}>
              <Card.Content>
                <Body>Loading meals...</Body>
              </Card.Content>
            </Card>
          ) : meals && meals.length > 0 ? (
            meals.map((meal: any) => (
              <Card key={meal._id} style={styles.card}>
                <Card.Content>
                  <View style={styles.mealHeader}>
                    <MaterialCommunityIcons
                      name="food"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Body style={styles.mealTime}>
                      {new Date(meal.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Body>
                  </View>
                  {/* Food items for this meal */}
                  {food
                    ?.filter((f: any) => f.mealId === meal._id)
                    .map((foodItem: any) => (
                      <TouchableOpacity
                        key={foodItem._id}
                        onPress={() => {
                          rootNavigation.navigate('Food', {
                            screen: 'EditFood',
                            params: { foodId: foodItem._id },
                          });
                        }}
                      >
                        <View style={styles.foodItem}>
                          <Body>{foodItem.name}</Body>
                          <Body style={styles.foodWeight}>{foodItem.weight}g</Body>
                        </View>
                      </TouchableOpacity>
                    ))}
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                <Body style={styles.emptyText}>
                  No meals recorded for this day
                </Body>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Activities</Title>
            <Button
              mode="text"
              compact
              onPress={() => setShowActivityDialog(true)}
            >
              Add Activity
            </Button>
          </View>

          {activities && activities.length > 0 ? (
            activities.map((activity: any) => (
              <TouchableOpacity
                key={activity._id}
                onPress={() => {
                  setSelectedActivity(activity);
                  setShowEditActivityDialog(true);
                }}
              >
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.activityHeader}>
                      <MaterialCommunityIcons
                        name={
                          activity.type === 'walk'
                            ? 'walk'
                            : activity.type === 'run'
                            ? 'run'
                            : 'paw'
                        }
                        size={24}
                        color={theme.colors.primary}
                      />
                      <View style={styles.activityInfo}>
                        <Body style={styles.activityType}>
                          {activity.type?.charAt(0).toUpperCase() +
                            activity.type?.slice(1)}
                        </Body>
                        <Body style={styles.activityDetails}>
                          {activity.duration} min
                          {activity.distance ? ` • ${activity.distance} km` : ''}
                        </Body>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                <Body style={styles.emptyText}>
                  No activities recorded for this day
                </Body>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          if (meals && meals.length > 0) {
            rootNavigation.navigate('Food', {
              screen: 'SearchFood',
              params: { mealId: meals[0]._id },
            });
          }
        }}
      />

      {/* Dialogs */}
      <AddActivityDialog
        visible={showActivityDialog}
        onDismiss={() => setShowActivityDialog(false)}
        selectedDate={currentDate}
      />
      <AddTrainingDialog
        visible={showTrainingDialog}
        onDismiss={() => setShowTrainingDialog(false)}
        selectedDate={currentDate}
      />
      <EditActivityDialog
        visible={showEditActivityDialog}
        onDismiss={() => {
          setShowEditActivityDialog(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTime: {
    marginLeft: 8,
    fontWeight: '600',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  foodWeight: {
    fontWeight: '500',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  activityType: {
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBody: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

/**
 * Home Screen (Diary) — the day's nutrition, meals and activities.
 *
 * A large title over three groups: the nutrition summary, the meals of the day,
 * and the day's activities. The day itself is steered from the stepper in the
 * navigation bar, so the content only has to state what happened on it.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import {
  useGetMealsForDate,
  useGetFoodForDate,
  useGetActivitiesForDate,
  useGetAllFoodCategories,
  useAddMeal,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Section } from '@components/ui/Section';
import { LoadingAndError } from '@components/ui/Asset';
import { EmptyState } from '@components/ios/Feedback';
import { Asset } from '@components/ui/Asset';
import MealCard from '@components/MealCard';
import ActivityCard from '@components/ActivityCard';
import {
  CaloriesStatisticSection,
  CategoriesStatisticSection,
  ToggleStatisticSection,
} from '@components/Statistic';
import { AddActivityDialog } from '@components/dialogs';
import { spacing } from '@theme/tokens';
import type { Meal, FoodCategory, Activity } from '../../types';

type Props = MainTabScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { currentProfile, isLoading: isLoadingProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();

  const profileId = currentProfile?._id || '';
  const userId = user?.id || '';

  // The nutrition detail starts collapsed; the headline figure is always shown.
  const [isStatisticExpanded, setStatisticExpanded] = useState(false);
  const [isStatisticToday, setStatisticToday] = useState(true);
  const [isActivitiesExpanded, setActivitiesExpanded] = useState(true);
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  const {
    data: meals,
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
  } = useGetMealsForDate(userId, currentDate, currentDate);

  const {
    data: food,
    isLoading: isLoadingFood,
    isError: isErrorFood,
  } = useGetFoodForDate(userId, profileId, currentDate);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetAllFoodCategories(profileId);

  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
  } = useGetActivitiesForDate(userId, currentDate);

  const { mutate: addMeal } = useAddMeal();

  // A day with no meal gets an empty one created for it.
  useEffect(() => {
    if (!isLoadingMeals && !isErrorMeals && (!meals || meals.length === 0)) {
      if (currentProfile && user) {
        addMeal({
          date: currentDate,
          profileId: currentProfile._id,
          userId: user.id,
        });
      }
    }
  }, [isLoadingMeals, isErrorMeals, meals]);

  const mealList: Meal[] = meals ?? [];
  const categoryList: FoodCategory[] = categories ?? [];
  const activityList: Activity[] = activities ?? [];

  const isStatisticLoading =
    isLoadingFood || isLoadingCategories || isLoadingActivities;
  const isStatisticError = isErrorFood || isErrorCategories || isErrorActivities;

  // A new account has no pet yet. Without one there is nothing to log against,
  // so the diary asks for the pet rather than showing empty sections whose
  // controls would do nothing.
  if (!isLoadingProfile && !currentProfile) {
    return (
      <PageContainer title="Diary">
        <EmptyState
          symbol="pawprint.fill"
          title="Add your pet"
          message="Create a profile to start tracking meals, activities and training."
          actionLabel="Add pet"
          onAction={() => navigation.getParent()?.navigate('Register')}
          illustration={
            <Asset imageName="add_avatar_placeholder_orange.png" width={180} height={150} />
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Diary" subtitle={currentProfile?.name}>
      <View style={styles.stack}>
        {/* Nutrition */}
        <Section
          title="Nutrition"
          titleRight={isStatisticToday ? 'Today / Goal' : 'This week / Goal'}
          expanded={isStatisticExpanded}
          onToggle={() => setStatisticExpanded(!isStatisticExpanded)}
        >
          {isStatisticLoading || isStatisticError ? (
            <View style={styles.placeholder}>
              <LoadingAndError
                isLoading={isStatisticLoading}
                isError={isStatisticError}
              />
            </View>
          ) : (
            <View>
              <CaloriesStatisticSection
                foodData={food}
                categories={categoryList}
                activities={activityList}
                currentProfile={currentProfile}
                isStatisticToday={isStatisticToday}
              />
              {categoryList.map((category) => (
                <CategoriesStatisticSection
                  key={category.name}
                  category={category}
                  categories={categoryList}
                  currentProfile={currentProfile}
                  foodData={food}
                  isStatisticToday={isStatisticToday}
                />
              ))}
              <ToggleStatisticSection
                initialValue={!isStatisticToday}
                onChange={() => setStatisticToday(!isStatisticToday)}
              />
            </View>
          )}
        </Section>

        {/* Meals */}
        <Section title="Meals" plain>
          {isLoadingMeals || isErrorMeals ? (
            <View style={styles.placeholder}>
              <LoadingAndError isLoading={isLoadingMeals} isError={isErrorMeals} />
            </View>
          ) : (
            mealList.map((meal, index) => (
              <MealCard
                key={meal._id}
                meal={meal}
                index={index + 1}
                mealsCount={mealList.length}
              />
            ))
          )}
        </Section>

        {/* Activities */}
        <Section
          title="Activities"
          plain
          expanded={isActivitiesExpanded}
          onToggle={() => setActivitiesExpanded(!isActivitiesExpanded)}
          onAdd={() => {
            setActivitiesExpanded(true);
            setShowActivityDialog(true);
          }}
        >
          {isLoadingActivities || isErrorActivities ? (
            <View style={styles.placeholder}>
              <LoadingAndError
                isLoading={isLoadingActivities}
                isError={isErrorActivities}
              />
            </View>
          ) : activityList.length > 0 ? (
            activityList.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))
          ) : (
            <EmptyState
              symbol="figure.walk"
              title="No activities yet"
              message="Add a walk, a run or a swim to count it toward the day."
              actionLabel="Add activity"
              onAction={() => setShowActivityDialog(true)}
              illustration={
                <Asset
                  imageName="no_activities_placeholder.png"
                  width={180}
                  height={150}
                />
              }
            />
          )}
        </Section>
      </View>

      <AddActivityDialog
        visible={showActivityDialog}
        onDismiss={() => setShowActivityDialog(false)}
        selectedDate={currentDate}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.xl,
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});

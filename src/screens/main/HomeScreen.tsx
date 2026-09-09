/**
 * Home Screen (Diary) — port of the web app's Home.page.js.
 *
 * The small-screen layout: the STATS section, the meal cards, and the
 * ACTIVITIES section. The date picker lives in the NavBar and the DIET BALANCE
 * chart is hidden below the web's `smallScreen` breakpoint, exactly as there.
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
  useAddActivity,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Section } from '@components/ui/Section';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import MealCard from '@components/MealCard';
import ActivityCard from '@components/ActivityCard';
import {
  CaloriesStatisticSection,
  CategoriesStatisticSection,
  ToggleStatisticSection,
} from '@components/Statistic';
import { AddActivityDialog } from '@components/dialogs';
import * as colors from '../../theme/colors';
import type { Meal, FoodCategory, Activity } from '../../types';

type Props = MainTabScreenProps<'Home'>;

export default function HomeScreen({}: Props) {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();

  const profileId = currentProfile?._id || '';
  const userId = user?.id || '';

  // Web: on a small screen the stats start collapsed.
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
  const { mutate: addActivity } = useAddActivity();

  // Web: a day with no meal gets an empty one created for it.
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

  return (
    <PageContainer>
      {/* STATS */}
      <Section
        title="STATS"
        titleRight={isStatisticToday ? 'Today / Goal' : 'This week / Goal'}
        expanded={isStatisticExpanded}
        onToggle={() => setStatisticExpanded(!isStatisticExpanded)}
        style={styles.statisticSection}
      >
        {isStatisticLoading || isStatisticError ? (
          <View style={styles.statisticContainer}>
            <View style={styles.placeholder}>
              <LoadingAndError
                isLoading={isStatisticLoading}
                isError={isStatisticError}
              />
            </View>
          </View>
        ) : (
          <View style={styles.statisticContainer}>
            <CaloriesStatisticSection
              foodData={food}
              categories={categoryList}
              activities={activityList}
              currentProfile={currentProfile}
              isStatisticToday={isStatisticToday}
            />
            {isStatisticExpanded && (
              <View style={styles.fullWidth}>
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
              </View>
            )}
            <ToggleStatisticSection
              initialValue={!isStatisticToday}
              onChange={() => setStatisticToday(!isStatisticToday)}
            />
          </View>
        )}
      </Section>

      {/* MEALS */}
      {isLoadingMeals || isErrorMeals ? (
        <View style={styles.placeholder}>
          <LoadingAndError isLoading={isLoadingMeals} isError={isErrorMeals} />
        </View>
      ) : (
        <View style={styles.fullWidth}>
          {mealList.map((meal, index) => (
            <View key={meal._id} style={styles.mealSpacing}>
              <MealCard
                meal={meal}
                index={index + 1}
                mealsCount={mealList.length}
              />
            </View>
          ))}
        </View>
      )}

      {/* ACTIVITIES */}
      <Section
        title="ACTIVITIES"
        expanded={isActivitiesExpanded}
        onToggle={() => setActivitiesExpanded(!isActivitiesExpanded)}
        onAdd={() => {
          if (isActivitiesExpanded) {
            setShowActivityDialog(true);
          } else {
            setActivitiesExpanded(true);
          }
        }}
      >
        {isLoadingActivities || isErrorActivities ? (
          <View style={styles.fullWidth}>
            <View style={styles.placeholder}>
              <LoadingAndError
                isLoading={isLoadingActivities}
                isError={isErrorActivities}
              />
            </View>
          </View>
        ) : (
          <View style={styles.fullWidth}>
            {isActivitiesExpanded && activityList.length > 0 ? (
              activityList.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <View style={styles.placeholder}>
                <Asset
                  imageName={
                    isActivitiesExpanded
                      ? 'no_activities_placeholder.png'
                      : 'more_green.svg'
                  }
                  width={isActivitiesExpanded ? 200 : 30}
                  height={isActivitiesExpanded ? 170 : 10}
                />
              </View>
            )}
          </View>
        )}
      </Section>

      <AddActivityDialog
        visible={showActivityDialog}
        onDismiss={() => setShowActivityDialog(false)}
        selectedDate={currentDate}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  statisticSection: {
    marginTop: 15,
    marginBottom: 10,
  },
  // Home.css.js statisticContainerStyle
  statisticContainer: {
    flexDirection: 'column',
    width: '90%',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  placeholder: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  mealSpacing: {
    marginBottom: 10,
  },
});

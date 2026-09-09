/**
 * Profile Screen — port of the web app's Profile.page.js + ProfileForm.
 *
 * The avatar, name and age badge, the pet's details (name, breed, activity
 * level, weight, birthday, breed size, deduct-calories), and the Food Ratio
 * panel with the recommended-calorie rows, the preset picker, the daily ratio
 * and portion, the diet pie chart and the category rows.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RootStackScreenProps } from '@navigation/types';
import { useProfile } from '@contexts/ProfileContext';
import {
  useUpdateProfile,
  useGetAllFoodCategories,
  useAddFoodCategory,
  useDeleteFoodCategory,
  useUpdateFoodCategory,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import { HuppyButton } from '@components/ui/Buttons';
import {
  TitleAndDropdown,
  TitleAndTextField,
  TitleAndToggle,
  TitleAndDatePicker,
  TitleButtonsAndTextField,
  TitleTooltipAndValue,
  TitleToggleAndButtons,
} from '@components/ui/FormRows';
import Avatar from '@components/Avatar';
import ChartPie from '@components/ChartPie';
import {
  DogActivityType,
  getDogActivityTitle,
  BreedSize,
  getBreedSizeTitle,
  RatioPresets,
  getRatioPresetsTitle,
  getAllFoodCategories,
  getCategoriesForRatioPreset,
  calculateBaseRER,
  calculateRER,
} from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import type { FoodCategory, Profile } from '../../types';

// Reached from the NavBar avatar drawer, as on the web.
type Props = RootStackScreenProps<'Profile'>;

// Constants.helper.js: estimated calories per 1kg of dog weight.
const EST_CALORIES = 18.59;

const RECOMMENDED_TIP =
  'Pets’ energy (Calorie) needs to maintain a healthy weight for their life stage depends upon several factors. First, the energy to perform essential body functions like digestion, respiration, heart functions, brain functions, etc. Resting Energy Requirements (or RER), which can be calculated by multiplying the animal’s body weight in kilograms raised to the ¾ power by 70, for example, a 10kg (22lb) adult neutered dog of healthy weight needs RER = 70(10kg)3/4 ≈ 400 Calories/day.';

const activityOptions = Object.values(DogActivityType).map((type) => ({
  rawValue: type,
  title: getDogActivityTitle(type),
}));

const sizeOptions = Object.values(BreedSize).map((type) => ({
  rawValue: type,
  title: getBreedSizeTitle(type),
}));

const presetOptions = Object.values(RatioPresets).map((type) => ({
  rawValue: type,
  title: getRatioPresetsTitle(type),
}));

/** Years / months / days between the date of birth and today. */
const getAgeComponents = (dob?: Date | string) => {
  const dobDate = new Date(dob ?? '');
  if (isNaN(dobDate.getTime())) return null;

  const days = Math.round(
    (Date.now() - dobDate.getTime()) / (24 * 60 * 60 * 1000)
  );
  return {
    year: Math.floor(days / 365),
    month: Math.floor((days % 365) / 30),
    day: days % 30,
  };
};

/** The age badge text. */
const getAge = (dob?: Date | string): string => {
  const dobDate = new Date(dob ?? '');
  if (isNaN(dobDate.getTime())) return '';

  const diff = Date.now() - dobDate.getTime();
  const msInDay = 24 * 60 * 60 * 1000;
  const msInMonth = 30 * msInDay;
  const msInYear = 365 * msInDay;

  const years = Math.floor(diff / msInYear);
  const months = Math.floor((diff % msInYear) / msInMonth);
  const days = Math.floor((diff % msInMonth) / msInDay);

  if (years > 0) {
    return months > 0 ? `${years} years ${months} months` : `${years} years`;
  }
  if (months > 0) {
    return days > 0 ? `${months} months ${days} days` : `${months} months`;
  }
  return `${days} days`;
};

export default function ProfileScreen({ navigation }: Props) {
  const { currentProfile } = useProfile();
  const { mutate: updateProfileMutation } = useUpdateProfile();
  const { mutate: addFoodCategory } = useAddFoodCategory();
  const { mutate: deleteFoodCategory } = useDeleteFoodCategory();
  const { mutate: updateFoodCategory } = useUpdateFoodCategory();

  const [profile, setProfile] = useState<Profile | null>(currentProfile);
  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);

  useEffect(() => {
    if (currentProfile) setProfile(currentProfile);
  }, [currentProfile]);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetAllFoodCategories(profile?._id || '');

  const categoryList: FoodCategory[] = categories ?? [];

  const updateProfile = (
    name: string,
    value: unknown,
    dataUpdated?: Record<string, unknown>
  ) => {
    if (!profile) return;
    const updateData = dataUpdated ?? { [name]: value };
    setProfile({ ...profile, ...(updateData as object) } as Profile);
    updateProfileMutation({ profileId: profile._id, updateData });
  };

  /** Portion weight from the daily ratio (% of body weight, in grams). */
  const getPortionWeight = (dailyRatio: number, weight: number) =>
    Math.round(weight * (dailyRatio / 100) * 1000);

  const getEstCalories = () =>
    Math.floor(EST_CALORIES * (profile?.weight ?? 0) * (profile?.dailyRatio ?? 0));

  /** Puppies get a multiple of the base RER; adults the activity-scaled one. */
  const calculateRecommendedCalories = () => {
    const months = getAgeComponents(profile?.dob)?.month ?? 1;
    if (months < 4) return Math.floor(calculateBaseRER(profile?.weight ?? 0) * 3);
    if (months < 12) return Math.floor(calculateBaseRER(profile?.weight ?? 0) * 2);
    return Math.floor(
      calculateRER(profile?.weight ?? 0, profile?.activityType ?? '')
    );
  };

  const isAdultDog = () => {
    const components = getAgeComponents(profile?.dob);
    return (components?.month ?? 1) === 12 || (components?.year ?? 0) >= 1;
  };

  const unusedCategoryPercentage =
    categoryList.length > 0
      ? 100 - categoryList.reduce((total, c) => total + c.percentage, 0)
      : 0;

  /** Preset ratios drive the chart unless the profile uses custom categories. */
  const getChartData = () => {
    const source =
      categoryList.length > 0 && profile?.preset !== RatioPresets.CUSTOM
        ? getCategoriesForRatioPreset(
            profile?.dailyPortion ?? 0,
            profile?._id ?? '',
            profile?.preset ?? ''
          )
        : categoryList;

    return source.map((category) => ({
      name: category.name,
      weight: category.weight,
      percentage: category.percentage,
      color: category.color,
    }));
  };

  const categoriesCanBeAdded = (() => {
    const all = getAllFoodCategories(profile?._id);
    if (categoryList.length > 0 && profile?.preset === RatioPresets.CUSTOM) {
      return all.filter(
        (category) =>
          !categoryList.some((existing) => existing.index === category.index)
      );
    }
    return all;
  })();

  const isChartDataAvailable = getChartData().some((c) => c.percentage > 0);

  if (!profile) {
    return (
      <PageContainer>
        <LoadingAndError isLoading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top navigation */}
      <View style={styles.backButtonContainer}>
        <HuppyButton
          variant="backButton"
          imageName="arrow_left_green.svg"
          imageSize={20}
          onPress={() => navigation.goBack()}
        >
          Back
        </HuppyButton>
        <Text style={styles.profileTitle}>Profile</Text>
        <View style={styles.topSpacer} />
      </View>

      {/* Avatar */}
      <View style={styles.imageContainer}>
        <Avatar profile={profile} width={150} />
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.age}>{getAge(profile.dob)}</Text>

      <View style={styles.form}>
        <TitleAndTextField
          title="Name"
          initialValue={profile.name}
          placeholder="Enter name"
          onChange={(value) => updateProfile('name', value)}
        />
        <TitleAndTextField
          title="Breed"
          initialValue={profile.breed}
          placeholder="Enter breed"
          onChange={(value) => updateProfile('breed', value)}
        />

        {isAdultDog() && (
          <TitleAndDropdown
            title="Activity level"
            initialValue={profile.activityType}
            dropdownOptions={activityOptions}
            onChange={(value) => updateProfile('activityType', value)}
          />
        )}

        <TitleButtonsAndTextField
          title="Weight, kg"
          initialValue={profile.weight}
          onChange={(value) => updateProfile('weight', value)}
          onChangeButton={(value) =>
            // Changing weight recomputes the daily portion.
            updateProfile('', '', {
              weight: value,
              dailyPortion: getPortionWeight(profile.dailyRatio, value),
            })
          }
        />

        <TitleAndDatePicker
          title="Birthday"
          value={new Date(profile.dob)}
          onChange={(date) => updateProfile('dob', date)}
        />

        <TitleAndDropdown
          title="Breed size"
          initialValue={profile.size}
          dropdownOptions={sizeOptions}
          onChange={(value) => updateProfile('size', value)}
        />

        <TitleAndToggle
          title="Deduct calories from activities"
          initialValue={profile.deductCalories}
          onChange={(value) => updateProfile('deductCalories', value)}
        />

        {/* Food ratio */}
        <View style={styles.foodRatioContainer}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
          >
            <Text style={styles.sectionTitle}>Food Ratio</Text>
            <Asset
              imageName={
                isFoodRatioExpanded
                  ? 'arrow_down_green.svg'
                  : 'arrow_right_green.svg'
              }
              width={20}
              height={20}
              style={styles.sectionImage}
            />
          </Pressable>

          {isFoodRatioExpanded && (
            <View style={styles.foodRatioExpanded}>
              <TitleTooltipAndValue
                title="Recommended calories, kcal"
                tipText={RECOMMENDED_TIP}
                value={calculateRecommendedCalories()}
              />

              {profile.isRatioSelected && (
                <TitleTooltipAndValue
                  title="Estimated daily calories, kcal"
                  tipText="Estimated daily calories is calculated based on pet's weight and selected daily ratio"
                  value={getEstCalories()}
                />
              )}

              <TitleAndDropdown
                title="Ratio preset"
                initialValue={profile.preset}
                dropdownOptions={presetOptions}
                onChange={(value) => updateProfile('preset', value)}
              />

              <TitleToggleAndButtons
                title="Daily ratio from body weight"
                toggleValue={profile.isRatioSelected}
                value={profile.dailyRatio}
                maxCountValue={100}
                onChangeToggle={(value) =>
                  value
                    ? updateProfile('', '', {
                        isRatioSelected: value,
                        dailyPortion: getPortionWeight(
                          profile.dailyRatio,
                          profile.weight
                        ),
                      })
                    : updateProfile('isRatioSelected', value)
                }
                onChangeValue={(value) =>
                  profile.isRatioSelected
                    ? updateProfile('', '', {
                        dailyRatio: value,
                        dailyPortion: getPortionWeight(value, profile.weight),
                      })
                    : updateProfile('dailyRatio', value)
                }
              />

              {profile.isRatioSelected ? (
                <TitleTooltipAndValue
                  title="Daily portion, g"
                  tipText="Calculated based on selected daily ratio"
                  value={profile.dailyPortion}
                />
              ) : (
                <TitleButtonsAndTextField
                  title="Daily portion, g"
                  initialValue={profile.dailyPortion}
                  onChange={(value) => updateProfile('dailyPortion', value)}
                  onChangeButton={(value) =>
                    updateProfile('dailyPortion', value)
                  }
                />
              )}

              {/* Categories */}
              {isLoadingCategories || isErrorCategories ? (
                <LoadingAndError
                  isLoading={isLoadingCategories}
                  isError={isErrorCategories}
                />
              ) : (
                <View>
                  <View style={styles.chartContainer}>
                    {isChartDataAvailable ? (
                      <View>
                        {unusedCategoryPercentage > 0 && (
                          <Text style={styles.unusedCaloriesReminder}>
                            You have {unusedCategoryPercentage}% unused!
                          </Text>
                        )}
                        <ChartPie data={getChartData()} />
                      </View>
                    ) : (
                      <Asset
                        imageName={
                          getChartData().length > 0
                            ? 'no_percentage_placeholder.png'
                            : 'no_chart_placeholder.png'
                        }
                        width={190}
                        height={200}
                        onPress={() =>
                          setFoodRatioExpanded(!isFoodRatioExpanded)
                        }
                      />
                    )}
                  </View>

                  {/* Selected categories */}
                  <View style={styles.selectedCategoriesContainer}>
                    {categoryList.map((category) => {
                      const weight = Math.floor(
                        (profile.dailyPortion * category.percentage) / 100
                      );
                      const isCustom = profile.preset === RatioPresets.CUSTOM;

                      return (
                        <View key={category.type} style={styles.categoryRow}>
                          <Text
                            style={[
                              styles.categoryName,
                              { backgroundColor: category.color },
                            ]}
                          >
                            {category.name}
                          </Text>
                          <Text style={styles.categoryValue}>{weight} g</Text>
                          {isCustom ? (
                            <View style={styles.categoryControls}>
                              <HuppyButton
                                variant="circleTextButtonSmall"
                                onPress={() =>
                                  updateFoodCategory({
                                    categoryId: category._id,
                                    updateData: {
                                      percentage: Math.max(
                                        category.percentage - 1,
                                        0
                                      ),
                                      weight,
                                    },
                                  })
                                }
                              >
                                -
                              </HuppyButton>
                              <Text style={styles.categoryValue}>
                                {category.percentage}%
                              </Text>
                              <HuppyButton
                                variant="circleTextButtonSmall"
                                onPress={() =>
                                  updateFoodCategory({
                                    categoryId: category._id,
                                    updateData: {
                                      percentage: category.percentage + 1,
                                      weight,
                                    },
                                  })
                                }
                              >
                                +
                              </HuppyButton>
                              <Asset
                                imageName="delete_green.svg"
                                width={20}
                                height={20}
                                onPress={() => deleteFoodCategory(category._id)}
                              />
                            </View>
                          ) : (
                            <Text style={styles.categoryValue}>
                              {category.percentage}%
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* Add more categories */}
                  {categoriesCanBeAdded.length > 0 && (
                    <View style={styles.foodRatioContainer}>
                      <Pressable
                        style={styles.sectionHeader}
                        onPress={() =>
                          setFoodCategoryExpanded(!isFoodCategoryExpanded)
                        }
                      >
                        <Text style={styles.sectionTitle}>
                          {isFoodCategoryExpanded
                            ? 'Hide categoties'
                            : 'Add more food categories'}
                        </Text>
                        <Asset
                          imageName={
                            isFoodCategoryExpanded
                              ? 'arrow_down_green.svg'
                              : 'arrow_right_green.svg'
                          }
                          width={20}
                          height={20}
                          style={styles.sectionImage}
                        />
                      </Pressable>

                      {isFoodCategoryExpanded && (
                        <View style={styles.unselectedCategoriesContainer}>
                          <View style={styles.unselectedFoodCategory}>
                            {categoriesCanBeAdded.map((category) => (
                              <Pressable
                                key={category.name}
                                style={styles.unselectedRow}
                                onPress={() =>
                                  addFoodCategory({
                                    ...category,
                                    profileId: profile._id,
                                  } as any)
                                }
                              >
                                <Text
                                  style={[
                                    styles.categoryName,
                                    { backgroundColor: category.color },
                                  ]}
                                >
                                  {category.name}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  topSpacer: {
    width: 100,
  },
  profileTitle: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  name: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 22,
    fontFamily: fontFamily.bold,
  },
  age: {
    textAlign: 'center',
    color: colors.black,
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    padding: 5,
    width: '50%',
    marginVertical: 10,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    overflow: 'hidden',
  },
  form: {
    width: '100%',
  },
  foodRatioContainer: {
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 3,
    backgroundColor: colors.lightBrown,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    flex: 1,
    margin: 15,
    textAlign: 'center',
    color: colors.lightGreen,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  sectionImage: {
    marginRight: 15,
  },
  foodRatioExpanded: {
    width: '90%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  unusedCaloriesReminder: {
    textAlign: 'center',
    borderRadius: 10,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.orange,
  },
  selectedCategoriesContainer: {
    margin: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: 35,
  },
  categoryName: {
    width: 100,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.white,
    textAlign: 'center',
    overflow: 'hidden',
  },
  categoryValue: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginHorizontal: 5,
  },
  categoryControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unselectedCategoriesContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  unselectedFoodCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  unselectedRow: {
    margin: 3,
  },
});

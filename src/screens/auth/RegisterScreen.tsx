/**
 * Register Screen — port of the web app's Register.page.js + RegisterForm.
 *
 * The same layout as Profile, but filling in a new pet: avatar, name, age,
 * details and the Food Ratio panel, with a SAVE button that stays disabled
 * until the pet has a name and the ratios add up to 100%.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useAddProfile, useAddFoodCategory } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, ImageCircle } from '@components/ui/Asset';
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
  PresetCategory,
} from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

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

const getAge = (dob?: Date | string): string => {
  const components = getAgeComponents(dob);
  if (!components) return '';
  const { year, month, day } = components;
  if (year > 0) return month > 0 ? `${year} years ${month} months` : `${year} years`;
  if (month > 0) return day > 0 ? `${month} months ${day} days` : `${month} months`;
  return `${day} days`;
};

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { profiles } = useProfile();
  const { mutate: addProfile } = useAddProfile();
  const { mutate: addFoodCategory } = useAddFoodCategory();

  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  const [customFoodCategories, setCustomFoodCategories] = useState<
    PresetCategory[]
  >([]);

  // The web's prefilled new-profile state.
  const [profile, setProfile] = useState<any>({
    _id: '',
    name: '',
    activityType: 'active',
    avatar: '',
    breed: '',
    categories: [],
    dailyPortion: 250,
    dailyRatio: 5,
    weight: 5,
    deductCalories: false,
    dob: new Date().toISOString(),
    isCurrent: !(profiles && profiles.length > 0),
    preset: 'barfAdult',
    size: 'small',
    userId: user?.id || '',
    isRatioSelected: false,
  });

  const getPortionWeight = (dailyRatio: number, weight: number) =>
    Math.round(weight * (dailyRatio / 100) * 1000);

  const getEstCalories = () =>
    Math.floor(EST_CALORIES * profile.weight * profile.dailyRatio);

  const calculateRecommendedCalories = () => {
    const months = getAgeComponents(profile.dob)?.month ?? 1;
    if (months < 4) return Math.floor(calculateBaseRER(profile.weight) * 3);
    if (months < 12) return Math.floor(calculateBaseRER(profile.weight) * 2);
    return Math.floor(calculateRER(profile.weight, profile.activityType));
  };

  const isAdultDog = () => {
    const components = getAgeComponents(profile.dob);
    return (components?.month ?? 1) === 12 || (components?.year ?? 0) >= 1;
  };

  const isCustomPreset = profile.preset === RatioPresets.CUSTOM;

  const categories: PresetCategory[] = isCustomPreset
    ? customFoodCategories
    : getCategoriesForRatioPreset(profile.dailyPortion, profile._id, profile.preset);

  const unusedCategoryPercentage =
    categories.length > 0
      ? 100 - categories.reduce((total, c) => total + c.percentage, 0)
      : 0;

  const categoriesCanBeAdded = isCustomPreset
    ? getAllFoodCategories(profile._id).filter(
        (category) =>
          !customFoodCategories.some((existing) => existing.index === category.index)
      )
    : [];

  const chartData = categories.map((category) => ({
    name: category.name,
    weight: category.weight,
    percentage: category.percentage,
    color: category.color,
  }));

  const isChartDataAvailable = chartData.some((c) => c.percentage > 0);

  // SAVE unlocks once the pet is named and the ratios add up.
  const isFormCompleted =
    profile.name.length > 1 && unusedCategoryPercentage === 0;

  const saveProfile = () => {
    addProfile(profile, {
      onSuccess: (data: any) => {
        const profileNew = data;
        if (profileNew?.preset === RatioPresets.CUSTOM) {
          customFoodCategories.forEach((category) =>
            addFoodCategory({
              ...category,
              profileId: profileNew._id,
            } as any)
          );
        }
        navigation.navigate('Main');
      },
    });
  };

  const updateCategoryPercentage = (type: string, value: number) => {
    setCustomFoodCategories((prev) =>
      prev.map((category) =>
        category.type === type
          ? {
              ...category,
              percentage: value || 0,
              weight: Math.floor((profile.dailyPortion * value) / 100),
            }
          : category
      )
    );
  };

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
        <Text style={styles.profileTitle}>Create Profile</Text>
        <View style={styles.topSpacer} />
      </View>

      {/* Avatar */}
      <View style={styles.imageContainer}>
        <ImageCircle imageName="avatar_placeholder.png" width={150} />
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.age}>{getAge(profile.dob)}</Text>

      <View style={styles.form}>
        <TitleAndTextField
          title="Name"
          initialValue={profile.name}
          placeholder="Enter name"
          onChange={(value) => setProfile({ ...profile, name: value })}
        />
        <TitleAndTextField
          title="Breed"
          initialValue={profile.breed}
          placeholder="Enter breed"
          onChange={(value) => setProfile({ ...profile, breed: value })}
        />

        {isAdultDog() && (
          <TitleAndDropdown
            title="Activity level"
            initialValue={profile.activityType}
            dropdownOptions={activityOptions}
            onChange={(value) => setProfile({ ...profile, activityType: value })}
          />
        )}

        <TitleButtonsAndTextField
          title="Weight, kg"
          initialValue={profile.weight}
          onChange={(value) => setProfile({ ...profile, weight: value })}
          onChangeButton={(value) =>
            setProfile({
              ...profile,
              weight: value,
              dailyPortion: getPortionWeight(profile.dailyRatio, value),
            })
          }
        />

        <TitleAndDatePicker
          title="Birthday"
          value={new Date(profile.dob)}
          onChange={(date) => setProfile({ ...profile, dob: date.toISOString() })}
        />

        <TitleAndDropdown
          title="Breed size"
          initialValue={profile.size}
          dropdownOptions={sizeOptions}
          onChange={(value) => setProfile({ ...profile, size: value })}
        />

        <TitleAndToggle
          title="Deduct calories from activities"
          initialValue={profile.deductCalories}
          onChange={(value) => setProfile({ ...profile, deductCalories: value })}
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
                title="Food ratio preset"
                initialValue={profile.preset}
                dropdownOptions={presetOptions}
                onChange={(value) => setProfile({ ...profile, preset: value })}
              />

              <TitleToggleAndButtons
                title="Daily ratio from body weight"
                toggleValue={profile.isRatioSelected}
                value={profile.dailyRatio}
                maxCountValue={100}
                onChangeToggle={(value) =>
                  setProfile({
                    ...profile,
                    isRatioSelected: value,
                    ...(value
                      ? {
                          dailyPortion: getPortionWeight(
                            profile.dailyRatio,
                            profile.weight
                          ),
                        }
                      : {}),
                  })
                }
                onChangeValue={(value) =>
                  setProfile({
                    ...profile,
                    dailyRatio: value,
                    ...(profile.isRatioSelected
                      ? { dailyPortion: getPortionWeight(value, profile.weight) }
                      : {}),
                  })
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
                  onChange={(value) =>
                    setProfile({ ...profile, dailyPortion: value })
                  }
                  onChangeButton={(value) =>
                    setProfile({ ...profile, dailyPortion: value })
                  }
                />
              )}

              {/* Chart */}
              <View style={styles.chartContainer}>
                {isChartDataAvailable ? (
                  <View style={styles.chartContainer}>
                    <ChartPie data={chartData} />
                    {unusedCategoryPercentage > 0 && (
                      <Text style={styles.unusedCaloriesReminder}>
                        You have {unusedCategoryPercentage}% unused!
                      </Text>
                    )}
                  </View>
                ) : (
                  <Asset
                    imageName={
                      chartData.length > 0
                        ? 'no_percentage_placeholder.png'
                        : 'no_chart_placeholder.png'
                    }
                    width={190}
                    height={200}
                    onPress={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
                  />
                )}
              </View>

              {/* Selected categories */}
              <View style={styles.selectedCategoriesContainer}>
                {categories.map((category) => {
                  const weight = Math.floor(
                    (profile.dailyPortion * category.percentage) / 100
                  );

                  return (
                    <View key={category.name} style={styles.categoryRow}>
                      <Text
                        style={[
                          styles.categoryName,
                          { backgroundColor: category.color },
                        ]}
                      >
                        {category.name}
                      </Text>
                      <Text style={styles.categoryValue}>{weight} g</Text>
                      {isCustomPreset ? (
                        <View style={styles.categoryControls}>
                          <HuppyButton
                            variant="circleTextButtonSmall"
                            onPress={() =>
                              updateCategoryPercentage(
                                category.type,
                                Math.max(category.percentage - 1, 0)
                              )
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
                              updateCategoryPercentage(
                                category.type,
                                category.percentage + 1
                              )
                            }
                          >
                            +
                          </HuppyButton>
                          <Asset
                            imageName="delete_green.svg"
                            width={20}
                            height={20}
                            onPress={() =>
                              setCustomFoodCategories((prev) =>
                                prev.filter((c) => c.type !== category.type)
                              )
                            }
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
                              setCustomFoodCategories((prev) => [
                                ...prev,
                                category,
                              ])
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
      </View>

      {/* Save */}
      <View style={styles.saveButtonContainer}>
        <HuppyButton
          variant="addButton"
          width={100}
          imageName="plus_round_fill_white_button.svg"
          imageSize={20}
          onPress={saveProfile}
          disabled={!isFormCompleted}
        >
          SAVE
        </HuppyButton>
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
  saveButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

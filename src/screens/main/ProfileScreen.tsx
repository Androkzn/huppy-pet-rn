/**
 * Profile Screen — the pet, and how its diet is worked out.
 *
 * A portrait header naming the pet, then its details in grouped lists, then the
 * food ratio: the calorie figures, the preset, the daily portion, the balance
 * ring and one row per food category. The heavy part is collapsed by default,
 * so the screen opens on who the pet is rather than on arithmetic.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { Card } from '@components/ios/Card';
import { Icon } from '@components/ios/Icon';
import { IOSButton } from '@components/ios/Button';
import { Label } from '@components/ios/Text';
import { ListRow, ListSection } from '@components/ios/List';
import { Stepper } from '@components/ios/Stepper';
import { Section } from '@components/ui/Section';
import {
  FormGroup,
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
import { ImagePickerDialog } from '@components/dialogs';
import { uploadImageFromUri, deleteImage } from '@services/api/imageApi';
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
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
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
  const { colors } = useAppTheme();
  const { currentProfile } = useProfile();
  const { mutate: updateProfileMutation } = useUpdateProfile();
  const { mutate: addFoodCategory } = useAddFoodCategory();
  const { mutate: deleteFoodCategory } = useDeleteFoodCategory();
  const { mutate: updateFoodCategory } = useUpdateFoodCategory();

  const [profile, setProfile] = useState<Profile | null>(currentProfile);
  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  const [isAvatarDialogOpen, setAvatarDialogOpen] = useState(false);

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

  const isCustomPreset = profile.preset === RatioPresets.CUSTOM;

  return (
    <PageContainer>
      <View style={styles.stack}>
        {/* Who the pet is */}
        <View style={styles.portrait}>
          <Avatar
            profile={profile}
            width={116}
            onPress={() => setAvatarDialogOpen(true)}
          />
          <View style={styles.portraitText}>
            <Label variant="title1" brand numberOfLines={1}>
              {profile.name}
            </Label>
            <Label variant="subheadline" role="secondary">
              {[getAge(profile.dob), profile.breed].filter(Boolean).join(' · ')}
            </Label>
          </View>
          <IOSButton
            title="Change photo"
            variant="tinted"
            size="sm"
            icon="camera"
            onPress={() => setAvatarDialogOpen(true)}
          />
        </View>

        {/* Details */}
        <FormGroup header="Details">
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
          {isAdultDog() ? (
            <TitleAndDropdown
              title="Activity level"
              initialValue={profile.activityType}
              dropdownOptions={activityOptions}
              onChange={(value) => updateProfile('activityType', value)}
            />
          ) : null}
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
        </FormGroup>

        <FormGroup
          header="Calories"
          footer="Activities can offset the day's calorie target."
        >
          <TitleAndToggle
            title="Deduct calories from activities"
            initialValue={profile.deductCalories}
            onChange={(value) => updateProfile('deductCalories', value)}
          />
        </FormGroup>

        {/* Food ratio */}
        <Section
          title="Food ratio"
          expanded={isFoodRatioExpanded}
          onToggle={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
          plain
        >
          <View style={styles.ratioStack}>
            <FormGroup>
              <TitleTooltipAndValue
                title="Recommended calories, kcal"
                tipText={RECOMMENDED_TIP}
                value={calculateRecommendedCalories()}
              />
              {profile.isRatioSelected ? (
                <TitleTooltipAndValue
                  title="Estimated daily calories, kcal"
                  tipText="Estimated daily calories is calculated based on pet's weight and selected daily ratio"
                  value={getEstCalories()}
                />
              ) : null}
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
                  onChangeButton={(value) => updateProfile('dailyPortion', value)}
                />
              )}
            </FormGroup>

            {isLoadingCategories || isErrorCategories ? (
              <View style={styles.centered}>
                <LoadingAndError
                  isLoading={isLoadingCategories}
                  isError={isErrorCategories}
                />
              </View>
            ) : (
              <>
                {/* The balance, as a ring */}
                <Card title="Balance" contentStyle={styles.chartCard}>
                  {isChartDataAvailable ? (
                    <View style={styles.chartBody}>
                      <ChartPie data={getChartData()} size={168} />
                      {unusedCategoryPercentage > 0 ? (
                        <Label variant="footnote" role="tint" weight="600">
                          {`${unusedCategoryPercentage}% of the ratio is unassigned`}
                        </Label>
                      ) : null}
                    </View>
                  ) : (
                    <View style={styles.chartBody}>
                      <Asset
                        imageName={
                          getChartData().length > 0
                            ? 'no_percentage_placeholder.png'
                            : 'no_chart_placeholder.png'
                        }
                        width={170}
                        height={180}
                      />
                      <Label variant="footnote" role="secondary">
                        Give the categories a share to see the balance.
                      </Label>
                    </View>
                  )}
                </Card>

                {/* One row per category */}
                <ListSection header="Categories">
                  {categoryList.map((category) => {
                    const weight = Math.floor(
                      (profile.dailyPortion * category.percentage) / 100
                    );

                    return (
                      <ListRow
                        key={category.type}
                        title={category.name}
                        subtitle={`${weight} g · ${category.percentage}%`}
                        chevron={false}
                        leading={
                          <View
                            style={[
                              styles.categoryDot,
                              { backgroundColor: category.color },
                            ]}
                          />
                        }
                        trailing={
                          isCustomPreset ? (
                            <View style={styles.categoryControls}>
                              <Stepper
                                value={category.percentage}
                                min={0}
                                max={100}
                                compact
                                onChange={(percentage) =>
                                  updateFoodCategory({
                                    categoryId: category._id,
                                    updateData: { percentage, weight },
                                  })
                                }
                              />
                              <IOSButton
                                variant="plain"
                                size="sm"
                                icon="trash"
                                accessibilityLabel={`Remove ${category.name}`}
                                onPress={() => {
                                  haptics.warning();
                                  deleteFoodCategory(category._id);
                                }}
                              />
                            </View>
                          ) : undefined
                        }
                      />
                    );
                  })}
                </ListSection>

                {/* Categories that can still be added */}
                {categoriesCanBeAdded.length > 0 ? (
                  <Section
                    title="Add a category"
                    expanded={isFoodCategoryExpanded}
                    onToggle={() =>
                      setFoodCategoryExpanded(!isFoodCategoryExpanded)
                    }
                  >
                    {categoriesCanBeAdded.map((category) => (
                      <ListRow
                        key={category.name}
                        title={category.name}
                        leading={
                          <View
                            style={[
                              styles.categoryDot,
                              { backgroundColor: category.color },
                            ]}
                          />
                        }
                        trailing={
                          <Icon
                            name="plus.circle.fill"
                            size={20}
                            color={colors.tint}
                          />
                        }
                        chevron={false}
                        onPress={() => {
                          haptics.light();
                          addFoodCategory({
                            ...category,
                            profileId: profile._id,
                          } as any);
                        }}
                      />
                    ))}
                  </Section>
                ) : null}
              </>
            )}
          </View>
        </Section>
      </View>

      <ImagePickerDialog
        visible={isAvatarDialogOpen}
        placeholderName="avatar_placeholder.png"
        emptyTitle="Add avatar"
        onSave={(uri) => {
          // `avatar` is stamped with the upload time so the URL re-fetches.
          uploadImageFromUri(uri, 'avatar', profile._id);
          updateProfile('avatar', new Date().toISOString());
          setAvatarDialogOpen(false);
        }}
        onDelete={() => {
          deleteImage('avatar', profile._id);
          updateProfile('avatar', '');
          setAvatarDialogOpen(false);
        }}
        onClose={() => setAvatarDialogOpen(false)}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.xl,
  },
  portrait: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
  },
  portraitText: {
    alignItems: 'center',
    gap: 2,
  },
  ratioStack: {
    gap: spacing.lg,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  chartCard: {
    alignItems: 'center',
  },
  chartBody: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: radius.capsule,
  },
  categoryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

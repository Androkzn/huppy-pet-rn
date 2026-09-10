/**
 * Register Screen — setting up a new pet.
 *
 * The same shape as the profile screen: a portrait, the pet's details, and the
 * food ratio worked out underneath. Saving is only possible once the pet has a
 * name and the ratio adds up to 100%, and the button says so.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useAddProfile, useAddFoodCategory } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, ImageCircle } from '@components/ui/Asset';
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
import ChartPie from '@components/ChartPie';
import { ImagePickerDialog } from '@components/dialogs';
import { uploadImageFromUri } from '@services/api/imageApi';
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
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';

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
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { profiles } = useProfile();
  const { mutate: addProfile } = useAddProfile();
  const { mutate: addFoodCategory } = useAddFoodCategory();

  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  const [isAvatarDialogOpen, setAvatarDialogOpen] = useState(false);
  // Picked before the profile exists; uploaded once it has an id.
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
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

        // Web: uploadAvatar runs once the new profile has an id.
        if (avatarUri && profileNew?._id) {
          uploadImageFromUri(avatarUri, 'avatar', profileNew._id);
        }

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
      <View style={styles.stack}>
        {/* The pet */}
        <View style={styles.portrait}>
          <ImageCircle
            imageName="avatar_placeholder.png"
            width={116}
            imageDataUrl={avatarUri}
            borderColor={colors.tintSoft}
            borderWidth={4}
            onPress={() => setAvatarDialogOpen(true)}
          />
          <View style={styles.portraitText}>
            <Label variant="title1" brand numberOfLines={1}>
              {profile.name || 'New pet'}
            </Label>
            <Label variant="subheadline" role="secondary">
              {getAge(profile.dob)}
            </Label>
          </View>
          <IOSButton
            title={avatarUri ? 'Change photo' : 'Add photo'}
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
            onChange={(value) => setProfile({ ...profile, name: value })}
          />
          <TitleAndTextField
            title="Breed"
            initialValue={profile.breed}
            placeholder="Enter breed"
            onChange={(value) => setProfile({ ...profile, breed: value })}
          />
          <TitleAndDatePicker
            title="Birthday"
            value={new Date(profile.dob)}
            onChange={(date) =>
              setProfile({ ...profile, dob: date.toISOString() })
            }
          />
          <TitleAndDropdown
            title="Breed size"
            initialValue={profile.size}
            dropdownOptions={sizeOptions}
            onChange={(value) => setProfile({ ...profile, size: value })}
          />
          {isAdultDog() ? (
            <TitleAndDropdown
              title="Activity level"
              initialValue={profile.activityType}
              dropdownOptions={activityOptions}
              onChange={(value) =>
                setProfile({ ...profile, activityType: value })
              }
            />
          ) : null}
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
        </FormGroup>

        <FormGroup header="Calories">
          <TitleAndToggle
            title="Deduct calories from activities"
            initialValue={profile.deductCalories}
            onChange={(value) =>
              setProfile({ ...profile, deductCalories: value })
            }
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
            </FormGroup>

            {/* The balance, as a ring */}
            <Card title="Balance" contentStyle={styles.chartCard}>
              {isChartDataAvailable ? (
                <View style={styles.chartBody}>
                  <ChartPie data={chartData} size={168} />
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
                      chartData.length > 0
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

            {/* Chosen categories */}
            <ListSection header="Categories">
              {categories.map((category) => {
                const weight = Math.floor(
                  (profile.dailyPortion * category.percentage) / 100
                );

                return (
                  <ListRow
                    key={category.name}
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
                              updateCategoryPercentage(category.type, percentage)
                            }
                          />
                          <IOSButton
                            variant="plain"
                            size="sm"
                            icon="trash"
                            accessibilityLabel={`Remove ${category.name}`}
                            onPress={() => {
                              haptics.warning();
                              setCustomFoodCategories((prev) =>
                                prev.filter((c) => c.type !== category.type)
                              );
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
                onToggle={() => setFoodCategoryExpanded(!isFoodCategoryExpanded)}
              >
                {categoriesCanBeAdded.map((category) => (
                  <ListRow
                    key={category.name}
                    title={category.name}
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
                      <Icon name="plus.circle.fill" size={20} color={colors.tint} />
                    }
                    onPress={() => {
                      haptics.light();
                      setCustomFoodCategories((prev) => [...prev, category]);
                    }}
                  />
                ))}
              </Section>
            ) : null}
          </View>
        </Section>

        <View style={styles.action}>
          <IOSButton
            title="Save profile"
            variant="prominent"
            size="lg"
            fullWidth
            haptic="medium"
            onPress={saveProfile}
            disabled={!isFormCompleted}
          />
          {!isFormCompleted ? (
            <Label variant="footnote" role="secondary" style={styles.actionHint}>
              Add a name and make the ratio add up to 100% to save.
            </Label>
          ) : null}
        </View>
      </View>

      <ImagePickerDialog
        visible={isAvatarDialogOpen}
        imageUri={avatarUri}
        placeholderName="avatar_placeholder.png"
        emptyTitle="Add avatar"
        onSave={(uri) => {
          setAvatarUri(uri);
          setProfile({ ...profile, avatar: new Date().toISOString() });
          setAvatarDialogOpen(false);
        }}
        onDelete={() => {
          setAvatarUri(null);
          setProfile({ ...profile, avatar: '' });
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
    paddingTop: spacing.sm,
  },
  portraitText: {
    alignItems: 'center',
    gap: 2,
  },
  ratioStack: {
    gap: spacing.lg,
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
  action: {
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
  },
  actionHint: {
    textAlign: 'center',
  },
});

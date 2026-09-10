/**
 * Search Food Screen — finding what to add to a meal.
 *
 * A search field under a segmented filter, and the results as a grouped list.
 * Under the Category filter the field gives way to a category picker, since
 * there is nothing to type. Empty states say which of the two situations the
 * screen is in: nothing searched for yet, or nothing found.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useSearchForFood,
  useGetAllCustomFoodTemplates,
  useGetAllFoodTemplatesForCategory,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import { Dropdown } from '@components/ui/Dropdown';
import { CustomAlert } from '@components/ui/CustomAlert';
import { EmptyState } from '@components/ios/Feedback';
import { IOSButton } from '@components/ios/Button';
import { ListSection } from '@components/ios/List';
import { SegmentedControl } from '@components/ios/SegmentedControl';
import { TextField } from '@components/ios/TextField';
import FoodCard from '@components/FoodCard';
import { FilterFood, FoodCategoryType, AlertType } from '@constants/enums';
import { layout, spacing } from '@theme/tokens';
import type { FoodTemplate } from '../../types';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'SearchFood'>;

const categoryOptions = Object.values(FoodCategoryType).map((type) => ({
  rawValue: type,
  title: String(type).charAt(0).toUpperCase() + String(type).slice(1),
}));

export default function SearchFoodScreen({ navigation, route }: Props) {
  const { mealId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('meat');
  const [selectedFilter, setSelectedFilter] = useState<string>(FilterFood.ALL);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType] = useState<string>(AlertType.SUCCESS);

  const isCategoryFilter = selectedFilter === FilterFood.CATEGORY;
  const isCustomFilter = selectedFilter === FilterFood.CUSTOM;
  const isRecipeFilter = selectedFilter === FilterFood.RECIPE;

  const { data: byName, isLoading: isLoadingSearch, isError: isErrorSearch } =
    useSearchForFood(searchQuery, !isCategoryFilter && !isCustomFilter);
  const { data: byCategory } = useGetAllFoodTemplatesForCategory(
    isCategoryFilter ? selectedCategory : ''
  );
  const { data: customTemplates } = useGetAllCustomFoodTemplates();

  const searchResult: FoodTemplate[] = (() => {
    if (isCategoryFilter) return byCategory ?? [];
    if (isCustomFilter) return customTemplates ?? [];
    if (isRecipeFilter) {
      return (byName ?? []).filter((item: FoodTemplate) => item.type === 'recipe');
    }
    return byName ?? [];
  })();

  const openAddFoodPage = (foodItem: FoodTemplate) =>
    navigation.navigate('AddFood', { mealId, foodTemplateId: foodItem._id });

  const filterSegments = Object.values(FilterFood).map((filter) => ({
    label: filter,
    value: filter,
  }));

  const hasSearched = searchQuery.length > 0 || selectedFilter !== FilterFood.ALL;

  return (
    <PageContainer
      title="Add food"
      titleAccessory={
        <IOSButton
          title="New food"
          variant="tinted"
          size="sm"
          icon="plus"
          onPress={() => navigation.navigate('CreateNewFood', { mealId })}
        />
      }
    >
      <View style={styles.stack}>
        <SegmentedControl
          segments={filterSegments}
          value={selectedFilter}
          onChange={setSelectedFilter}
          size="sm"
          style={styles.filter}
        />

        <View style={styles.searchRow}>
          {isCategoryFilter ? (
            <Dropdown
              value={selectedCategory}
              label="Category"
              options={categoryOptions}
              onChange={setSelectedCategory}
              style={styles.dropdown}
            />
          ) : (
            <TextField
              search
              placeholder="Search food"
              autoCorrect={false}
              returnKeyType="search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}
        </View>

        {isLoadingSearch || isErrorSearch ? (
          <View style={styles.centered}>
            <LoadingAndError isLoading={isLoadingSearch} isError={isErrorSearch} />
          </View>
        ) : !searchResult || searchResult.length === 0 ? (
          <EmptyState
            symbol={hasSearched ? 'magnifyingglass' : 'fork.knife'}
            title={hasSearched ? 'No matches' : 'Search for a food'}
            message={
              hasSearched
                ? 'Try another name, or create the food yourself.'
                : 'Type a name, or browse by category.'
            }
            actionLabel={hasSearched ? 'Create food' : undefined}
            onAction={
              hasSearched
                ? () => navigation.navigate('CreateNewFood', { mealId })
                : undefined
            }
            illustration={
              <Asset
                imageName={
                  hasSearched
                    ? 'no_results_placeholder.png'
                    : 'start_typing_placeholder.png'
                }
                width={190}
                height={200}
              />
            }
          />
        ) : (
          <ListSection header={`${searchResult.length} results`}>
            {searchResult.map((foodItem, index) => (
              <FoodCard
                key={foodItem._id}
                food={foodItem}
                openAddFoodPage={openAddFoodPage}
                last={index === searchResult.length - 1}
              />
            ))}
          </ListSection>
        )}
      </View>

      <CustomAlert
        message={message}
        type={alertType}
        show={showAlert}
        setAppearance={setShowAlert}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.base,
  },
  filter: {
    marginHorizontal: layout.screenPadding,
  },
  searchRow: {
    paddingHorizontal: layout.screenPadding,
  },
  dropdown: {
    alignSelf: 'flex-start',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});

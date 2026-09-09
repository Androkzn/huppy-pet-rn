/**
 * Search Food Screen — port of the web app's SearchFood.page.js.
 *
 * A Back / Create Food button row, the All | Category | My food | Recipe tabs,
 * the search field (replaced by a category dropdown under the Category tab),
 * and the result list — or the start-typing / no-results artwork.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useSearchForFood,
  useGetAllCustomFoodTemplates,
  useGetAllFoodTemplatesForCategory,
} from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import { HuppyButton } from '@components/ui/Buttons';
import { Dropdown } from '@components/ui/Dropdown';
import FoodCard from '@components/FoodCard';
import { FilterFood, FoodCategoryType } from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
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

  return (
    <PageContainer>
      {/* Back / Create Food */}
      <View style={styles.buttonsContainer}>
        <HuppyButton
          variant="backButton"
          imageName="arrow_left_green.svg"
          imageSize={20}
          onPress={() => navigation.goBack()}
        >
          Back
        </HuppyButton>
        <HuppyButton
          variant="addButton"
          width={150}
          imageName="add_round_orange.svg"
          imageSize={20}
          onPress={() => navigation.navigate('CreateNewFood', { mealId })}
        >
          Create Food
        </HuppyButton>
      </View>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {Object.values(FilterFood).map((filter) => {
          const isSelected = filter === selectedFilter;
          return (
            <Text
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.tab,
                styles.tabLabel,
                isSelected && styles.tabSelected,
                isSelected && styles.tabLabelSelected,
              ]}
            >
              {filter}
            </Text>
          );
        })}
      </View>

      {/* Search field / category dropdown */}
      <View style={styles.searchRow}>
        <Text style={styles.labelTextField}>Search:</Text>
        {isCategoryFilter ? (
          <Dropdown
            value={selectedCategory}
            options={categoryOptions}
            onChange={setSelectedCategory}
            style={styles.dropdown}
          />
        ) : (
          <View style={styles.textFieldContainer}>
            <TextInput
              style={styles.textField}
              placeholder="Enter food name"
              placeholderTextColor={colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Asset
              imageName={
                searchQuery ? 'close_round_green.svg' : 'more_green.svg'
              }
              width={20}
              height={20}
              onPress={searchQuery ? () => setSearchQuery('') : undefined}
            />
          </View>
        )}
      </View>

      {/* Results */}
      {!searchResult || searchResult.length === 0 ? (
        <View style={styles.placeholder}>
          <Asset
            imageName={
              selectedFilter === FilterFood.ALL && searchQuery.length === 0
                ? 'start_typing_placeholder.png'
                : 'no_results_placeholder.png'
            }
            width={200}
            height={250}
          />
        </View>
      ) : (
        <View style={styles.column}>
          {isLoadingSearch || isErrorSearch ? (
            <LoadingAndError
              isLoading={isLoadingSearch}
              isError={isErrorSearch}
            />
          ) : (
            searchResult.map((foodItem) => (
              <FoodCard
                key={foodItem._id}
                food={foodItem}
                openAddFoodPage={openAddFoodPage}
              />
            ))
          )}
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  tabs: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
  },
  tab: {
    flex: 1,
    minWidth: 85,
    textAlign: 'center',
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  labelTextField: {
    padding: 10,
    textAlign: 'left',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.green,
  },
  textFieldContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    maxWidth: 250,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  textField: {
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
    color: colors.green,
    fontFamily: fontFamily.regular,
  },
  dropdown: {
    maxWidth: 300,
    minWidth: 250,
    width: 250,
    height: 40,
    marginRight: 10,
  },
  placeholder: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  column: {
    flexDirection: 'column',
    width: '100%',
  },
});

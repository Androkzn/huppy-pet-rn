/**
 * Search Food Screen
 * Search for food items to add to a meal
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Title, Body, Card, Button, TextInput } from '@components/ui';
import { useSearchForFood } from '@hooks/useGraphQL';
import { useTheme, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'SearchFood'>;

const CATEGORY_OPTIONS = [
  { value: 'meat', label: 'Meat' },
  { value: 'vegetables', label: 'Veggies' },
  { value: 'fruit', label: 'Fruit' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'grains', label: 'Grains' },
  { value: 'other', label: 'Other' },
];

export default function SearchFoodScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { mealId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('meat');

  const { data: searchResults, isLoading } = useSearchForFood(
    searchQuery,
    searchQuery.length > 0
  );

  const handleFoodSelect = (foodTemplate: any) => {
    navigation.navigate('AddFood', {
      mealId,
      foodTemplateId: foodTemplate._id,
    });
  };

  const handleCreateNewFood = () => {
    navigation.navigate('CreateNewFood', { mealId });
  };

  const filteredResults = searchResults?.filter((item: any) => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    const category = item.categoryType || item.type || '';
    return category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for food..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            left={
              <TextInput.Icon
                icon={() => (
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color={theme.colors.onSurfaceVariant}
                  />
                )}
              />
            }
            right={
              searchQuery.length > 0 ? (
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  )}
                  onPress={() => setSearchQuery('')}
                />
              ) : undefined
            }
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORY_OPTIONS.map((category) => (
            <Button
              key={category.value}
              mode={selectedCategory === category.value ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(category.value)}
              style={styles.categoryButton}
              compact
            >
              {category.label}
            </Button>
          ))}
        </ScrollView>

        {/* Create New Food Button */}
        <Button
          mode="outlined"
          onPress={handleCreateNewFood}
          style={styles.createButton}
          icon="plus"
        >
          Create New Food
        </Button>

        {/* Search Results */}
        {searchQuery.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="text-search"
              size={80}
              color={theme.colors.outline}
            />
            <Body style={styles.emptyText}>
              Start typing to search for food
            </Body>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <Body>Loading...</Body>
          </View>
        ) : filteredResults && filteredResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {filteredResults.map((foodTemplate: any) => (
              <TouchableOpacity
                key={foodTemplate._id}
                onPress={() => handleFoodSelect(foodTemplate)}
              >
                <Card style={styles.foodCard}>
                  <Card.Content>
                    <View style={styles.foodCardContent}>
                      <View style={styles.foodInfo}>
                        <Title style={styles.foodName}>{foodTemplate.name}</Title>
                        <Body style={styles.foodCategory}>
                          {foodTemplate.categoryType || foodTemplate.type || 'Other'}
                        </Body>
                      </View>
                      <View style={styles.foodStats}>
                        <Body style={styles.foodCalories}>
                          {foodTemplate.calories || 0} kcal/100g
                        </Body>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="food-off"
              size={80}
              color={theme.colors.outline}
            />
            <Body style={styles.emptyText}>
              No food found matching "{searchQuery}"
            </Body>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 32,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  categoryScroll: {
    marginBottom: 16,
    flexGrow: 0,
  },
  categoryButton: {
    marginRight: 8,
  },
  createButton: {
    marginBottom: 24,
  },
  resultsContainer: {
    gap: 12,
  },
  foodCard: {
    marginBottom: 12,
  },
  foodCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 12,
    opacity: 0.7,
  },
  foodStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodCalories: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});

/**
 * Add Food Screen
 * Add food item to a meal with portion size
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Title, Body, Card, Button, TextInput } from '@components/ui';
import { useAddFood, useGetFoodTemplateById } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'AddFood'>;

export default function AddFoodScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const { mealId, foodTemplateId } = route.params;

  const [weight, setWeight] = useState('100');

  const { mutate: addFood, isLoading } = useAddFood();
  const { data: foodTemplate, isLoading: isLoadingTemplate } = useGetFoodTemplateById(foodTemplateId);

  const calculateNutrition = () => {
    if (!foodTemplate || !weight) {
      return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }

    const weightNum = parseFloat(weight) || 0;
    const multiplier = weightNum / 100;

    return {
      calories: Math.round((foodTemplate.calories || 0) * multiplier),
      protein: Math.round((foodTemplate.protein || 0) * multiplier * 10) / 10,
      fat: Math.round((foodTemplate.fat || 0) * multiplier * 10) / 10,
      carbs: Math.round((foodTemplate.carb || 0) * multiplier * 10) / 10,
    };
  };

  const nutrition = calculateNutrition();

  const handleAddFood = () => {
    if (!currentProfile) {
      Alert.alert('Error', 'No profile selected');
      return;
    }

    if (!foodTemplate) {
      Alert.alert('Error', 'Food template not loaded');
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid portion size');
      return;
    }

    addFood(
      {
        mealId,
        profileId: currentProfile._id,
        userId: currentProfile.userId,
        name: foodTemplate.name,
        categoryType: foodTemplate.categoryType || foodTemplate.type || 'other',
        weight: weightNum,
        calories: nutrition.calories,
        templateId: foodTemplateId,
        bonesRatio: foodTemplate.bonesRatio || 0,
        meatRatio: foodTemplate.meatRatio || 0,
        servingWeight: weightNum,
        servings: 1,
        units: foodTemplate.units || 'g',
        type: foodTemplate.type || foodTemplate.categoryType || 'other',
        caloriesServing: nutrition.calories,
        image: foodTemplate.image || '',
        date: new Date(),
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Success',
            `${foodTemplate.name} added to your meal`,
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.message || 'Failed to add food. Please try again.'
          );
        },
      }
    );
  };

  if (isLoadingTemplate || !foodTemplate) {
    return (
      <View style={styles.loadingContainer}>
        <Body>Loading food details...</Body>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <MaterialCommunityIcons
                name="food"
                size={32}
                color={theme.colors.primary}
              />
              <View style={styles.headerInfo}>
                <Title style={styles.foodName}>{foodTemplate.name}</Title>
                <Body style={styles.category}>{foodTemplate.categoryType || foodTemplate.type || 'Other'}</Body>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Portion Size Input */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Portion Size</Title>
            <View style={styles.portionInput}>
              <TextInput
                label="Weight (grams)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={styles.input}
              />
              <Body style={styles.unit}>g</Body>
            </View>
          </Card.Content>
        </Card>

        {/* Nutrition Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Nutrition ({weight}g)</Title>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Body style={styles.nutritionLabel}>Calories</Body>
                <Title style={styles.nutritionValue}>{nutrition.calories}</Title>
                <Body style={styles.nutritionUnit}>kcal</Body>
              </View>
              <View style={styles.nutritionItem}>
                <Body style={styles.nutritionLabel}>Protein</Body>
                <Title style={styles.nutritionValue}>{nutrition.protein}</Title>
                <Body style={styles.nutritionUnit}>g</Body>
              </View>
              <View style={styles.nutritionItem}>
                <Body style={styles.nutritionLabel}>Fat</Body>
                <Title style={styles.nutritionValue}>{nutrition.fat}</Title>
                <Body style={styles.nutritionUnit}>g</Body>
              </View>
              <View style={styles.nutritionItem}>
                <Body style={styles.nutritionLabel}>Carbs</Body>
                <Title style={styles.nutritionValue}>{nutrition.carbs}</Title>
                <Body style={styles.nutritionUnit}>g</Body>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Add Button */}
        <Button
          mode="contained"
          onPress={handleAddFood}
          loading={isLoading}
          disabled={isLoading}
          style={styles.addButton}
        >
          Add to Meal
        </Button>

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  portionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nutritionUnit: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  addButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    marginBottom: 16,
  },
});

/**
 * Edit Food Screen
 * Edit existing food item portion
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
import { useUpdateFood, useDeleteFood, useGetFoodById, useGetFoodTemplateById } from '@hooks/useGraphQL';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'EditFood'>;

export default function EditFoodScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { foodId } = route.params;

  const [weight, setWeight] = useState('100');

  const { mutate: updateFood, isLoading: isUpdating } = useUpdateFood();
  const { mutate: deleteFood, isLoading: isDeleting } = useDeleteFood();
  const { data: foodItem, isLoading: isLoadingFood } = useGetFoodById(foodId);
  const { data: foodTemplate, isLoading: isLoadingTemplate } = useGetFoodTemplateById(foodItem?.templateId || '');

  const isLoading = isUpdating || isDeleting;

  // Set initial weight when food item loads
  useEffect(() => {
    if (foodItem?.weight) {
      setWeight(String(foodItem.weight));
    }
  }, [foodItem]);

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

  const handleUpdateFood = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid portion size');
      return;
    }

    updateFood(
      {
        foodId,
        updateData: {
          weight: weightNum,
          calories: nutrition.calories,
          servingWeight: weightNum,
          caloriesServing: nutrition.calories,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Food updated successfully', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.message || 'Failed to update food. Please try again.'
          );
        },
      }
    );
  };

  const handleDeleteFood = () => {
    Alert.alert(
      'Delete Food',
      `Are you sure you want to delete ${foodItem?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFood(foodId, {
              onSuccess: () => {
                Alert.alert('Success', 'Food deleted successfully', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              },
              onError: (error: any) => {
                Alert.alert(
                  'Error',
                  error?.message || 'Failed to delete food. Please try again.'
                );
              },
            });
          },
        },
      ]
    );
  };

  if (isLoadingFood || isLoadingTemplate || !foodItem || !foodTemplate) {
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
                <Title style={styles.foodName}>{foodItem.name}</Title>
                <Body style={styles.category}>{foodItem.categoryType || foodItem.type || 'Other'}</Body>
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

        {/* Update Button */}
        <Button
          mode="contained"
          onPress={handleUpdateFood}
          loading={isUpdating}
          disabled={isLoading}
          style={styles.updateButton}
        >
          Update Food
        </Button>

        {/* Delete Button */}
        <Button
          mode="outlined"
          onPress={handleDeleteFood}
          disabled={isLoading}
          style={styles.deleteButton}
        >
          Delete Food
        </Button>

        {/* Cancel Button */}
        <Button
          mode="text"
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
  updateButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  deleteButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 16,
  },
});

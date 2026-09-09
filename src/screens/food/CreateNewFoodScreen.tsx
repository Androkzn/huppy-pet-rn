/**
 * Create New Food Screen
 * Create custom food template
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Title, Body, Card, Button, TextInput } from '@components/ui';
import { useAddFoodTemplate } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'CreateNewFood'>;

export default function CreateNewFoodScreen({ navigation, route }: Props) {
  const { currentProfile } = useProfile();
  const { mealId } = route.params;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('meat');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');

  const { mutate: addFoodTemplate, isLoading } = useAddFoodTemplate();

  const handleCreateFood = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter food name');
      return;
    }

    const caloriesNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const fatNum = parseFloat(fat) || 0;
    const carbsNum = parseFloat(carbs) || 0;

    addFoodTemplate(
      {
        name: name.trim(),
        categoryType: category,
        calories: caloriesNum,
        protein: proteinNum,
        fat: fatNum,
        carb: carbsNum,
        isCustom: true,
        userId: currentProfile?.userId || '',
        type: category,
        ash: 0,
        bonesRatio: 0,
        caloriesServing: caloriesNum,
        desc: '',
        fiber: 0,
        image: '',
        meatRatio: 0,
        servingWeight: 100,
        servings: 1,
        units: 'g',
        weight: 100,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Custom food created successfully', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SearchFood', { mealId }),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to create food');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Basic Information</Title>
            <TextInput
              label="Food Name *"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Nutrition (per 100g)</Title>
            <TextInput
              label="Calories (kcal)"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Fat (g)"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCreateFood}
          loading={isLoading}
          disabled={isLoading}
          style={styles.createButton}
        >
          Create Food
        </Button>

        <Button mode="outlined" onPress={() => navigation.goBack()} disabled={isLoading}>
          Cancel
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  card: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  input: { marginBottom: 12 },
  createButton: { marginBottom: 12, paddingVertical: 8 },
});

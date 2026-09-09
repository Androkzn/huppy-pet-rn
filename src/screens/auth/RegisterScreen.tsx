/**
 * Register Screen - Profile Creation
 * Creates pet profile after successful signup
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import {
  Button,
  TextInput,
  Container,
  Title,
  Body,
  RadioButton,
} from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useAddProfile } from '@hooks/useGraphQL';
import { ERROR_MESSAGES, DOG_SIZES, ACTIVITY_LEVELS } from '@constants/index';
import { useTheme, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Profile } from '../../types';

type Props = AuthStackScreenProps<'Register'>;

const PRESET_OPTIONS = [
  { value: 'barfAdult', label: 'BARF Adult' },
  { value: 'barfPuppy', label: 'BARF Puppy' },
  { value: 'pmrAdult', label: 'PMR Adult' },
  { value: 'pmrPuppy', label: 'PMR Puppy' },
  { value: 'custom', label: 'Custom' },
];

export default function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const { mutate: addProfile, isLoading: isPending } = useAddProfile();

  // Form State
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [size, setSize] = useState('medium');
  const [activityType, setActivityType] = useState('active');
  const [preset, setPreset] = useState('barfAdult');
  const [errors, setErrors] = useState<{
    name?: string;
    weight?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { name?: string; weight?: string } = {};

    if (!name.trim()) {
      newErrors.name = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!weight.trim()) {
      newErrors.weight = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      navigation.navigate('Login');
      return;
    }

    // Calculate daily portion based on weight
    // Basic formula: 2-3% of body weight in kg
    const weightInKg = Number(weight);
    const dailyPortion = Math.round(weightInKg * 1000 * 0.025); // 2.5% in grams

    const profileData: Partial<Profile> = {
      name: name.trim(),
      weight: Number(weight),
      breed: breed.trim() || 'Mixed',
      dob: dob,
      size,
      activityType,
      preset,
      dailyPortion,
      dailyRatio: 2.5,
      userId: user.id,
      isCurrent: true, // First profile is always current
      isRatioSelected: false,
      deductCalories: false,
      avatar: '', // Will be added later
      categories: [], // Will be populated based on preset
    };

    addProfile(profileData, {
      onSuccess: () => {
        Alert.alert(
          'Success!',
          `${name}'s profile has been created successfully.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigation will happen automatically via RootNavigator
                // when profile is detected
              },
            },
          ]
        );
      },
      onError: (error: any) => {
        console.error('Profile creation error:', error);
        Alert.alert(
          'Error',
          error?.message || 'Unable to create profile. Please try again.'
        );
      },
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Container style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>Create Pet Profile</Title>
            <Body style={styles.subtitle}>
              Let's set up your pet's information
            </Body>
          </View>

          <View style={styles.form}>
            {/* Pet Name */}
            <TextInput
              label="Pet Name *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              error={!!errors.name}
              disabled={isPending}
              style={styles.input}
            />
            {errors.name && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name}
              </Body>
            )}

            {/* Weight */}
            <TextInput
              label="Weight (kg) *"
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
                if (errors.weight) {
                  setErrors({ ...errors, weight: undefined });
                }
              }}
              keyboardType="numeric"
              error={!!errors.weight}
              disabled={isPending}
              style={styles.input}
            />
            {errors.weight && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.weight}
              </Body>
            )}

            {/* Breed */}
            <TextInput
              label="Breed (Optional)"
              value={breed}
              onChangeText={setBreed}
              disabled={isPending}
              style={styles.input}
            />

            {/* Date of Birth */}
            <View style={styles.section}>
              <Body style={styles.label}>Date of Birth</Body>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                disabled={isPending}
                style={styles.dateButton}
              >
                {formatDate(dob)}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Size Selection */}
            <View style={styles.section}>
              <Body style={styles.label}>Size</Body>
              <RadioButton.Group onValueChange={setSize} value={size}>
                {DOG_SIZES.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    disabled={isPending}
                  />
                ))}
              </RadioButton.Group>
            </View>

            {/* Activity Level */}
            <View style={styles.section}>
              <Body style={styles.label}>Activity Level</Body>
              <RadioButton.Group
                onValueChange={setActivityType}
                value={activityType}
              >
                {ACTIVITY_LEVELS.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    disabled={isPending}
                  />
                ))}
              </RadioButton.Group>
            </View>

            {/* Diet Preset */}
            <View style={styles.section}>
              <Body style={styles.label}>Diet Preset</Body>
              <SegmentedButtons
                value={preset}
                onValueChange={setPreset}
                buttons={PRESET_OPTIONS}
              />
            </View>

            {/* Create Button */}
            <Button
              mode="contained"
              onPress={handleCreateProfile}
              loading={isPending}
              disabled={isPending}
              style={styles.createButton}
            >
              Create Profile
            </Button>

            {/* Back Button */}
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              disabled={isPending}
              style={styles.backButton}
            >
              Back
            </Button>
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  createButton: {
    marginTop: 32,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

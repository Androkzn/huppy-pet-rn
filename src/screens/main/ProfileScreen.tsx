/**
 * Profile Screen
 * Manage pet profile and settings
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { RootStackScreenProps } from '@navigation/types';
import {
  Title,
  Body,
  Card,
  Button,
  TextInput,
  RadioButton,
} from '@components/ui';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useUpdateProfile } from '@hooks/useGraphQL';
import { useTheme, SegmentedButtons, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DOG_SIZES, ACTIVITY_LEVELS } from '@constants/index';
import DateTimePicker from '@react-native-community/datetimepicker';

// Reached from the NavBar avatar drawer, as on the web.
type Props = RootStackScreenProps<'Profile'>;

const PRESET_OPTIONS = [
  { value: 'barfAdult', label: 'BARF Adult' },
  { value: 'barfPuppy', label: 'BARF Puppy' },
  { value: 'pmrAdult', label: 'PMR Adult' },
  { value: 'pmrPuppy', label: 'PMR Puppy' },
  { value: 'custom', label: 'Custom' },
];

export default function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const { logout } = useAuth();
  const { mutate: updateProfile, isLoading: isPending } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentProfile?.name || '');
  const [weight, setWeight] = useState(currentProfile?.weight.toString() || '');
  const [breed, setBreed] = useState(currentProfile?.breed || '');
  const [dob, setDob] = useState(
    currentProfile?.dob ? new Date(currentProfile.dob) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [size, setSize] = useState(currentProfile?.size || 'medium');
  const [activityType, setActivityType] = useState(
    currentProfile?.activityType || 'active'
  );
  const [preset, setPreset] = useState(currentProfile?.preset || 'barfAdult');

  const handleSaveProfile = () => {
    if (!currentProfile) return;

    const weightInKg = Number(weight);
    const dailyPortion = Math.round(weightInKg * 1000 * 0.025);

    updateProfile(
      {
        profileId: currentProfile._id,
        updateData: {
          name: name.trim(),
          weight: weightInKg,
          breed: breed.trim(),
          dob,
          size,
          activityType,
          preset,
          dailyPortion,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Profile updated successfully');
          setIsEditing(false);
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to update profile');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setName(currentProfile?.name || '');
    setWeight(currentProfile?.weight.toString() || '');
    setBreed(currentProfile?.breed || '');
    setDob(currentProfile?.dob ? new Date(currentProfile.dob) : new Date());
    setSize(currentProfile?.size || 'medium');
    setActivityType(currentProfile?.activityType || 'active');
    setPreset(currentProfile?.preset || 'barfAdult');
    setIsEditing(false);
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

  const calculateAge = (): string => {
    if (!dob) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dob);
    const ageInMonths =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      }
      return `${years} year${years !== 1 ? 's' : ''}, ${months} month${
        months !== 1 ? 's' : ''
      }`;
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (!currentProfile) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="dog"
          size={80}
          color={theme.colors.primary}
        />
        <Title style={styles.emptyTitle}>No Profile Found</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Avatar */}
        <View style={styles.header}>
          <Avatar.Icon
            size={100}
            icon="dog"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <Title style={styles.profileName}>{currentProfile.name}</Title>
          <Body style={styles.breed}>{currentProfile.breed || 'Mixed'}</Body>
          <Body style={styles.age}>{calculateAge()} old</Body>
        </View>

        {/* Edit/Save Buttons */}
        <View style={styles.actionButtons}>
          {!isEditing ? (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.button}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                loading={isPending}
                disabled={isPending}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                disabled={isPending}
                style={styles.button}
              >
                Cancel
              </Button>
            </>
          )}
        </View>

        {/* Profile Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Basic Information</Title>

            <View style={styles.infoRow}>
              <Body style={styles.label}>Name</Body>
              {isEditing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  disabled={isPending}
                  style={styles.input}
                />
              ) : (
                <Body style={styles.value}>{currentProfile.name}</Body>
              )}
            </View>

            <View style={styles.infoRow}>
              <Body style={styles.label}>Weight</Body>
              {isEditing ? (
                <View style={styles.weightInput}>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    disabled={isPending}
                    style={styles.input}
                  />
                  <Body style={styles.unit}>kg</Body>
                </View>
              ) : (
                <Body style={styles.value}>{currentProfile.weight} kg</Body>
              )}
            </View>

            <View style={styles.infoRow}>
              <Body style={styles.label}>Breed</Body>
              {isEditing ? (
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
                  disabled={isPending}
                  style={styles.input}
                />
              ) : (
                <Body style={styles.value}>{currentProfile.breed || 'Mixed'}</Body>
              )}
            </View>

            <View style={styles.infoRow}>
              <Body style={styles.label}>Date of Birth</Body>
              {isEditing ? (
                <>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    disabled={isPending}
                    style={styles.dateButton}
                    compact
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
                </>
              ) : (
                <Body style={styles.value}>
                  {formatDate(new Date(currentProfile.dob))}
                </Body>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Diet & Activity */}
        {isEditing && (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Size</Title>
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
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Activity Level</Title>
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
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Diet Preset</Title>
                <SegmentedButtons
                  value={preset}
                  onValueChange={setPreset}
                  buttons={PRESET_OPTIONS}
                />
              </Card.Content>
            </Card>
          </>
        )}

        {/* Nutrition Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Nutrition</Title>
            <View style={styles.infoRow}>
              <Body style={styles.label}>Daily Portion</Body>
              <Body style={styles.value}>{currentProfile.dailyPortion}g</Body>
            </View>
            <View style={styles.infoRow}>
              <Body style={styles.label}>Daily Ratio</Body>
              <Body style={styles.value}>{currentProfile.dailyRatio}%</Body>
            </View>
            <View style={styles.infoRow}>
              <Body style={styles.label}>Diet Type</Body>
              <Body style={styles.value}>
                {currentProfile.preset?.toUpperCase()}
              </Body>
            </View>
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
  breed: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  age: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  actionButtons: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
  saveButton: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginTop: 4,
  },
  weightInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unit: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  dateButton: {
    marginTop: 4,
    justifyContent: 'flex-start',
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

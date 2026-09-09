/**
 * Training Screen
 * Track training sessions and achievements
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { Title, Body, Card, Button } from '@components/ui';
import { useProfile } from '@contexts/ProfileContext';
import { useGetTrainingsForDate } from '@hooks/useGraphQL';
import { useTheme, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddTrainingDialog, EditTrainingDialog } from '@components/dialogs';
import type { Training } from '../../types';

type Props = MainTabScreenProps<'Training'>;

export default function TrainingScreen({ navigation }: Props) {
  const theme = useTheme();
  const { currentProfile } = useProfile();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [showEditTrainingDialog, setShowEditTrainingDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const {
    data: trainings,
    isLoading,
    refetch,
  } = useGetTrainingsForDate(currentProfile?._id || '', currentProfile?._id || '', currentDate);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!currentProfile) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="paw"
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Title style={styles.title}>Training Sessions</Title>
        <Body style={styles.subtitle}>{currentProfile.name}'s progress</Body>

        {/* Summary Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={32}
                  color={theme.colors.primary}
                />
                <Body style={styles.statLabel}>This Week</Body>
                <Title style={styles.statValue}>
                  {trainings?.length || 0}
                </Title>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={32}
                  color={theme.colors.secondary}
                />
                <Body style={styles.statLabel}>Total Sessions</Body>
                <Title style={styles.statValue}>-</Title>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Training Sessions */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Recent Sessions</Title>

          {isLoading ? (
            <Card style={styles.card}>
              <Card.Content>
                <Body>Loading training sessions...</Body>
              </Card.Content>
            </Card>
          ) : trainings && trainings.length > 0 ? (
            trainings.map((training: any) => (
              <TouchableOpacity
                key={training._id}
                onPress={() => {
                  setSelectedTraining(training);
                  setShowEditTrainingDialog(true);
                }}
              >
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.trainingHeader}>
                      <MaterialCommunityIcons
                        name="school"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <View style={styles.trainingInfo}>
                        <Body style={styles.trainingType}>
                          {training.category || 'Training'}
                        </Body>
                        <Body style={styles.trainingDetails}>
                          {training.desc ? training.desc : 'No notes'}
                        </Body>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                <Body style={styles.emptyText}>
                  No training sessions recorded yet
                </Body>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Training Categories */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Training Categories</Title>
            <View style={styles.categoryList}>
              {['Obedience', 'Tricks', 'Agility', 'Socialization'].map(
                (category) => (
                  <View key={category} style={styles.categoryItem}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Body style={styles.categoryText}>{category}</Body>
                  </View>
                )
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowTrainingDialog(true)}
      />

      {/* Dialogs */}
      <AddTrainingDialog
        visible={showTrainingDialog}
        onDismiss={() => setShowTrainingDialog(false)}
        selectedDate={currentDate}
      />
      <EditTrainingDialog
        visible={showEditTrainingDialog}
        onDismiss={() => {
          setShowEditTrainingDialog(false);
          setSelectedTraining(null);
        }}
        training={selectedTraining}
      />
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
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  trainingType: {
    fontWeight: '600',
    marginBottom: 4,
  },
  trainingDetails: {
    fontSize: 12,
    opacity: 0.7,
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    marginLeft: 12,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

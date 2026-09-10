/**
 * Training Screen — the day's training sessions.
 *
 * One grouped list of sessions with a checklist affordance, and a count of what
 * has been finished in the section header. The day is steered from the stepper
 * in the navigation bar.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import { useGetTrainingsForDate } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Section } from '@components/ui/Section';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import { EmptyState } from '@components/ios/Feedback';
import TrainingCard from '@components/TrainingCard';
import { AddTrainingDialog } from '@components/dialogs';
import { spacing } from '@theme/tokens';
import type { Training } from '../../types';

type Props = MainTabScreenProps<'Training'>;

export default function TrainingScreen({}: Props) {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: trainings,
    isLoading,
    isError,
  } = useGetTrainingsForDate(
    user?.id || '',
    currentProfile?._id || '',
    currentDate
  );

  const trainingList: Training[] = trainings ?? [];
  const completed = trainingList.filter((training) => training.isCompleted).length;

  return (
    <PageContainer title="Training" subtitle={currentProfile?.name}>
      <Section
        title="Sessions"
        titleRight={
          trainingList.length > 0
            ? `${completed} of ${trainingList.length} done`
            : undefined
        }
        onAdd={() => setDialogOpen(true)}
      >
        {isLoading || isError ? (
          <View style={styles.placeholder}>
            <LoadingAndError isLoading={isLoading} isError={isError} />
          </View>
        ) : trainingList.length > 0 ? (
          trainingList.map((training, index) => (
            <TrainingCard
              key={training._id}
              training={training}
              last={index === trainingList.length - 1}
            />
          ))
        ) : (
          <EmptyState
            symbol="figure.run"
            title="No training planned"
            message="Add a session to track what you are working on together."
            actionLabel="Add training"
            onAction={() => setDialogOpen(true)}
            illustration={
              <Asset
                imageName="no_trainings_placeholder.png"
                width={180}
                height={150}
              />
            }
          />
        )}
      </Section>

      <AddTrainingDialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        selectedDate={currentDate}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});

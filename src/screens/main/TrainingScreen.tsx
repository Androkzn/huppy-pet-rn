/**
 * Training Screen — port of the web app's Training.page.js.
 *
 * A single TRAININGS section: a centered brown header with the training icon
 * and an add button, over the day's training cards or the empty-state artwork.
 * The date picker sits in the NavBar on small screens, as on the web.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import { useGetTrainingsForDate } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset, LoadingAndError } from '@components/ui/Asset';
import TrainingCard from '@components/TrainingCard';
import { AddTrainingDialog } from '@components/dialogs';
import * as colors from '../../theme/colors';
import { fontFamily, layout } from '../../theme';
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

  return (
    <PageContainer>
      <View style={styles.column}>
        {isLoading || isError ? (
          <LoadingAndError isLoading={isLoading} isError={isError} />
        ) : (
          <View style={styles.childContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                <View style={styles.headerImage}>
                  <Asset
                    imageName="training_tab_icon_unselected.svg"
                    width={30}
                    height={30}
                    fill={colors.green}
                  />
                </View>
                <Text style={styles.heading}>TRAININGS</Text>
              </View>
              <View style={styles.headerAddButton}>
                <Asset
                  imageName="plus_round_fill_button.svg"
                  width={35}
                  height={35}
                  onPress={() => setDialogOpen(true)}
                />
              </View>
            </View>

            {/* Body */}
            <View style={styles.column}>
              {trainingList.length > 0 ? (
                trainingList.map((training) => (
                  <TrainingCard key={training._id} training={training} />
                ))
              ) : (
                <View style={styles.placeholder}>
                  <Asset
                    imageName="no_trainings_placeholder.png"
                    width={200}
                    height={170}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      <AddTrainingDialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        selectedDate={currentDate}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    width: '100%',
  },
  // Training.css.js childConteinerStyle (small screen)
  childContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    borderRadius: layout.radius,
    marginTop: 15,
    backgroundColor: colors.grayBackground,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.brown,
    borderTopLeftRadius: layout.radius,
    borderTopRightRadius: layout.radius,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    marginLeft: 20,
  },
  heading: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    margin: 10,
  },
  headerAddButton: {
    marginRight: 20,
  },
  placeholder: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
});

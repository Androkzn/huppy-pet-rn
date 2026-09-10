/**
 * Not Found Screen — shown for any route the app cannot resolve.
 *
 * States what happened and offers the one action worth taking.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from '@components/ui/Asset';
import { EmptyState } from '@components/ios/Feedback';
import { useAppTheme } from '@theme/ThemeProvider';

export default function NotFoundScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.groupedBackground }]}>
      <EmptyState
        symbol="pawprint.fill"
        title="Nothing here"
        message="That page could not be found."
        actionLabel="Go to the diary"
        onAction={() => navigation.navigate('Main')}
        illustration={
          <Asset imageName="general_error.png" width={240} height={160} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

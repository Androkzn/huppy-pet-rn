/**
 * Not Found Screen — port of the web app's NotFound.page.js, which the web
 * router shows for any unknown path.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from '@components/ui/Asset';
import { HuppyButton } from '@components/ui/Buttons';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';

export default function NotFoundScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.title}>Sorry... nothing here.</Text>
        <Asset imageName="general_error.png" width={270} height={170} />
        <View style={styles.buttonContainer}>
          <HuppyButton
            variant="login"
            width={100}
            onPress={() => navigation.navigate('Main')}
          >
            Go home
          </HuppyButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: colors.white,
  },
  placeholder: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.bold,
    color: colors.black,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15,
  },
});

/**
 * Header
 * Port of the web app's NavBar.component.js top AppBar:
 * a fixed brown bar, 60px tall, carrying the logo and the current profile avatar.
 */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '@contexts/ProfileContext';
import * as colors from '../theme/colors';

const logo = require('./assets/logo_green_stroke.png');
const avatarPlaceholder = require('./assets/avatar_placeholder.png');

// Web renders the logo at 220x60 inside a 60px tall AppBar.
const BAR_HEIGHT = 60;
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 60;
const AVATAR_SIZE = 50;

interface HeaderProps {
  /** Tapping the avatar opens the profile drawer on web. */
  onAvatarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAvatarPress }) => {
  const insets = useSafeAreaInsets();
  const { currentProfile } = useProfile();

  return (
    <View style={[styles.bar, { paddingTop: insets.top, height: BAR_HEIGHT + insets.top }]}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {currentProfile && (
        <TouchableOpacity onPress={onAvatarPress} disabled={!onAvatarPress}>
          <Image source={avatarPlaceholder} style={styles.avatar} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.brown,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default Header;

/**
 * NavBar — port of the web app's NavBar.component.js.
 *
 * A fixed 60px brown AppBar. On a small screen the Diary and Training pages
 * show the date picker instead of the logo (the web hides the logo below the
 * `smallScreen` breakpoint everywhere except the auth pages), and a logged-in
 * user gets the profile avatar on the right, which opens the profile drawer.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@contexts/ProfileContext';
import { useCurrentDate } from '@contexts/DateContext';
import { useAuth } from '@contexts/AuthContext';
import { useUpdateProfile } from '@hooks/useGraphQL';
import * as colors from '../theme/colors';
import { fontFamily, layout } from '../theme';
import { Asset } from './ui/Asset';
import Avatar from './Avatar';
import CustomDatePickerWithArrows from './CustomDatePickerWithArrows';
import type { Profile } from '../types';

interface NavBarProps {
  /** Current route, so the bar can mirror the web's per-page chrome. */
  routeName?: string;
  /** Auth pages show the logo even on a small screen. */
  showLogo?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ routeName, showLogo }) => {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentProfile } = useProfile();
  const { currentDate, setCurrentDate } = useCurrentDate();
  const { user } = useAuth();

  const isLoggedIn = !!user && !!currentProfile;
  // Web: the picker sits in the bar on Home and Training, small screens only.
  const showDatePicker = isLoggedIn && (routeName === 'Home' || routeName === 'Training');

  return (
    <>
      <View
        style={[
          styles.bar,
          { paddingTop: insets.top, height: layout.navBarHeight + insets.top },
        ]}
      >
        {showDatePicker && (
          <View style={styles.pickerContainer}>
            <CustomDatePickerWithArrows
              value={currentDate}
              onChange={setCurrentDate}
              backgroundColor={colors.white}
            />
          </View>
        )}

        {showLogo && (
          <Asset
            imageName="logo_green_stroke.png"
            width={220}
            height={60}
            style={styles.logo}
          />
        )}

        {isLoggedIn && (
          <View style={styles.userInfo}>
            <Avatar
              profile={currentProfile}
              width={50}
              onPress={() => setDrawerOpen(true)}
            />
          </View>
        )}
      </View>

      <ProfileDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Web: TemporaryDrawer — a 250px panel in `coffe` with the current profile,
 * an add-profile link, and a switcher listing the other profiles.
 */
const ProfileDrawer: React.FC<DrawerProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<any>();
  const { currentProfile, profiles } = useProfile();
  const { user } = useAuth();
  const { mutate: updateProfile } = useUpdateProfile();

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const changeCurrentProfileTo = (profileNew: Profile) => {
    const oldProfileId = currentProfile?._id;
    updateProfile({ profileId: profileNew._id, updateData: { isCurrent: true } });
    if (oldProfileId) {
      updateProfile({
        profileId: oldProfileId,
        updateData: { isCurrent: false },
      });
    }
    onClose();
  };

  const others = (profiles || []).filter((p) => !p.isCurrent);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
          <ScrollView>
            {/* Current profile */}
            <Pressable
              style={styles.linkContainer}
              onPress={() => navigateTo('Profile')}
            >
              <View style={styles.linkIcon}>
                <Avatar profile={currentProfile} width={50} />
              </View>
              <Text style={styles.linkTitle}> Current Profile </Text>
            </Pressable>

            {/* Add profile */}
            <Pressable
              style={styles.linkContainer}
              onPress={() => navigateTo('Register')}
            >
              <View style={styles.linkIcon}>
                <Asset
                  imageName="add_profile.svg"
                  width={40}
                  height={40}
                  fill={colors.green}
                />
              </View>
              <Text style={styles.linkTitle}> Add Profile </Text>
            </Pressable>

            {/* Change profile */}
            {(profiles || []).length > 1 && (
              <View>
                <View style={styles.linkContainer}>
                  <View style={styles.linkIcon}>
                    <Asset
                      imageName="change_profile.svg"
                      width={40}
                      height={40}
                      fill={colors.green}
                    />
                  </View>
                  <Text style={styles.linkTitle}> Change Profile </Text>
                </View>

                {others.map((profile) => (
                  <Pressable
                    key={profile._id}
                    style={styles.profileLinkContainer}
                    onPress={() => changeCurrentProfileTo(profile)}
                  >
                    <Asset
                      imageName="arrow_right_green.svg"
                      width={15}
                      height={15}
                    />
                    <View style={styles.profileIcon}>
                      <Avatar profile={profile} width={30} />
                    </View>
                    <Text style={styles.profileLinkTitle}>{profile.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
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
  pickerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  // Web Drawer: 250px wide, full height, `coffe` background.
  drawer: {
    width: 250,
    height: '100%',
    backgroundColor: colors.coffe,
    paddingTop: 60,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  linkIcon: {
    width: 60,
  },
  linkTitle: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginHorizontal: 10,
  },
  profileLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginLeft: 30,
  },
  profileIcon: {
    width: 40,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  profileLinkTitle: {
    color: colors.orange,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default NavBar;

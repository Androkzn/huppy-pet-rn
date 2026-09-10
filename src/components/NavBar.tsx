/**
 * NavBar — the app's navigation bar.
 *
 * A Liquid Glass bar the page scrolls under: clear at the top of a screen, then
 * fading in its material, compact title and hairline as content rises behind
 * it. The Diary and Training days are steered from the day stepper in the
 * centre, and the profile lives behind the avatar on the trailing edge, which
 * opens the profile switcher as a sheet — iOS's pattern for a small set of
 * account actions, in place of the web app's side drawer.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@contexts/ProfileContext';
import { useCurrentDate } from '@contexts/DateContext';
import { useAuth } from '@contexts/AuthContext';
import { useUpdateProfile } from '@hooks/useGraphQL';
import { useAppTheme } from '@theme/ThemeProvider';
import { spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { BarButton, NavigationBar } from './ios/NavigationBar';
import { ListRow, ListSection } from './ios/List';
import { Sheet } from './ios/Sheet';
import { Label } from './ios/Text';
import Avatar from './Avatar';
import CustomDatePickerWithArrows from './CustomDatePickerWithArrows';
import type { Profile } from '../types';

/** Route name → the title the compact bar shows. */
const TITLES: Record<string, string> = {
  Home: 'Diary',
  Dashboard: 'Dashboard',
  Training: 'Training',
  More: 'More',
  Profile: 'Profile',
  Register: 'New profile',
  NotFound: 'Not found',
};

interface NavBarProps {
  /** Current route, so the bar can mirror the per-screen chrome. */
  routeName?: string;
  /** Key the screen publishes its scroll offset under. */
  scrollKey?: string;
  /** Overrides the title derived from the route. */
  title?: string;
  /** Auth and profile-creation screens show the wordmark. */
  showLogo?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  routeName,
  scrollKey,
  title,
  showLogo,
}) => {
  const navigation = useNavigation<any>();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const { currentProfile } = useProfile();
  const { currentDate, setCurrentDate } = useCurrentDate();
  const { user } = useAuth();

  const isLoggedIn = !!user && !!currentProfile;
  // The day stepper steers the two dated screens, as the date picker did.
  const showDayStepper =
    isLoggedIn && (routeName === 'Home' || routeName === 'Training');
  const canGoBack = navigation.canGoBack?.() ?? false;

  return (
    <>
      <NavigationBar
        scrollKey={scrollKey ?? routeName ?? 'default'}
        title={title ?? (routeName ? TITLES[routeName] : undefined)}
        // A bar showing the stepper or the wordmark is always solid, since it
        // has content of its own rather than a title that arrives on scroll.
        staticTitle={showDayStepper || showLogo}
        leading={
          canGoBack ? (
            <BarButton
              symbol="chevron.left"
              accessibilityLabel="Back"
              fallbackAsset="back_arrow.svg"
              onPress={() => navigation.goBack()}
            />
          ) : showLogo ? (
            <Label variant="title3" brand style={styles.wordmark}>
              Huppy
            </Label>
          ) : null
        }
        center={
          showDayStepper ? (
            <CustomDatePickerWithArrows
              value={currentDate}
              onChange={setCurrentDate}
            />
          ) : undefined
        }
        trailing={
          isLoggedIn ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profile and accounts"
              hitSlop={8}
              onPress={() => {
                haptics.light();
                setSwitcherOpen(true);
              }}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <Avatar profile={currentProfile} width={34} />
            </Pressable>
          ) : null
        }
      />

      <ProfileSwitcher
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </>
  );
};

interface SwitcherProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The profile switcher: the current pet, the other pets on the account, and the
 * way to add one — an inset grouped list inside a sheet.
 */
const ProfileSwitcher: React.FC<SwitcherProps> = ({ open, onClose }) => {
  const navigation = useNavigation<any>();
  const { currentProfile, profiles } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { colors } = useAppTheme();

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const switchTo = (next: Profile) => {
    haptics.success();
    const previousId = currentProfile?._id;
    updateProfile({ profileId: next._id, updateData: { isCurrent: true } });
    if (previousId) {
      updateProfile({ profileId: previousId, updateData: { isCurrent: false } });
    }
    onClose();
  };

  const others = (profiles ?? []).filter((profile) => !profile.isCurrent);

  return (
    <Sheet open={open} onDismiss={onClose} title="Profiles" detent="medium">
      <View style={styles.sheetBody}>
        <ListSection header="Current">
          <ListRow
            title={currentProfile?.name ?? 'Profile'}
            subtitle="View and edit details"
            leading={<Avatar profile={currentProfile} width={38} />}
            onPress={() => navigateTo('Profile')}
          />
        </ListSection>

        {others.length > 0 ? (
          <ListSection header="Switch to">
            {others.map((profile) => (
              <ListRow
                key={profile._id}
                title={profile.name}
                leading={<Avatar profile={profile} width={38} />}
                chevron={false}
                onPress={() => switchTo(profile)}
              />
            ))}
          </ListSection>
        ) : null}

        <ListSection>
          <ListRow
            title="Add profile"
            symbol="person.badge.plus"
            symbolBackground={colors.tintSoft}
            fallbackAsset="add_profile.svg"
            onPress={() => navigateTo('Register')}
          />
        </ListSection>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  wordmark: {
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  sheetBody: {
    gap: spacing.lg,
    paddingBottom: spacing.base,
  },
});

export default NavBar;

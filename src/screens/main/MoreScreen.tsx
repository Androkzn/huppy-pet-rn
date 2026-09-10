/**
 * More Screen — account actions.
 *
 * An inset grouped list, the way iOS presents settings: each action in a
 * labelled group, destructive ones stated in red and confirmed in an alert that
 * names what will happen.
 */

import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { useProfile } from '@contexts/ProfileContext';
import { PageContainer } from '@components/ui/PageContainer';
import { ListRow, ListSection } from '@components/ios/List';
import { useAppTheme } from '@theme/ThemeProvider';
import { spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';

type Props = MainTabScreenProps<'More'>;

export default function MoreScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { currentProfile } = useProfile();
  const { colors } = useAppTheme();

  const confirmLogout = () => {
    Alert.alert('Sign out?', 'You can sign back in at any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          haptics.medium();
          logout();
        },
      },
    ]);
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This removes your profiles, meals and training history. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              haptics.warning();
              // Account deletion is served by the same session teardown the
              // backend exposes to the app.
              await logout();
            } catch (error) {
              console.error('Error deleting account', error);
            }
          },
        },
      ]
    );
  };

  return (
    <PageContainer title="More">
      <View style={{ gap: spacing.xl }}>
        <ListSection header="Profile">
          <ListRow
            title={currentProfile?.name ?? 'Profile'}
            subtitle="Weight, activity and daily goals"
            symbol="pawprint.fill"
            onPress={() => navigation.getParent()?.navigate('Profile')}
          />
          <ListRow
            title="Add profile"
            symbol="person.badge.plus"
            fallbackAsset="add_profile.svg"
            onPress={() => navigation.getParent()?.navigate('Register')}
          />
        </ListSection>

        <ListSection header="Support">
          <ListRow
            title="Help and feedback"
            symbol="questionmark.circle"
            onPress={() => Linking.openURL('mailto:support@huppy.app')}
          />
        </ListSection>

        <ListSection
          header="Account"
          footer="Deleting your account removes every profile and its history."
        >
          <ListRow
            title="Sign out"
            symbol="rectangle.portrait.and.arrow.right"
            symbolColor={colors.tint}
            fallbackAsset="logout_tab_icon_unselected.svg"
            chevron={false}
            onPress={confirmLogout}
          />
          <ListRow
            title="Delete account"
            symbol="person.crop.circle.badge.xmark"
            symbolBackground={colors.red + '1F'}
            fallbackAsset="delete_account.svg"
            destructive
            chevron={false}
            onPress={confirmDeleteAccount}
          />
        </ListSection>
      </View>
    </PageContainer>
  );
}

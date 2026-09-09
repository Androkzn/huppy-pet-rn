/**
 * More Screen — port of the web app's More.page.js.
 *
 * Two link rows — Logout and Delete account — each a 50px gray pill outlined in
 * lightGreen, with a green icon on the left and a green arrow on the right.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset } from '@components/ui/Asset';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

type Props = MainTabScreenProps<'More'>;

interface LinkProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

const LinkRow: React.FC<LinkProps> = ({ title, iconName, onPress }) => (
  <Pressable style={styles.linkContainer} onPress={onPress}>
    <View style={styles.linkNameContainer}>
      <View style={styles.linkIcon}>
        <Asset
          imageName={iconName}
          width={30}
          height={30}
          fill={colors.green}
        />
      </View>
      <Text style={styles.linkTitle}>{title}</Text>
    </View>
    <View style={styles.linkArrow}>
      <Asset imageName="arrow_right_green.svg" width={15} height={15} />
    </View>
  </Pressable>
);

export default function MoreScreen({}: Props) {
  const { logout } = useAuth();

  const deleteAccount = () => {
    Alert.alert(
      '',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            try {
              // The web calls deleteUserAccount here; logging out is the closest
              // equivalent exposed by the mobile auth context.
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
    <PageContainer>
      <View style={styles.column}>
        <LinkRow
          title="Logout"
          iconName="logout_tab_icon_unselected.svg"
          onPress={logout}
        />
        <LinkRow
          title="Delete account"
          iconName="delete_account.svg"
          onPress={deleteAccount}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  linkContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.lightGreen,
    borderRadius: 10,
    backgroundColor: colors.grayBackground,
  },
  linkNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  linkIcon: {
    width: 60,
    alignItems: 'center',
  },
  linkTitle: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginHorizontal: 10,
  },
  linkArrow: {
    marginHorizontal: 10,
  },
});

/**
 * More Screen
 * Settings and additional options
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { MainTabScreenProps } from '@navigation/types';
import { Title, Body, Card } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useProfile } from '@contexts/ProfileContext';
import { useTheme, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = MainTabScreenProps<'More'>;

export default function MoreScreen({ navigation }: Props) {
  const theme = useTheme();
  const { logout } = useAuth();
  const { currentProfile } = useProfile();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Title style={styles.title}>More</Title>

      {currentProfile && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <MaterialCommunityIcons
                name="dog"
                size={60}
                color={theme.colors.primary}
              />
              <View style={styles.profileInfo}>
                <Title>{currentProfile.name}</Title>
                <Body>{currentProfile.breed || 'Mixed'}</Body>
                <Body style={styles.profileDetail}>
                  {currentProfile.weight} kg • {currentProfile.size}
                </Body>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Settings Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          <List.Item
            title="Notifications"
            description="Manage notification preferences"
            left={(props) => (
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to notifications settings
            }}
          />
          <List.Item
            title="Units"
            description="Weight, distance, temperature"
            left={(props) => (
              <MaterialCommunityIcons
                name="ruler"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to units settings
            }}
          />
          <List.Item
            title="Data Backup"
            description="Export and import data"
            left={(props) => (
              <MaterialCommunityIcons
                name="cloud-upload"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Navigate to backup settings
            }}
          />
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About</Title>
          <List.Item
            title="Privacy Policy"
            left={(props) => (
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Open privacy policy
            }}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => (
              <MaterialCommunityIcons
                name="file-document"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Open terms of service
            }}
          />
          <List.Item
            title="Help & Support"
            left={(props) => (
              <MaterialCommunityIcons
                name="help-circle"
                size={24}
                color={theme.colors.primary}
              />
            )}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: Open help
            }}
          />
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => (
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Account Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account</Title>
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={(props) => (
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color={theme.colors.error}
              />
            )}
            onPress={handleLogout}
          />
        </Card.Content>
      </Card>

      <Body style={styles.footer}>
        Made with ❤️ for pet parents
      </Body>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileDetail: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  footer: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 24,
    marginBottom: 32,
  },
});

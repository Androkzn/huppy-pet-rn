/**
 * Profile Context
 * Manages current pet profile state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile } from '../types';
import { useAuth } from './AuthContext';
import { useGetCurrentProfile, useGetProfiles } from '@hooks/useGraphQL';

interface ProfileContextType {
  currentProfile: Profile | null;
  profiles: Profile[];
  isLoading: boolean;
  setCurrentProfile: (profile: Profile) => void;
  refetchProfiles: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const userId = user?.id || '';

  // Fetch current profile
  const {
    data: fetchedCurrentProfile,
    isLoading: isLoadingCurrent,
    refetch: refetchCurrent,
  } = useGetCurrentProfile(userId);

  // Fetch all profiles
  const {
    data: fetchedProfiles,
    isLoading: isLoadingProfiles,
    refetch: refetchProfiles,
  } = useGetProfiles(userId);

  useEffect(() => {
    if (fetchedCurrentProfile) {
      setCurrentProfile(fetchedCurrentProfile);
    }
  }, [fetchedCurrentProfile]);

  const refetch = () => {
    refetchCurrent();
    refetchProfiles();
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles: fetchedProfiles || [],
        isLoading: isLoadingCurrent || isLoadingProfiles,
        setCurrentProfile,
        refetchProfiles: refetch,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

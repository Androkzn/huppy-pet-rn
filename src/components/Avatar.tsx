/**
 * Avatar — port of the web app's Avatar.components.js:
 * the profile picture fetched from the backend, falling back to the
 * avatar_placeholder artwork while it loads or if it fails.
 */

import React from 'react';
import { useFetchImage } from '@hooks/useImage';
import { ImageCircle } from './ui/Asset';
import type { Profile } from '../types';

const BACKEND_ENDPOINT = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface AvatarProps {
  profile?: Profile | null;
  width?: number;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  profile,
  width = 50,
  onPress,
}) => {
  const url = `${BACKEND_ENDPOINT}/avatar/${profile?._id}?type=url`;
  const {
    data: avatar,
    isLoading,
    isError,
  } = useFetchImage(url, (profile as any)?.avatar, !!profile?._id);

  return (
    <ImageCircle
      imageName="avatar_placeholder.png"
      width={width}
      imageDataUrl={isLoading || isError ? null : (avatar as string)}
      onPress={onPress}
    />
  );
};

export default Avatar;

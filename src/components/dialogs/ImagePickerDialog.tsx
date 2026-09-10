/**
 * ImagePickerDialog — choosing the picture for a pet or a food.
 *
 * A sheet showing the picture as it will appear, with the ways to change it
 * listed beneath: the photo library, the camera, and removing what is there.
 * The system picker does the 1:1 crop, so the round preview matches the result.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageCircle } from '@components/ui/Asset';
import { ListRow, ListSection } from '@components/ios/List';
import { Sheet } from '@components/ios/Sheet';
import { useAppTheme } from '@theme/ThemeProvider';
import { spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';

interface ImagePickerDialogProps {
  visible: boolean;
  /** Current image, if the subject already has one. */
  imageUri?: string | null;
  /** Placeholder asset shown when there is no image. */
  placeholderName: string;
  /** Title when empty; the filled state keeps its own wording. */
  emptyTitle: string;
  filledTitle?: string;
  onSave: (uri: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  visible,
  imageUri,
  placeholderName,
  emptyTitle,
  filledTitle = 'Edit photo',
  onSave,
  onDelete,
  onClose,
}) => {
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState<string | null>(imageUri ?? null);

  useEffect(() => {
    setSelected(imageUri ?? null);
  }, [imageUri, visible]);

  const isEmpty = !selected;

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      haptics.light();
      setSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      haptics.light();
      setSelected(result.assets[0].uri);
    }
  };

  return (
    <Sheet
      open={visible}
      onDismiss={onClose}
      title={isEmpty ? emptyTitle : filledTitle}
      confirmLabel="Save"
      confirmDisabled={isEmpty}
      onConfirm={() => selected && onSave(selected)}
      detent="medium"
    >
      <View style={styles.body}>
        <View style={styles.preview}>
          <ImageCircle
            imageName={placeholderName}
            width={148}
            imageDataUrl={selected}
            borderColor={colors.tintSoft}
            borderWidth={4}
          />
        </View>

        <ListSection>
          <ListRow
            title="Choose from library"
            symbol="photo.on.rectangle"
            chevron={false}
            onPress={pickFromLibrary}
          />
          <ListRow
            title="Take a photo"
            symbol="camera.fill"
            chevron={false}
            onPress={takePhoto}
          />
        </ListSection>

        {!isEmpty ? (
          <ListSection>
            <ListRow
              title="Remove photo"
              symbol="trash"
              symbolBackground={colors.red + '1F'}
              destructive
              chevron={false}
              onPress={() => {
                haptics.warning();
                setSelected(null);
                onDelete();
              }}
            />
          </ListSection>
        ) : null}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: spacing.lg,
    paddingBottom: spacing.base,
  },
  preview: {
    alignItems: 'center',
  },
});

export default ImagePickerDialog;

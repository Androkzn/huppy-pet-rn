/**
 * ImagePickerDialog — port of the web app's four image dialogs
 * (AddAvatarDialog, ChangeAvatarDialog, AddImageDialog, ChangeImageDialog),
 * which share one layout and differ only in placeholder and title.
 *
 * The web crops with react-mobile-cropper and a circular 1:1 stencil; here the
 * system picker's own editor does the 1:1 crop and the round preview matches.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageCircle } from '@components/ui/Asset';
import { Asset } from '@components/ui/Asset';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

interface ImagePickerDialogProps {
  visible: boolean;
  /** Current image, if the subject already has one. */
  imageUri?: string | null;
  /** Placeholder asset shown when there is no image. */
  placeholderName: string;
  /** Title when empty; the web keeps "Edit avatar" for the filled state. */
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
  filledTitle = 'Edit avatar',
  onSave,
  onDelete,
  onClose,
}) => {
  const [selected, setSelected] = useState<string | null>(imageUri ?? null);

  useEffect(() => {
    setSelected(imageUri ?? null);
  }, [imageUri, visible]);

  const isEmpty = !selected;

  const handleSelect = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelected(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.closeButtonContainer}>
            <Asset
              imageName="close_round_orange.svg"
              width={30}
              height={30}
              onPress={onClose}
            />
          </View>

          <Text style={styles.title}>{isEmpty ? emptyTitle : filledTitle}</Text>

          <View style={styles.avatarContainer}>
            <ImageCircle
              imageName={placeholderName}
              width={150}
              imageDataUrl={selected}
              borderColor={colors.lightOrange}
            />
          </View>

          <View
            style={[
              styles.buttonContainer,
              // Web: a single button is centered, otherwise space-between.
              { justifyContent: isEmpty ? 'center' : 'space-between' },
            ]}
          >
            {!isEmpty && (
              <Asset
                imageName="save_green.svg"
                width={25}
                height={25}
                onPress={() => selected && onSave(selected)}
              />
            )}
            <Asset
              imageName="add_green.svg"
              width={25}
              height={25}
              onPress={handleSelect}
            />
            {!isEmpty && (
              <Asset
                imageName="delete_orange.svg"
                width={30}
                height={30}
                onPress={() => {
                  setSelected(null);
                  onDelete();
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile.css.js dialogLargeContainerStyle
  dialog: {
    maxWidth: 450,
    minWidth: 250,
    width: '90%',
    maxHeight: 550,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 22,
    fontFamily: fontFamily.bold,
    marginVertical: 10,
  },
  // avatarContainerStyle: 250px wide, centered
  avatarContainer: {
    maxWidth: 250,
    minWidth: 250,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default ImagePickerDialog;

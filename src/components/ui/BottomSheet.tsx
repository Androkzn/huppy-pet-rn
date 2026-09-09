/**
 * BottomSheet — stands in for react-spring-bottom-sheet, which the web app uses
 * for the edit-food and copy-meal panels: a white panel that rises from the
 * bottom with rounded top corners.
 */

import React from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import * as colors from '../../theme/colors';

interface BottomSheetProps {
  open: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onDismiss,
  children,
}) => (
  <Modal
    visible={open}
    transparent
    animationType="slide"
    onRequestClose={onDismiss}
  >
    <Pressable style={styles.backdrop} onPress={onDismiss}>
      <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
        <View style={styles.handle} />
        <ScrollView>{children}</ScrollView>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    paddingTop: 8,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray,
    marginBottom: 10,
  },
});

export default BottomSheet;

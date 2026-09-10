/**
 * BottomSheet — a panel that rises from the bottom edge.
 *
 * Delegates to the iOS sheet: grabber, spring entrance, swipe-to-dismiss and
 * the sheet's large continuous corners.
 */

import React from 'react';
import { Sheet } from '@components/ios/Sheet';

interface BottomSheetProps {
  open: boolean;
  onDismiss?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onDismiss,
  title,
  children,
}) => (
  <Sheet open={open} onDismiss={onDismiss} title={title}>
    {children}
  </Sheet>
);

export default BottomSheet;

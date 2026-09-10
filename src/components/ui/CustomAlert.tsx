/**
 * CustomAlert — the transient status banner.
 *
 * Rendered as the iOS glass toast: a capsule that drops from the top edge with
 * a status symbol, then retreats on its own.
 */

import React from 'react';
import { AlertType } from '@constants/enums';
import { Toast, type ToastKind } from '@components/ios/Toast';

interface CustomAlertProps {
  message: string;
  type: string;
  show: boolean;
  setAppearance: (show: boolean) => void;
  timeout?: number;
}

const kindFor = (type: string): ToastKind => {
  if (type === AlertType.SUCCESS) return 'success';
  if (type === AlertType.ERROR) return 'error';
  return 'info';
};

export const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  type,
  show,
  setAppearance,
  timeout = 3000,
}) => (
  <Toast
    message={message}
    kind={kindFor(type)}
    visible={show}
    duration={timeout}
    onHide={() => setAppearance(false)}
  />
);

export default CustomAlert;

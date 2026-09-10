/**
 * UI kit.
 *
 * The app's shared controls. Most are thin wrappers over the iOS 26 component
 * set in `@components/ios`, which is where the design language lives.
 */

export { Button } from './Button';
export { TextInput } from './TextInput';
export { Card } from './Card';
export { Container } from './Container';
export { Text, Title, Heading, Body, Caption } from './Text';
export { RadioButton } from './RadioButton';
export { Checkbox } from './Checkbox';
export { Dropdown } from './Dropdown';
export type { DropdownOption } from './Dropdown';
export { BottomSheet } from './BottomSheet';
export { CustomAlert } from './CustomAlert';
export { LoginTextInput } from './LoginTextInput';
export { TitleAndSlider } from './TitleAndSlider';
export { ButtonsAndTextField } from './ButtonsAndTextField';
export {
  FormGroup,
  FormRow,
  TitleAndDropdown,
  TitleAndTextField,
  TitleAndToggle,
  TitleAndDatePicker,
  TitleButtonsAndTextField,
  TitleToggleAndButtons,
  TitleTooltipAndValue,
} from './FormRows';

// Shared visuals
export { Asset, ImageCircle, Spinner, LoadingAndError } from './Asset';
export { HuppyButton, buttonVariants } from './Buttons';
export type { ButtonVariant } from './Buttons';
export { Section } from './Section';
export { PageContainer } from './PageContainer';

// The iOS 26 set, re-exported so screens can reach it from one place.
export {
  Card as IOSCard,
  EmptyState,
  Glass,
  Icon,
  IOSButton,
  Label,
  ListRow,
  ListSection,
  ProgressBar,
  Screen,
  SegmentedControl,
  Sheet,
  TextField,
  Toast,
} from '@components/ios';
export { Stepper } from '@components/ios/Stepper';

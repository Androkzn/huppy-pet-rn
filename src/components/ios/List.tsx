/**
 * Inset grouped lists — the iOS layout for settings, choices and detail rows.
 *
 * A section is a rounded surface floating on the grouped background, carrying
 * a quiet uppercase header above it and hairlines *between* rows only, inset to
 * clear the leading icon. Rows are 44pt minimum, highlight on press, and end in
 * a chevron when they lead somewhere.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';

export interface ListSectionProps {
  header?: string;
  footer?: string;
  /** Trailing control on the header row. */
  headerAccessory?: React.ReactNode;
  /** Removes the surface, for sections that lay out their own cards. */
  plain?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const ListSection: React.FC<ListSectionProps> = ({
  header,
  footer,
  headerAccessory,
  plain = false,
  style,
  contentStyle,
  children,
}) => {
  const { colors } = useAppTheme();
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={[styles.section, style]}>
      {header || headerAccessory ? (
        <View style={styles.sectionHeader}>
          {header ? (
            <Label variant="footnote" role="secondary" sectionHeader numberOfLines={1}>
              {header}
            </Label>
          ) : (
            <View />
          )}
          {headerAccessory}
        </View>
      ) : null}

      <View
        style={[
          plain
            ? styles.plainSurface
            : [styles.surface, { backgroundColor: colors.groupedSurface }],
          contentStyle,
        ]}
      >
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && !plain ? (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.separator, height: layout.hairline },
                ]}
              />
            ) : null}
            {child}
          </React.Fragment>
        ))}
      </View>

      {footer ? (
        <Label variant="footnote" role="secondary" style={styles.footer}>
          {footer}
        </Label>
      ) : null}
    </View>
  );
};

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Symbol shown in a tinted tile on the leading edge. */
  symbol?: SFSymbol;
  symbolColor?: string;
  symbolBackground?: string;
  fallbackAsset?: string;
  /** Replaces the symbol tile entirely. */
  leading?: React.ReactNode;
  /** Right-aligned secondary value. */
  value?: string;
  /** Replaces the value and chevron. */
  trailing?: React.ReactNode;
  /** Shows the disclosure chevron. */
  chevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  symbol,
  symbolColor,
  symbolBackground,
  fallbackAsset,
  leading,
  value,
  trailing,
  chevron,
  destructive = false,
  disabled = false,
  onPress,
  style,
}) => {
  const { colors } = useAppTheme();
  const showChevron = chevron ?? (!!onPress && !trailing);
  const titleColor = destructive ? colors.red : colors.label;

  const content = (
    <>
      {leading ??
        (symbol ? (
          <View
            style={[
              styles.tile,
              { backgroundColor: symbolBackground ?? colors.tintSoft },
            ]}
          >
            <Icon
              name={symbol}
              size={17}
              weight="semibold"
              color={symbolColor ?? (destructive ? colors.red : colors.tint)}
              fallbackAsset={fallbackAsset}
            />
          </View>
        ) : null)}

      <View style={styles.rowText}>
        <Label variant="body" color={titleColor} numberOfLines={1}>
          {title}
        </Label>
        {subtitle ? (
          <Label variant="footnote" role="secondary" numberOfLines={2}>
            {subtitle}
          </Label>
        ) : null}
      </View>

      {trailing}
      {value ? (
        <Label variant="body" role="secondary" numberOfLines={1}>
          {value}
        </Label>
      ) : null}
      {showChevron ? (
        <Icon name="chevron.right" size={13} weight="semibold" color={colors.tertiaryLabel} />
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, disabled && styles.disabled, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: colors.quaternaryFill },
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
    gap: 7,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding + 4,
    minHeight: 20,
    gap: spacing.sm,
  },
  surface: {
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  plainSurface: {
    gap: spacing.md,
  },
  separator: {
    // Hairlines start after the leading tile, as in the system's own lists.
    marginLeft: layout.screenPadding + 30 + spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 46,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 9,
  },
  rowText: {
    flex: 1,
    gap: 1,
  },
  tile: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: layout.screenPadding + 4,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default ListSection;

/**
 * Section — a collapsible group of content.
 *
 * The iOS grouped-list shape: a quiet uppercase header outside the surface, the
 * content on a rounded card below it, and a chevron that rotates as the section
 * opens. The add control is a small tinted circular button on the header row,
 * where iOS puts a section's action.
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, motion, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Icon } from '@components/ios/Icon';
import { Label } from '@components/ios/Text';

interface SectionProps {
  title: string;
  /** Second heading pinned to the right of the header, e.g. 'Today / Goal'. */
  titleRight?: string;
  /** Rotates the chevron and, with `onToggle`, hides the content. */
  expanded?: boolean;
  onToggle?: () => void;
  /** Shows the add button on the right of the header. */
  onAdd?: () => void;
  addDisabled?: boolean;
  /** Drops the card surface, for sections whose children are cards already. */
  plain?: boolean;
  children?: React.ReactNode;
  style?: object;
}

export const Section: React.FC<SectionProps> = ({
  title,
  titleRight,
  expanded = true,
  onToggle,
  onAdd,
  addDisabled,
  plain = false,
  children,
  style,
}) => {
  const { colors } = useAppTheme();
  const rotation = useSharedValue(expanded ? 0 : -90);

  useEffect(() => {
    rotation.value = withSpring(expanded ? 0 : -90, motion.smooth);
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole={onToggle ? 'button' : 'header'}
          accessibilityLabel={title}
          accessibilityState={onToggle ? { expanded } : undefined}
          style={styles.headerTitle}
          onPress={
            onToggle
              ? () => {
                  haptics.light();
                  onToggle();
                }
              : undefined
          }
          disabled={!onToggle}
          hitSlop={6}
        >
          {onToggle ? (
            <Animated.View style={chevronStyle}>
              <Icon
                name="chevron.down"
                size={12}
                weight="bold"
                color={colors.tertiaryLabel}
                fallbackAsset="arrow_down_green.svg"
              />
            </Animated.View>
          ) : null}

          <Label variant="footnote" role="secondary" sectionHeader numberOfLines={1}>
            {title}
          </Label>

          {titleRight ? (
            <Label
              variant="footnote"
              role="tertiary"
              numberOfLines={1}
              style={styles.titleRight}
            >
              {titleRight}
            </Label>
          ) : null}
        </Pressable>

        {onAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add to ${title}`}
            disabled={addDisabled}
            hitSlop={8}
            onPress={() => {
              haptics.light();
              onAdd();
            }}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.tintSoft },
              pressed && styles.pressed,
              addDisabled && styles.disabled,
            ]}
          >
            <Icon
              name="plus"
              size={14}
              weight="bold"
              color={colors.tint}
              fallbackAsset="plus_round_fill_button.svg"
            />
          </Pressable>
        ) : null}
      </View>

      {expanded || !onToggle ? (
        <View
          style={
            plain
              ? styles.plainBody
              : [styles.body, { backgroundColor: colors.groupedSurface }]
          }
        >
          {children}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding + 4,
    minHeight: 24,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleRight: {
    marginLeft: 'auto',
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: radius.capsule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  plainBody: {
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Section;

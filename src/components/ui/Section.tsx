/**
 * Section — port of the repeated section chrome in the web app
 * (Home.css.js: childConteinerStyle + headerStyle + headingStyle).
 *
 * A rounded gray panel under a 40px brown header strip that carries a
 * disclosure arrow, a title, an optional right-hand title, and an optional
 * round "+" button.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily, layout } from '../../theme';
import { Asset } from './Asset';

interface SectionProps {
  title: string;
  /** Second heading pinned to the right of the strip, e.g. 'Today / Goal'. */
  titleRight?: string;
  /** Renders the arrow as down (expanded) or right (collapsed). */
  expanded?: boolean;
  onToggle?: () => void;
  /** Shows the round add button on the right of the header. */
  onAdd?: () => void;
  addDisabled?: boolean;
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
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={onToggle}
          disabled={!onToggle}
          activeOpacity={onToggle ? 0.6 : 1}
        >
          <View style={styles.headerArrow}>
            <Asset
              imageName={
                expanded ? 'arrow_down_green.svg' : 'arrow_right_green.svg'
              }
              width={20}
              height={20}
            />
          </View>
          {titleRight ? (
            <View style={styles.headerText}>
              <Text style={styles.heading}>{title}</Text>
              <Text style={styles.heading}>{titleRight}</Text>
            </View>
          ) : (
            <Text style={styles.heading}>{title}</Text>
          )}
        </TouchableOpacity>

        {onAdd && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAdd}
            disabled={addDisabled}
          >
            <Asset
              imageName="plus_round_fill_button.svg"
              width={30}
              height={30}
            />
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Home.css.js childConteinerStyle
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    borderRadius: layout.radius,
    backgroundColor: colors.grayBackground,
    overflow: 'hidden',
  },
  // Home.css.js headerStyle
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.brown,
    height: layout.sectionHeaderHeight,
    borderTopLeftRadius: layout.radius,
    borderTopRightRadius: layout.radius,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // headerArrowStyle: margin '3px 20px 0px 30px'
  headerArrow: {
    marginTop: 3,
    marginRight: 20,
    marginLeft: 30,
  },
  // headerTextStyle: space-between across 80% of the strip
  headerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
  },
  // headingStyle
  heading: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginRight: 30,
  },
  // headerAddButtonStyle
  addButton: {
    marginRight: 20,
  },
});

/**
 * TabBar — the app's bottom navigation.
 *
 * The implementation is `LiquidTabBar`: an iOS 26 floating glass capsule. This
 * module stays as the navigator's entry point so the navigation layer keeps
 * importing one stable name.
 */

export { LiquidTabBar as TabBar, tabBarClearance } from './ios/LiquidTabBar';
export { LiquidTabBar as default } from './ios/LiquidTabBar';

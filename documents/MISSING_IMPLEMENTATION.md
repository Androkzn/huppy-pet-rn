# Missing Implementation Analysis

## Overview

The TypeScript React Native migration is **100% complete** for core functionality. All 9 screens are implemented and TypeScript compilation is passing. However, there are several features with TODO placeholders that need implementation for full app functionality.

---

## 🔴 Critical Missing Features (Priority 1)

### 1. Add/Edit Dialogs - Data Entry Functionality

Currently all FAB buttons and "Add" buttons have TODO placeholders. Users cannot add or edit data.

#### HomeScreen - Missing Dialogs
**Location**: `src/screens/main/HomeScreen.tsx`

**TODOs Found**:
- Line 241: `// TODO: Navigate to add meal screen`
- Line 302: `// TODO: Navigate to add activity screen`
- Line 356: `// TODO: Open add menu (meal, activity, etc.)`

**What's Needed**:
1. **AddMealDialog** component
   - Create new meal for selected date
   - Time picker for meal time
   - Navigation to food search after creation

2. **AddActivityDialog** component
   - Activity type selection (walk, run, play)
   - Duration input (minutes)
   - Distance input (optional, for walks/runs)
   - Notes field

3. **FAB Menu** for Home screen
   - Quick add meal
   - Quick add activity
   - Quick add training (optional)

#### TrainingScreen - Missing Dialog
**Location**: `src/screens/main/TrainingScreen.tsx`

**TODO Found**:
- Line 160: `// TODO: Open add training session dialog`

**What's Needed**:
1. **AddTrainingDialog** component
   - Category selection (Obedience, Tricks, Agility, Socialization)
   - Duration input
   - Notes field
   - Date picker

#### Food Flow - Missing Screens
**Defined in navigation** but not implemented:

**From** `src/navigation/types.ts`:
```typescript
export type FoodStackParamList = {
  SearchFood: { mealId: string };          // ❌ NOT IMPLEMENTED
  AddFood: { mealId: string; foodTemplateId: string }; // ❌ NOT IMPLEMENTED
  EditFood: { foodId: string };            // ❌ NOT IMPLEMENTED
  CreateNewFood: undefined;                // ❌ NOT IMPLEMENTED
};
```

**What's Needed**:
1. **SearchFoodScreen** - Search food database and select food
2. **AddFoodScreen** - Add food item to meal with portion size
3. **EditFoodScreen** - Edit existing food item
4. **CreateNewFoodScreen** - Create custom food template

---

## 🟡 Important Missing Features (Priority 2)

### 2. Settings Screens

**Location**: `src/screens/main/MoreScreen.tsx`

**TODOs Found**:
- Line 76: `// TODO: Navigate to notifications settings`
- Line 91: `// TODO: Navigate to units settings`
- Line 106: `// TODO: Navigate to backup settings`

**What's Needed**:
1. **NotificationsSettingsScreen**
   - Enable/disable meal reminders
   - Enable/disable activity reminders
   - Notification time preferences

2. **UnitsSettingsScreen**
   - Weight units (kg/lbs)
   - Distance units (km/miles)
   - Date format preferences

3. **BackupSettingsScreen**
   - Export data to JSON
   - Import data from JSON
   - Cloud backup integration (optional)

### 3. Legal/Help Screens

**Location**: `src/screens/main/MoreScreen.tsx`

**TODOs Found**:
- Line 127: `// TODO: Open privacy policy`
- Line 141: `// TODO: Open terms of service`
- Line 155: `// TODO: Open help`

**What's Needed**:
1. **PrivacyPolicyScreen** - Display privacy policy
2. **TermsOfServiceScreen** - Display terms of service
3. **HelpScreen** - FAQ and support contact

---

## 🟢 Optional Enhancements (Priority 3)

### 4. Charts Visualization

**Location**: `src/screens/main/DashboardScreen.tsx`

**Placeholders**:
- Lines 139-146: Weekly trends chart placeholder
- Lines 148-155: Category breakdown pie chart placeholder

**What's Needed**:
1. Install **Victory Native XL** or **react-native-charts-wrapper**
   ```bash
   npm install victory-native-xl
   ```

2. **WeeklyTrendsChart** component
   - Line chart showing daily food intake over week/month
   - Target line overlay
   - Interactive tooltips

3. **CategoryBreakdownChart** component
   - Pie chart showing food category distribution
   - Percentage labels
   - Color-coded by category

### 5. Image Handling

**What's Needed**:
1. Install **expo-image-picker**
   ```bash
   npx expo install expo-image-picker
   ```

2. **Avatar Upload**
   - Camera integration
   - Photo library selection
   - Image cropping
   - Upload to storage

3. **Food Photos**
   - Attach photos to food items
   - Photo gallery for meals
   - Image compression

### 6. Profile Switching

**Current State**: `useProfile` context supports multiple profiles but no UI to switch

**What's Needed**:
1. **ProfileSelectorDialog**
   - List all user's pet profiles
   - Switch between profiles
   - Add new profile button

2. **Profile Management**
   - Edit profile in ProfileScreen
   - Delete profile functionality
   - Set current profile

---

## 📊 Implementation Status Summary

### ✅ Implemented (100%)
- Authentication flow (Login, Signup, ForgotPassword, Register)
- Main navigation (5 tabs)
- Profile viewing and editing
- Data display (meals, activities, trainings)
- Statistics calculation
- GraphQL integration
- TypeScript compilation

### ❌ Not Implemented (0%)
- Add/Edit dialogs for meals, activities, trainings
- Food search and selection flow
- Settings screens
- Legal/Help screens
- Charts visualization
- Image upload functionality
- Profile switching UI

### 📈 Implementation Priority

**Must Have** (for MVP):
1. ✅ Core screens - COMPLETE
2. ❌ Add Meal functionality - **MISSING**
3. ❌ Add Activity functionality - **MISSING**
4. ❌ Food search/add flow - **MISSING**
5. ❌ Add Training functionality - **MISSING**

**Should Have**:
6. ❌ Settings screens - **MISSING**
7. ❌ Profile switching - **MISSING**
8. ❌ Charts visualization - **MISSING**

**Nice to Have**:
9. ❌ Legal/Help screens - **MISSING**
10. ❌ Image upload - **MISSING**
11. ❌ Data export/import - **MISSING**

---

## 🎯 Recommended Next Steps

### Phase 1: Make App Functional (Critical)

1. **Implement Add Meal Dialog**
   - Create `src/components/dialogs/AddMealDialog.tsx`
   - Hook up to HomeScreen FAB and "Add Meal" button
   - GraphQL mutation: `useAddMeal()`

2. **Implement Food Search Screen**
   - Create `src/screens/food/SearchFoodScreen.tsx`
   - Search food templates
   - Display results in list

3. **Implement Add Food Screen**
   - Create `src/screens/food/AddFoodScreen.tsx`
   - Portion size input
   - Add to meal with `useAddFood()`

4. **Implement Add Activity Dialog**
   - Create `src/components/dialogs/AddActivityDialog.tsx`
   - Hook up to HomeScreen "Add Activity" button
   - GraphQL mutation: `useAddActivity()`

5. **Implement Add Training Dialog**
   - Create `src/components/dialogs/AddTrainingDialog.tsx`
   - Hook up to TrainingScreen FAB
   - GraphQL mutation: `useAddTraining()`

### Phase 2: Complete User Experience

6. **Settings Screens** - All 3 settings pages
7. **Charts** - Victory Native XL integration
8. **Legal Screens** - Privacy, Terms, Help

### Phase 3: Polish

9. **Image Upload** - expo-image-picker integration
10. **Profile Switching** - UI for multiple pets
11. **Data Export** - Backup/restore functionality

---

## 📁 Suggested File Structure

```
src/
├── components/
│   ├── dialogs/
│   │   ├── AddMealDialog.tsx          # ❌ TO CREATE
│   │   ├── AddActivityDialog.tsx      # ❌ TO CREATE
│   │   ├── AddTrainingDialog.tsx      # ❌ TO CREATE
│   │   ├── EditFoodDialog.tsx         # ❌ TO CREATE
│   │   └── ProfileSelectorDialog.tsx  # ❌ TO CREATE
│   └── charts/
│       ├── WeeklyTrendsChart.tsx      # ❌ TO CREATE
│       └── CategoryBreakdownChart.tsx # ❌ TO CREATE
│
├── screens/
│   ├── food/
│   │   ├── SearchFoodScreen.tsx       # ❌ TO CREATE
│   │   ├── AddFoodScreen.tsx          # ❌ TO CREATE
│   │   ├── EditFoodScreen.tsx         # ❌ TO CREATE
│   │   └── CreateNewFoodScreen.tsx    # ❌ TO CREATE
│   │
│   └── settings/
│       ├── NotificationsScreen.tsx    # ❌ TO CREATE
│       ├── UnitsScreen.tsx            # ❌ TO CREATE
│       ├── BackupScreen.tsx           # ❌ TO CREATE
│       ├── PrivacyPolicyScreen.tsx    # ❌ TO CREATE
│       ├── TermsScreen.tsx            # ❌ TO CREATE
│       └── HelpScreen.tsx             # ❌ TO CREATE
```

---

## 🔧 GraphQL Mutations Already Available

The following mutations are already implemented in `src/hooks/useGraphQL.ts`:

### ✅ Available Mutations
- `useAddMeal()` - Ready to use
- `useAddFood()` - Ready to use
- `useUpdateFood()` - Ready to use
- `useDeleteFood()` - Ready to use
- `useAddActivity()` - Ready to use
- `useUpdateActivity()` - Ready to use
- `useDeleteActivity()` - Ready to use
- `useAddTraining()` - Ready to use
- `useUpdateTraining()` - Ready to use
- `useDeleteTraining()` - Ready to use
- `useAddFoodTemplate()` - Ready to use
- `useAddFoodCategory()` - Ready to use

**All GraphQL integration is complete** - just need to create the UI components!

---

## Summary

**Migration Status**: ✅ 100% Complete
**App Functionality**: ⚠️ 40% Complete
**Production Ready**: ❌ No - Missing critical data entry features

**To make the app usable**, implement Phase 1 (5 dialogs/screens).
**To make the app complete**, implement Phase 2 (settings + charts).
**To make the app polished**, implement Phase 3 (images + export).

The backend integration (GraphQL, authentication, state management) is fully complete. Only frontend UI components for data entry are missing.

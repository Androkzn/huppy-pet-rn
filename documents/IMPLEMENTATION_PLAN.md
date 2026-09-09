# Implementation Plan - Critical Features

## Quick Summary

**Current Status**: TypeScript migration 100% complete, but app cannot add data yet.

**Critical Missing**: 5 dialogs/screens for data entry (meals, food, activities, trainings)

**Timeline**: ~2-3 days to implement Phase 1 (make app functional)

---

## Phase 1: Critical Data Entry Features (MVP)

### 1. Add Meal Dialog ⭐ HIGHEST PRIORITY
**File**: `src/components/dialogs/AddMealDialog.tsx`

**Features**:
- Modal dialog with date/time picker
- Create meal for current profile
- Navigate to food search after creation

**Implementation**:
```typescript
interface AddMealDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: (mealId: string) => void;
  selectedDate?: Date;
}

// Use existing hook: useAddMeal()
// After success: navigate to SearchFood screen
```

**Estimated Time**: 2-3 hours

---

### 2. Search Food Screen ⭐ HIGHEST PRIORITY
**File**: `src/screens/food/SearchFoodScreen.tsx`

**Features**:
- Search input with debouncing
- Results list from food templates
- Category filter
- Custom food templates
- Navigate to AddFood on selection

**Implementation**:
```typescript
// Use existing hook: useSearchForFood(searchQuery)
// Use existing hook: useGetAllFoodTemplatesForCategory(category)
// Use existing hook: useGetAllCustomFoodTemplates()
```

**Estimated Time**: 3-4 hours

---

### 3. Add Food Screen ⭐ HIGHEST PRIORITY
**File**: `src/screens/food/AddFoodScreen.tsx`

**Features**:
- Display selected food template
- Portion size input (grams)
- Calculate calories based on portion
- Add to meal button

**Implementation**:
```typescript
type Props = FoodStackScreenProps<'AddFood'>;
// Receives: { mealId, foodTemplateId }

// Use existing hook: useAddFood()
// On success: navigate back to Home
// Automatically refreshes meal data via React Query
```

**Estimated Time**: 2-3 hours

---

### 4. Add Activity Dialog
**File**: `src/components/dialogs/AddActivityDialog.tsx`

**Features**:
- Activity type selection (walk, run, play)
- Duration input (minutes)
- Distance input (optional)
- Notes field
- Date/time picker

**Implementation**:
```typescript
interface AddActivityDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedDate?: Date;
}

// Use existing hook: useAddActivity()
```

**Estimated Time**: 2-3 hours

---

### 5. Add Training Dialog
**File**: `src/components/dialogs/AddTrainingDialog.tsx`

**Features**:
- Category selection (Obedience, Tricks, Agility, Socialization)
- Duration input
- Notes field
- Date picker

**Implementation**:
```typescript
interface AddTrainingDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

// Use existing hook: useAddTraining()
```

**Estimated Time**: 2-3 hours

---

### 6. Navigation Updates

**Update Files**:
- `src/navigation/MainNavigator.tsx` - Add food stack navigator
- `src/screens/main/HomeScreen.tsx` - Hook up dialogs
- `src/screens/main/TrainingScreen.tsx` - Hook up dialog

**Estimated Time**: 1-2 hours

---

## Phase 1 Total: ~15-20 hours (2-3 days)

After Phase 1, users can:
- ✅ Create meals
- ✅ Search and add food to meals
- ✅ Add activities
- ✅ Add training sessions
- ✅ View all data in Home/Dashboard/Training screens

**App becomes functional and usable!**

---

## Phase 2: Complete User Experience (~3-4 days)

### 1. Edit Functionality (High Priority)
- EditFoodDialog - Edit portion sizes
- Delete confirmations for all data types
- Swipe-to-delete on lists

**Estimated Time**: 4-6 hours

### 2. Settings Screens (Medium Priority)
- NotificationsScreen
- UnitsScreen
- BackupScreen (export/import JSON)

**Estimated Time**: 6-8 hours

### 3. Charts Integration (Medium Priority)
- Install Victory Native XL
- WeeklyTrendsChart component
- CategoryBreakdownChart component
- Replace placeholders in DashboardScreen

**Estimated Time**: 6-8 hours

---

## Phase 3: Polish & Extras (~2-3 days)

### 1. Image Upload
- expo-image-picker integration
- Avatar upload in ProfileScreen
- Food photos

**Estimated Time**: 6-8 hours

### 2. Legal/Help Screens
- PrivacyPolicyScreen
- TermsOfServiceScreen
- HelpScreen with FAQ

**Estimated Time**: 3-4 hours

### 3. Profile Switching
- ProfileSelectorDialog
- Switch between multiple pets
- Add profile from More screen

**Estimated Time**: 4-5 hours

---

## Implementation Order (Recommended)

### Day 1-2: Core Data Entry
1. ✅ AddMealDialog (3 hours)
2. ✅ SearchFoodScreen (4 hours)
3. ✅ AddFoodScreen (3 hours)
4. ✅ Navigation updates (2 hours)

**Deliverable**: Users can add meals and food

### Day 3: Activities & Training
5. ✅ AddActivityDialog (3 hours)
6. ✅ AddTrainingDialog (3 hours)
7. ✅ Testing and bug fixes (2 hours)

**Deliverable**: Full data entry capability

### Day 4-5: Edit & Delete
8. ✅ EditFoodDialog (3 hours)
9. ✅ Delete confirmations (2 hours)
10. ✅ Edit activity/training (3 hours)

**Deliverable**: Full CRUD operations

### Day 6-7: Settings & Charts
11. ✅ Settings screens (8 hours)
12. ✅ Charts integration (8 hours)

**Deliverable**: Complete app with analytics

### Day 8-9: Polish
13. ✅ Image upload (8 hours)
14. ✅ Legal screens (4 hours)
15. ✅ Profile switching (5 hours)

**Deliverable**: Production-ready app

---

## Quick Start Commands

### Create Required Directories
```bash
mkdir -p src/components/dialogs
mkdir -p src/screens/food
mkdir -p src/screens/settings
mkdir -p src/components/charts
```

### Install Additional Dependencies (if needed)
```bash
# For charts
npm install victory-native-xl --legacy-peer-deps

# For images
npx expo install expo-image-picker

# For date/time pickers (already installed)
# npx expo install @react-native-community/datetimepicker
```

---

## Component Template Example

### AddMealDialog.tsx Template
```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, TextInput, useTheme } from 'react-native-paper';
import { useAddMeal } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddMealDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: (mealId: string) => void;
  selectedDate?: Date;
}

export const AddMealDialog: React.FC<AddMealDialogProps> = ({
  visible,
  onDismiss,
  onSuccess,
  selectedDate = new Date(),
}) => {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const { mutate: addMeal, isLoading } = useAddMeal();

  const [date, setDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddMeal = () => {
    if (!currentProfile) return;

    addMeal(
      {
        userId: currentProfile.userId,
        profileId: currentProfile._id,
        date,
      },
      {
        onSuccess: (newMeal) => {
          onSuccess(newMeal._id);
          onDismiss();
        },
      }
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text variant="titleLarge">Add Meal</Text>

        {/* Date/Time Picker */}
        <Button onPress={() => setShowDatePicker(true)}>
          {date.toLocaleString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            mode="contained"
            onPress={handleAddMeal}
            loading={isLoading}
            disabled={isLoading}
          >
            Create Meal
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
});
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Can create meal from Home screen
- ✅ Can search food database
- ✅ Can add food to meal with portion
- ✅ Food appears in meal card immediately
- ✅ Can add activities with duration
- ✅ Can add training sessions
- ✅ All data persists and loads correctly

### Phase 2 Complete When:
- ✅ Can edit and delete all data types
- ✅ Settings screens functional
- ✅ Charts display real data
- ✅ App feels complete

### Phase 3 Complete When:
- ✅ Can upload images
- ✅ Legal screens available
- ✅ Can switch between profiles
- ✅ App is production-ready

---

## Notes

1. **All GraphQL hooks are ready** - No backend work needed
2. **UI components exist** - Reuse Button, TextInput, Card, etc.
3. **Patterns established** - Follow existing screen patterns
4. **Type safety maintained** - Keep full TypeScript coverage
5. **Testing on real device** - Use `npm run ios` or `npm run android`

**Start with AddMealDialog → SearchFoodScreen → AddFoodScreen for quickest wins!**

# Implementation Guide - Next Steps

## ✅ What's Been Completed

### 1. Project Setup
- ✅ `.env` file created (needs your actual credentials)
- ✅ Expo configuration (`app.json`, `babel.config.js`, `metro.config.js`)
- ✅ TypeScript configuration with path aliases
- ✅ All core infrastructure (types, theme, auth, GraphQL, etc.)

### 2. Authentication
- ✅ **LoginScreen** - Fully implemented with:
  - Email/password form
  - Input validation
  - Error handling
  - Loading states
  - Navigation to Signup/ForgotPassword

## 📋 Remaining Implementation Tasks

### Priority 1: Complete Auth Flow

#### SignupScreen
Location: `src/screens/auth/SignupScreen.tsx`

**Needs:**
- Email input
- Password input
- Confirm password input
- Password strength indicator
- Form validation
- Navigation to Login after success

**Example structure:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

// Validate passwords match
// Use getPasswordStrengthMessage() from utils/validation
// Call useAuth().register(email, password)
```

#### ForgotPasswordScreen
Location: `src/screens/auth/ForgotPasswordScreen.tsx`

**Needs:**
- Email input
- Send reset link button
- Success message
- Navigation back to Login

**Implementation:**
```typescript
const { sendPasswordReset } = useAuth();
await sendPasswordReset(email);
// Show success alert
navigation.navigate('Login');
```

#### RegisterScreen (Profile Creation)
Location: `src/screens/auth/RegisterScreen.tsx`

This screen appears AFTER signup to create the first pet profile.

**Needs:**
- Pet name input
- Pet weight input
- Pet breed input (dropdown or autocomplete)
- Pet date of birth (date picker)
- Pet size selection (small, medium, large, giant)
- Activity level selection
- Diet preset selection (BARF, PMR, custom)
- Avatar upload (camera/gallery)

**Implementation:**
```typescript
const { mutate: addProfile } = useAddProfile();
const { currentProfile } = useProfile();

// After creating profile, navigate to Main
```

### Priority 2: Main Screens

#### HomeScreen (Diary)
Location: `src/screens/main/HomeScreen.tsx`

**Core Features:**
1. Date selector (with prev/next day buttons)
2. Daily calorie goal display
3. Calorie progress bar
4. List of meals for the day (use MealCard component)
5. Add Meal button (FAB - Floating Action Button)
6. Each meal shows:
   - Time
   - Food items
   - Total calories
   - Delete meal option

**Data Flow:**
```typescript
const { currentProfile } = useProfile();
const [selectedDate, setSelectedDate] = useState(new Date());
const { data: meals } = useGetMealsForDate(userId, selectedDate, selectedDate);
const { data: foods } = useGetFoodForDate(userId, profileId, selectedDate);
const { mutate: addMeal } = useAddMeal();
```

#### ProfileScreen
Location: `src/screens/main/ProfileScreen.tsx`

**Features:**
1. Current profile display
2. Edit profile button
3. Switch profile (if multiple pets)
4. Add new profile button
5. Profile settings:
   - Name, weight, breed
   - Activity level
   - Daily calorie goal
   - Diet preferences
   - Avatar

**Implementation:**
```typescript
const { currentProfile, profiles } = useProfile();
const { mutate: updateProfile } = useUpdateProfile();
```

#### DashboardScreen
Location: `src/screens/main/DashboardScreen.tsx`

**Charts to Display:**
1. Weekly calorie chart (using Victory Native XL)
2. Category breakdown (pie chart)
3. Weight tracking over time
4. Activity summary

**Example with Victory:**
```typescript
import { CartesianChart, Bar } from 'victory-native-xl';

const { data: weeklyFood } = useGetFoodForPeriod(
  userId,
  profileId,
  weekStart,
  weekEnd
);

// Transform data for charts
const chartData = transformFoodToChartData(weeklyFood);
```

### Priority 3: Feature Components

#### MealCard
Location: `src/components/features/MealCard.tsx`

**Props:**
```typescript
interface MealCardProps {
  meal: Meal;
  foods: Food[];
  onDelete: (mealId: string) => void;
  onAddFood: (mealId: string) => void;
}
```

**Display:**
- Meal time
- List of food items
- Total calories
- Edit/Delete buttons

#### FoodCard
Location: `src/components/features/FoodCard.tsx`

**Props:**
```typescript
interface FoodCardProps {
  food: Food;
  onEdit: (foodId: string) => void;
  onDelete: (foodId: string) => void;
}
```

**Display:**
- Food name
- Weight/servings
- Calories
- Category icon/color

### Priority 4: Food Management Screens

#### SearchFoodScreen
Navigation: Modal from HomeScreen when adding food

**Features:**
- Search bar
- Category filters
- Food template list
- Custom food option
- Select food -> navigate to AddFoodScreen

#### AddFoodScreen
**Features:**
- Selected food template display
- Servings input
- Weight input
- Calculate calories
- Add to meal button

#### CreateNewFoodScreen
**Features:**
- Food name
- Category selection
- Nutritional info inputs
- Serving size
- Save as template

## 🚀 Quick Start Commands

### Install Expo Dependencies
```bash
npm install expo expo-status-bar
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-paper react-native-vector-icons
npm install @expo/vector-icons
npm install react-native-gesture-handler react-native-reanimated
npm install victory-native-xl
npm install expo-image-picker
npm install babel-plugin-module-resolver --save-dev
```

### Update Package.json Scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

### Run the Project
```bash
npx expo start
```

## 📝 Implementation Order

1. ✅ LoginScreen (DONE)
2. **SignupScreen** - Use LoginScreen as template
3. **ForgotPasswordScreen** - Simpler, just email input
4. **RegisterScreen** - Create first profile
5. **HomeScreen** - Core feature
6. **MealCard Component** - For HomeScreen
7. **ProfileScreen** - Profile management
8. **DashboardScreen** - Charts and stats

## 💡 Tips

### Using Existing Components
All UI components are ready to use:
```typescript
import { Button, TextInput, Card, Container } from '@components/ui';
```

### Form Validation
```typescript
import { isValidEmail, isValidPassword } from '@utils/validation';
import { ERROR_MESSAGES } from '@constants/index';
```

### Data Fetching
```typescript
import { useGetFoodForDate, useAddMeal } from '@hooks/useGraphQL';
```

### Navigation
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('ScreenName');
```

## 🐛 Common Issues

### Module Resolution
If imports don't work, make sure:
1. Babel plugin is installed
2. Metro bundler is restarted
3. Using `@` prefix (`@components/ui` not `../components/ui`)

### Environment Variables
Make sure `.env` has:
```
EXPO_PUBLIC_REALM_APP_ID=your_actual_id
EXPO_PUBLIC_GRAPHQL_ENDPOINT=your_actual_endpoint
```

### Type Errors
Run type checking:
```bash
npx tsc --noEmit
```

## 📚 Resources

- **LoginScreen Implementation**: See `src/screens/auth/LoginScreen.tsx` as reference
- **UI Components**: Check `src/components/ui/` for all available components
- **Types**: All TypeScript types in `src/types/index.ts`
- **Hooks**: All React Query hooks in `src/hooks/useGraphQL.ts`
- **Theme**: Colors and styles in `src/theme/index.ts`

---

**The foundation is complete. Start with SignupScreen using LoginScreen as your template!**

# Huppy Pet - React Native to Expo TypeScript Migration

Complete migration from React Web app to Expo with React Native Web support and full TypeScript implementation.

## 🎯 What's Been Done

All **core infrastructure** has been built and is ready to use:

### ✅ Complete Foundation
- **TypeScript Setup**: All types, interfaces, and type-safe hooks
- **Authentication**: Realm authentication with token refresh
- **GraphQL**: Complete query/mutation layer with React Query
- **Navigation**: React Navigation with type-safe routing
- **Theme**: Material Design 3 with light/dark mode support
- **State Management**: Context providers + React Query
- **Utilities**: Date, validation, calculations, image handling
- **UI Components**: Button, Input, Card, Text, Container

See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for full details.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Core dependencies
npm install

# Additional packages needed
npm install realm-web graphql-request @tanstack/react-query
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-paper react-native-safe-area-context react-native-gesture-handler
npm install expo-image-picker expo-camera
npm install victory-native-xl

# Dev dependencies
npm install --save-dev @types/react @types/react-native
```

### 2. Environment Configuration

Create `.env` file in the root:

```env
# Realm Configuration
EXPO_PUBLIC_REALM_APP_ID=your_realm_app_id_here

# GraphQL Configuration
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://your-realm-app.services.cloud.mongodb.com/api/client/v2.0/app/your-app-id/graphql

# Backend URL (for image uploads)
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com/api
```

### 3. Run the Project

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on web
npx expo start --web
```

## 📂 Project Structure

```
src/
├── components/ui/          # Reusable UI components
├── constants/              # App constants and config
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation setup
├── screens/              # Screen components
│   ├── auth/            # Authentication screens
│   └── main/            # Main app screens
├── services/             # External services
│   ├── api/             # API layer
│   ├── auth/            # Authentication
│   └── graphql/         # GraphQL setup
├── theme/               # Theme configuration
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## 🔧 Key Technologies

- **Expo**: React Native framework with great DX
- **TypeScript**: Full type safety
- **React Navigation**: Native navigation
- **React Query**: Server state management
- **React Native Paper**: Material Design components
- **Realm Web**: MongoDB Realm authentication
- **GraphQL Request**: GraphQL client
- **Victory Native XL**: Charts and data visualization

## 📱 Features to Implement

The foundation is ready. Here's what needs implementation:

### High Priority
1. **Authentication Screens** - Add forms to login/signup screens
2. **Home Screen** - Meal tracking, food diary
3. **Profile Screen** - Pet profile management
4. **Dashboard Screen** - Statistics and charts

### Medium Priority
5. **Feature Components** - MealCard, FoodCard, ActivityCard
6. **Food Management** - Add/edit/delete food items
7. **Image Handling** - Camera and gallery integration

### Lower Priority
8. **Offline Support** - Sync when back online
9. **Error Handling** - Better error boundaries
10. **Polish** - Animations, loading states

## 🎨 Design System

### Colors
The app uses Material Design 3 with a warm, pet-friendly palette:
- Primary: `#FF6B35` (Orange)
- Secondary: `#6C63FF` (Purple)
- Tertiary: `#00B4D8` (Blue)

### Typography
Material Design 3 typography scale:
- Display: 57px, 45px, 36px
- Headline: 32px, 28px, 24px
- Title: 22px, 16px, 14px
- Body: 16px, 14px, 12px
- Label: 14px, 12px, 11px

### Spacing
Consistent spacing using the theme:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## 🔐 Authentication Flow

```typescript
import { useAuth } from '@contexts/AuthContext';

function LoginScreen() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation happens automatically via RootNavigator
    } catch (error) {
      // Handle error
    }
  };
}
```

## 📊 Data Fetching

```typescript
import { useGetFoodForDate } from '@hooks/useGraphQL';

function HomeScreen() {
  const { user } = useAuth();
  const { currentProfile } = useProfile();
  const { data: foods, isLoading } = useGetFoodForDate(
    user?.id || '',
    currentProfile?._id || '',
    new Date()
  );

  // Use foods data
}
```

## 🎯 Navigation

```typescript
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '@navigation/types';

function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  // Type-safe navigation
  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npx tsc --noEmit

# Run linting
npm run lint
```

## 📝 Code Examples

### Using UI Components

```typescript
import { Button, TextInput, Card, Container } from '@components/ui';

function MyScreen() {
  return (
    <Container>
      <Card>
        <Card.Title title="My Card" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Button onPress={handleSubmit}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </Container>
  );
}
```

### Adding Mutations

```typescript
import { useAddFood } from '@hooks/useGraphQL';

function AddFoodScreen() {
  const { mutate: addFood, isLoading } = useAddFood();

  const handleAddFood = () => {
    addFood({
      name: 'Chicken Breast',
      weight: 100,
      calories: 165,
      // ... other fields
    });
  };
}
```

## 🐛 Common Issues

### Module Resolution
If you see import errors, make sure:
1. `tsconfig.json` has proper path aliases
2. You're using `@` prefix for imports (`@components/ui`, not `../components/ui`)

### Realm Authentication
Make sure:
1. `.env` file has correct `EXPO_PUBLIC_REALM_APP_ID`
2. Realm app is configured with email/password authentication

### GraphQL Errors
Check:
1. `EXPO_PUBLIC_GRAPHQL_ENDPOINT` is correct
2. User has valid access token
3. GraphQL schema matches your queries

## 📚 Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [MongoDB Realm](https://www.mongodb.com/docs/realm/)

## 🤝 Contributing

When implementing new features:
1. Follow the existing TypeScript patterns
2. Use the provided UI components
3. Add proper error handling
4. Test on iOS, Android, and Web
5. Keep components small and focused

## 📄 License

[Your License Here]

---

**Next Step**: Implement authentication screens! See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for the full roadmap.

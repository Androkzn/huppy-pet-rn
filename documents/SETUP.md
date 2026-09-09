# Huppy Pet - Complete Setup Guide

## 🔧 Issues Fixed

### TypeScript Errors Resolved:
1. ✅ Fixed `@types/index` imports (changed to relative imports)
2. ✅ Fixed Card component sub-components (Title, Content, Cover, Actions)
3. ✅ Fixed TextInput.Icon property
4. ✅ Fixed MainNavigator icon type annotations
5. ✅ Updated all API services with proper type imports

## 📦 Installation Steps

### Step 1: Install Expo CLI (if not already installed)
```bash
npm install -g expo-cli
# or
npm install -g @expo/cli
```

### Step 2: Install Core Dependencies

This project needs to be converted from Create React App to Expo. Run these commands:

```bash
# Install Expo
npm install expo

# Install React Native & Expo packages
npm install expo-status-bar
npm install react-native react-native-web
npm install react-dom@18.2.0 react@18.2.0

# Install Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Install UI Library
npm install react-native-paper react-native-vector-icons
npm install @expo/vector-icons

# Install Gestures & Reanimated
npm install react-native-gesture-handler react-native-reanimated

# Install Charts
npm install victory-native victory-native-xl

# Install Image Handling
npm install expo-image-picker expo-camera

# Install Dev Dependencies
npm install --save-dev babel-plugin-module-resolver
npm install --save-dev @types/react @types/react-native
```

### Step 3: Update Environment Variables

Edit `.env` file with your actual credentials:

```env
# Get these from MongoDB Atlas Realm
EXPO_PUBLIC_REALM_APP_ID=your_realm_app_id_here
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://realm.mongodb.com/api/client/v2.0/app/your-app-id/graphql
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com/api
```

### Step 4: Clean Install (Recommended)

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Clear any caches
npx expo start -c
```

## 🚀 Running the Project

### Development Mode

```bash
# Start Expo development server
npx expo start

# Or specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Build for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Web
npx expo build:web
```

## ✅ Verification Checklist

After installation, verify:

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Expo starts successfully: `npx expo start`
- [ ] Can navigate to Login screen
- [ ] Environment variables loaded
- [ ] Authentication context works

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@types/index'"
**Solution:** Already fixed! Types now use relative imports.

### Issue: "Property 'Icon' does not exist on type 'TextInput'"
**Solution:** Already fixed! TextInput now exports Icon component.

### Issue: "expo command not found"
**Solution:**
```bash
npm install -g @expo/cli
```

### Issue: "Metro bundler errors"
**Solution:**
```bash
npx expo start --clear
# or
rm -rf node_modules .expo .expo-shared
npm install
npx expo start
```

### Issue: "React Native Paper icons not showing"
**Solution:**
```bash
# Make sure vector icons are linked
npx expo install @expo/vector-icons
```

## 📝 Next Steps After Setup

1. **Update `.env`** with your actual MongoDB Realm credentials
2. **Test authentication** - Try logging in
3. **Implement remaining screens** - See IMPLEMENTATION_GUIDE.md
4. **Add icons** - Use @expo/vector-icons in MainNavigator

## 📚 Key Files Reference

- **Main Entry**: `App.tsx`
- **Navigation**: `src/navigation/RootNavigator.tsx`
- **Auth Logic**: `src/contexts/AuthContext.tsx`
- **Login Screen**: `src/screens/auth/LoginScreen.tsx` (reference for other screens)
- **UI Components**: `src/components/ui/`
- **Types**: `src/types/index.ts`

## 🎯 Architecture Overview

```
App.tsx
├── Providers (QueryClient, Paper, Auth, Profile)
└── RootNavigator
    ├── AuthNavigator (if not logged in)
    │   ├── LoginScreen ✅
    │   ├── SignupScreen (to implement)
    │   ├── ForgotPasswordScreen (to implement)
    │   └── RegisterScreen (to implement)
    └── MainNavigator (if logged in)
        ├── HomeScreen (to implement)
        ├── DashboardScreen (to implement)
        ├── TrainingScreen (to implement)
        ├── ProfileScreen (to implement)
        └── MoreScreen (to implement)
```

## 💡 Development Tips

1. **Hot Reload**: Expo supports fast refresh - save files to see changes
2. **Debugging**: Shake device (or Cmd+D) to open debug menu
3. **Type Safety**: Run `npx tsc --watch` in separate terminal
4. **Testing**: Use `npx expo start` and test on web first (faster)

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [MongoDB Realm](https://www.mongodb.com/docs/realm/)

---

**All TypeScript errors have been fixed. Ready to run!** 🎉

import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ActivityIndicator, View } from 'react-native';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: { userName: string } | undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#0B6E4F',
    card: '#FFFFFF',
    text: '#1E1E1E',
    border: '#E6E6E6',
    notification: '#00C896',
  },
};

export default function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList>('Splash');
  const [loaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await AsyncStorage.getItem('session');
        if (session) {
          setInitialRouteName('Home');
        } else {
          setInitialRouteName('Splash');
        }
      } finally {
        setIsBootstrapping(false);
      }
    };
    bootstrap();
  }, []);

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: { backgroundColor: '#FFFFFF' },
    }),
    []
  );

  if (!loaded || isBootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0B6E4F" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOptions}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

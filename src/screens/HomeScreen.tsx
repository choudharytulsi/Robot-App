import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { PrimaryButton } from '../components/Form';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
  const userName = route.params?.userName ?? 'User';

  const logout = async () => {
    await AsyncStorage.removeItem('session');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.subtitle}>Kamarta Robotics</Text>
      <View style={styles.logo} />
      <PrimaryButton title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 24, color: '#0B6E4F' },
  subtitle: { fontFamily: 'Poppins_400Regular', color: '#6B7280', marginTop: 4, marginBottom: 24 },
  logo: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#00C896', marginBottom: 24 },
});



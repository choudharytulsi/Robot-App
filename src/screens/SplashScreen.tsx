import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={["#E8FFF7", "#FFFFFF"]} style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.robot} />
        <Text style={styles.title}>Kamarta Robotics</Text>
        <Text style={styles.subtitle}>Smart AI for Modern Shops</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  robot: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0B6E4F',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#0B6E4F',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1E1E1E',
    opacity: 0.7,
    marginTop: 6,
  },
});



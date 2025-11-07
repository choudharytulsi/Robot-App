import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

type FormData = {
  identifier: string;
  newPassword: string;
  confirmPassword: string;
};

const emailOrPhone = /^((\+?\d{1,3})?\s?\d{10})|([\w-.]+@([\w-]+\.)+[\w-]{2,4})$/;

const schema = yup.object({
  identifier: yup.string().required('Required').matches(emailOrPhone, 'Enter a valid email or phone'),
  newPassword: yup.string().required('Required').min(8, 'Min 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Required'),
});

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glowing pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { identifier: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const onSubmit = (values: FormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password reset successfully! Please login with your new password.');
      navigation.replace('Login');
    }, 1200);
  };

  return (
    <LinearGradient colors={['#0A0E27', '#1A1F3A', '#0A0E27']} style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Text style={styles.binaryText}>0110001 00003 10013 38010 10101 01100</Text>
        <Text style={[styles.binaryText, { top: 100, opacity: 0.3 }]}>10011 00110 11001 01010 00111 10000</Text>
        <Text style={[styles.binaryText, { top: 200, opacity: 0.2 }]}>01001 11000 00110 10100 01101 11011</Text>
        <View style={styles.circuitLine1} />
        <View style={styles.circuitLine2} />
        <View style={styles.circuitLine3} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* K Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ translateY: floatTranslateY }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.kLogo,
              {
                shadowOpacity: glowOpacity,
              },
            ]}
          >
            <Text style={styles.kText}>K</Text>
          </Animated.View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email or phone to reset password</Text>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Controller
            control={control}
            name="identifier"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email or Phone"
                  keyboardType="default"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                {errors.identifier && <Text style={styles.errorText}>{errors.identifier.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="New Password"
                  secureTextEntry={secure}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeIcon}>
                  <Text style={styles.eyeIconText}>{secure ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Confirm New Password"
                  secureTextEntry={secure2}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecure2(!secure2)} style={styles.eyeIcon}>
                  <Text style={styles.eyeIconText}>{secure2 ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
              </View>
            )}
          />

          {/* Reset Button */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.resetButton}>
            <LinearGradient
              colors={['#00C896', '#0099CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footerLink}>
            <Text style={styles.footerTextNormal}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.footerTextLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  binaryText: {
    position: 'absolute',
    color: '#00C896',
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    letterSpacing: 2,
    left: 20,
    top: 50,
    opacity: 0.4,
  },
  circuitLine1: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#00C896',
    opacity: 0.2,
    transform: [{ rotate: '15deg' }],
  },
  circuitLine2: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#00C896',
    opacity: 0.15,
    transform: [{ rotate: '-10deg' }],
  },
  circuitLine3: {
    position: 'absolute',
    top: 450,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#00C896',
    opacity: 0.1,
    transform: [{ rotate: '5deg' }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  kLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  kText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: '#0A0E27',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  formCard: {
    backgroundColor: 'rgba(26, 31, 58, 0.85)',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 150, 0.3)',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 150, 0.3)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIconText: {
    fontSize: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
    marginLeft: 4,
  },
  resetButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  gradientButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTextNormal: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  footerTextLink: {
    color: '#00C896',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});


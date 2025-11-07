import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().required('Required').email('Invalid email'),
  password: yup.string().required('Required').min(8, 'Min 8 characters'),
});

export default function LoginScreen({ navigation }: Props) {
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const eyeBlink = useRef(new Animated.Value(1)).current;

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

    // Eye blink animation
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlink, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(eyeBlink, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(blinkInterval);
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
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = (values: FormData) => {
    setLoading(true);
    setTimeout(async () => {
      await AsyncStorage.setItem('session', JSON.stringify({ name: 'User' }));
      setLoading(false);
      navigation.replace('Home', { userName: 'User' });
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
        {/* Robot Logo */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.robotLogo,
              {
                transform: [{ translateY: floatTranslateY }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.robotHead,
                {
                  shadowOpacity: glowOpacity,
                },
              ]}
            >
              <View style={styles.robotAntenna} />
              <View style={[styles.robotAntenna, { right: 18 }]} />
              <Animated.View
                style={[
                  styles.robotEye,
                  styles.robotEyeLeft,
                  {
                    opacity: eyeBlink,
                    transform: [{ scaleY: eyeBlink }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.robotEye,
                  styles.robotEyeRight,
                  {
                    opacity: eyeBlink,
                    transform: [{ scaleY: eyeBlink }],
                  },
                ]}
              />
              <View style={styles.robotMouth} />
            </Animated.View>
          </Animated.View>
          <Text style={styles.appName}>Kamarta Robotics</Text>
          <Text style={styles.screenTitle}>Login</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email or Phone"
                  keyboardType="email-address"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Password"
                  secureTextEntry={secure}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.showHide}>
                  <Text style={styles.showHideText}>{secure ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {/* Remember Me */}
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.rememberMe}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.loginButton}>
            <LinearGradient
              colors={['#00C896', '#0099CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              onPress={() => {
                // Google login handler
                Alert.alert('Google Login', 'Google login functionality will be implemented');
              }}
              style={[styles.socialButton, styles.googleButton]}
            >
              <Text style={styles.socialButtonText}>🔍 Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Facebook login handler
                Alert.alert('Facebook Login', 'Facebook login functionality will be implemented');
              }}
              style={[styles.socialButton, styles.facebookButton]}
            >
              <Text style={styles.socialButtonText}>👤 Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Instagram login handler
                Alert.alert('Instagram Login', 'Instagram login functionality will be implemented');
              }}
              style={[styles.socialButton, styles.instagramButton]}
            >
              <Text style={styles.socialButtonText}>📸 Continue with Instagram</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.replace('Signup')}>
              <Text style={styles.footerText}>
                <Text style={styles.footerTextNormal}>Don't have yor account? </Text>
                <Text style={styles.footerTextLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.footerTextLink}>Forgot Password</Text>
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
    marginBottom: 40,
    paddingTop: 20,
    paddingBottom: 10,
  },
  robotLogo: {
    width: 80,
    height: 100,
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  robotHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C896',
    alignSelf: 'center',
    position: 'relative',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  robotAntenna: {
    position: 'absolute',
    top: -12,
    width: 4,
    height: 14,
    backgroundColor: '#00C896',
    borderRadius: 2,
    left: 18,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  robotEye: {
    position: 'absolute',
    top: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A0E27',
  },
  robotEyeLeft: {
    left: 16,
  },
  robotEyeRight: {
    right: 16,
  },
  robotMouth: {
    position: 'absolute',
    bottom: 18,
    width: 20,
    height: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: '#0A0E27',
    borderTopWidth: 0,
    left: 20,
  },
  appName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  screenTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1E1E1E',
  },
  showHide: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  showHideText: {
    color: '#00C896',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
    marginLeft: 4,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00C896',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#00C896',
  },
  checkmark: {
    color: '#0A0E27',
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
  },
  rememberMeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  gradientButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#9CA3AF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(66, 133, 244, 0.5)',
  },
  facebookButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(24, 119, 242, 0.5)',
  },
  instagramButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(225, 48, 108, 0.5)',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Poppins_400Regular',
  },
  footerTextNormal: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerTextLink: {
    color: '#00C896',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});



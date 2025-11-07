import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type FormData = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  fullName: yup.string().required('Required'),
  email: yup.string().required('Required').email('Invalid email'),
  mobile: yup.string().required('Required').matches(/^\d{10}$/,'10 digits only'),
  password: yup.string().required('Required').min(8,'Min 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')],'Passwords must match').required('Required'),
});

export default function SignupScreen({ navigation }: Props) {
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'Email' | 'Phone'>('Email');

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation for logo
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

    // Logo scale pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
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
    defaultValues: { fullName: '', email: '', mobile: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const onSubmit = (values: FormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Account created! Please login.');
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
              transform: [
                { translateY: floatTranslateY },
                { scale: logoScale },
              ],
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
        <Text style={styles.title}>Create Your Account</Text>

        {/* Email/Phone Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setSignupMethod('Email')}
            style={[styles.toggleOption, signupMethod === 'Email' && styles.toggleOptionActive]}
          >
            <Text style={[styles.toggleText, signupMethod === 'Email' && styles.toggleTextActive]}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSignupMethod('Phone')}
            style={[styles.toggleOption, signupMethod === 'Phone' && styles.toggleOptionActive]}
          >
            <Text style={[styles.toggleText, signupMethod === 'Phone' && styles.toggleTextActive]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { value, onChange } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
              </View>
            )}
          />

          {signupMethod === 'Email' ? (
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>
              )}
            />
          ) : (
            <Controller
              control={control}
              name="mobile"
              render={({ field: { value, onChange } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                  />
                  {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}
                </View>
              )}
            />
          )}

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
                <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeIcon}>
                  <Text style={styles.eyeIconText}>{secure ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
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
                  placeholder="Confirm Password"
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

          {/* Register Button */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.registerButton}>
            <LinearGradient
              colors={['#00C896', '#0099CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footerLink}>
            <Text style={styles.footerTextNormal}>Already have an account? </Text>
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
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginHorizontal: 20,
  },
  toggleOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  toggleOptionActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00C896',
  },
  toggleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#9CA3AF',
  },
  toggleTextActive: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#00C896',
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
  registerButton: {
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
  registerButtonText: {
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



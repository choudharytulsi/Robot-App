import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

type InputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  leftIcon?: React.ReactNode;
  right?: React.ReactNode;
  error?: string;
};

export function InputField({ value, onChangeText, placeholder, keyboardType, secureTextEntry, right, error }: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={[styles.inputWrap, error && { borderColor: '#D93025' }]}> 
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        {right}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ title, onPress, loading, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity disabled={!!loading} onPress={onPress} style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}>
      {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    color: '#1E1E1E',
  },
  errorText: {
    marginTop: 4,
    color: '#D93025',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B6E4F',
  },
  buttonSecondary: {
    backgroundColor: '#1E1E1E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});



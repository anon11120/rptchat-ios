import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { RPTChat } from '../services/RPTChatService';

const AuthScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    const result = await RPTChat.sendCode(phoneNumber);
    setLoading(false);

    if (result.success) {
      setPhoneCodeHash(result.phone_code_hash);
      setStep('code');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const signIn = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setLoading(true);
    const result = await RPTChat.signIn(phoneNumber, phoneCodeHash, verificationCode);
    setLoading(false);

    if (result.success) {
      navigation.replace('Main');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RPTChat</Text>
        <Text style={styles.subtitle}>Rapture Chat - Advanced Messaging</Text>
      </View>

      <View style={styles.form}>
        {step === 'phone' ? (
          <>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Code'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="12345"
              keyboardType="number-pad"
              maxLength={5}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={signIn}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={styles.link}>Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningText}>
          ⚠️ This is an experimental client. Use at your own risk.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 5,
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#8b5cf6',
    textAlign: 'center',
    fontSize: 16,
  },
  warning: {
    backgroundColor: '#f59e0b',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  warningText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AuthScreen;

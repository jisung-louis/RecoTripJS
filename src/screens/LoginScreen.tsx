import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBackButton from '../components/CustomBackButton';

const THEME_COLOR = '#1CB5A3';
const DEEP_COLOR = '#197C6B';

const LoginScreen = ({ navigation }: any) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
        // Firestore에 닉네임 저장
        await firestore().collection('users').doc(userCredential.user.uid).set({
          nickname: nickname.trim(),
          email: email.trim(),
        });
        Alert.alert('회원가입 완료', '이메일로 회원가입이 완료되었습니다.');
      } else {
        await auth().signInWithEmailAndPassword(email.trim(), password);
      }
      navigation.goBack();
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다.');
      else if (e.code === 'auth/invalid-email') setError('유효하지 않은 이메일입니다.');
      else if (e.code === 'auth/weak-password') setError('비밀번호는 6자 이상이어야 합니다.');
      else if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      else setError('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* 로고/타이틀 */}
          <View style={styles.logoBox}>
            <Icon name="airplane-outline" size={48} color={THEME_COLOR} style={{ marginBottom: 8 }} />
            <Text style={styles.title}>RecoTrip</Text>
            <Text style={styles.subtitle}>{isSignUp ? '회원가입' : '로그인'}</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.formBox}>
            {isSignUp && (
              <TextInput
                style={styles.input}
                placeholder="닉네임"
                placeholderTextColor="#B6F2E6"
                value={nickname}
                onChangeText={setNickname}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#B6F2E6"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#B6F2E6"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading || !email || !password || (isSignUp && !nickname)}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>{isSignUp ? '회원가입' : '로그인'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              <Text style={styles.switchText}>
                {isSignUp ? '이미 계정이 있으신가요? ' : '아직 회원이 아니신가요? '}
                <Text style={{ color: THEME_COLOR, fontWeight: 'bold' }}>{isSignUp ? '로그인' : '회원가입'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F6FDFD',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: DEEP_COLOR,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 18,
    color: THEME_COLOR,
    marginBottom: 8,
    fontWeight: '500',
  },
  formBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME_COLOR,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    color: DEEP_COLOR,
    backgroundColor: '#F6FDFD',
  },
  authButton: {
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 6,
  },
  switchText: {
    color: '#197C6B',
    fontSize: 15,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default LoginScreen; 
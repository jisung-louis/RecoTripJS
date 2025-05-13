import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Alert } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      // const dark = await AsyncStorage.getItem('darkMode');
      // if (dark !== null) setDarkMode(dark === 'true');
      // const notif = await AsyncStorage.getItem('notifications');
      // if (notif !== null) setNotifications(notif === 'true');
    })();
  }, []);

  const toggleDarkMode = async () => {
    setDarkMode((prev) => {
      // AsyncStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  const toggleNotifications = async () => {
    setNotifications((prev) => {
      // AsyncStorage.setItem('notifications', (!prev).toString());
      return !prev;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>환경설정</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>다크모드</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#B6F2E6', true: '#1CB5A3' }}
            thumbColor={darkMode ? '#197C6B' : '#fff'}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>알림 설정</Text>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#B6F2E6', true: '#1CB5A3' }}
            thumbColor={notifications ? '#197C6B' : '#fff'}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainStack', { screen: 'PrivacyPolicy' })}
        >
          <Text style={styles.buttonText}>개인정보 처리방침</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainStack', { screen: 'TermsOfService' })}
        >
          <Text style={styles.buttonText}>이용약관</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#F6FDFD',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginTop: 10,
  },
  container: {
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 17,
    color: '#197C6B',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E0F7F3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#197C6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 
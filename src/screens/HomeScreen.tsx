import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type HomeScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <LinearGradient colors={['#A1C4FD', '#C2E9FB']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>RecoTrip</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
            >
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>

          {/* 메인 컨텐츠 */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              당신만의 특별한 여행을{'\n'}시작해보세요
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('MainStack', { screen: 'Start' })}
            >
              <Text style={styles.startButtonText}>출발하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
  },
});

export default HomeScreen; 
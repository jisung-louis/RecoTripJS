import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import DefaultProfile from './DefaultProfile';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type CustomDrawerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomDrawer = (props: any) => {
  const navigation = useNavigation<CustomDrawerNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      setUser(user);
      if (user) {
        // Firestore에서 닉네임 불러오기
        try {
          const doc = await firestore().collection('users').doc(user.uid).get();
          setNickname(doc.exists() ? doc.data()?.nickname || '' : '');
        } catch (e) {
          setNickname('');
        }
      } else {
        setNickname('');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {/* 프로필 섹션 */}
        <TouchableOpacity
          style={styles.profileSection}
          activeOpacity={0.8}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('MainStack', { screen: 'Profile' });
            } else {
              navigation.navigate('MainStack', { screen: 'Login' });
            }
          }}
        >
          {isLoggedIn && user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={[styles.profileImage, { borderWidth: 2, borderColor: '#1CB5A3' }]}
            />
          ) : (
            <DefaultProfile />
          )}
          <Text style={styles.profileName}>
            {isLoggedIn ? nickname || '닉네임 없음' : '로그인'}
          </Text>
        </TouchableOpacity>

        {/* 메뉴 아이템들 */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MainStack', { screen: 'MyPlan' })}
          >
            <Text style={styles.menuText}>내 플랜</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate('MainStack', { screen: 'Board' });
              } else {
                Alert.alert('로그인이 필요합니다');
                navigation.navigate('MainStack', { screen: 'Login' });
              }
            }}
          >
            <Text style={styles.menuText}>게시판</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MainStack', { screen: 'Settings' })}
          >
            <Text style={styles.menuText}>환경 설정</Text>
          </TouchableOpacity>

          {isLoggedIn && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Text style={[styles.menuText, styles.logoutText]}>로그아웃</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  menuSection: {
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#ff3b30',
  },
});

export default CustomDrawer; 
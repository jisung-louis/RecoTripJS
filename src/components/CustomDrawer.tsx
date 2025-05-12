import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import DefaultProfile from './DefaultProfile';

type CustomDrawerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomDrawer = (props: any) => {
  const navigation = useNavigation<CustomDrawerNavigationProp>();
  const isLoggedIn = false; // TODO: 실제 로그인 상태로 변경

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          {isLoggedIn ? (
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
          ) : (
            <DefaultProfile />
          )}
          <TouchableOpacity
            onPress={() => {
              // TODO: 로그인/프로필 화면으로 이동
            }}
          >
            <Text style={styles.profileName}>
              {isLoggedIn ? '사용자 닉네임' : '로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 메뉴 아이템들 */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyPlan')}
          >
            <Text style={styles.menuText}>내 플랜</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 게시판 화면으로 이동
            }}
          >
            <Text style={styles.menuText}>게시판</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 환경설정 화면으로 이동
            }}
          >
            <Text style={styles.menuText}>환경 설정</Text>
          </TouchableOpacity>

          {isLoggedIn && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // TODO: 로그아웃 처리
              }}
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
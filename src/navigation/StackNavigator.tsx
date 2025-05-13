import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import KeywordScreen from '../screens/KeywordScreen';
import CityScreen from '../screens/CityScreen';
import CityDetailScreen from '../screens/CityDetailScreen';
import LandmarkScreen from '../screens/LandmarkScreen';
import RouteScreen from '../screens/RouteScreen';
import LodgingScreen from '../screens/LodgingScreen';
import FinalScreen from '../screens/FinalScreen';
import MyPlanScreen from '../screens/MyPlanScreen';
import CustomDrawer from '../components/CustomDrawer';
import StartScreen from '../screens/StartScreen';
import TripStepScreen from '../screens/TripStepScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyPlanDetailScreen from '../screens/MyPlanDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BoardScreen from '../screens/BoardScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import PostEditScreen from '../screens/PostEditScreen';
import PostWriteScreen from '../screens/PostWriteScreen';

const { width } = Dimensions.get('window');

export type RootStackParamList = {
  Home: undefined;
  MainStack: {
    screen: 'Home' | 'Start' | 'Keyword' | 'City' | 'CityDetail' | 'Landmark' | 'Route' | 'Lodging' | 'Final' | 'MyPlan' | 'TripStep' | 'Login' | 'Profile' | 'MyPlanDetail' | 'Settings' | 'Board' | 'PostDetail' | 'TermsOfService' | 'PrivacyPolicy' | 'PostEdit' | 'PostWrite';
    params?: any;
  };
  Start: undefined;
  Keyword: undefined;
  City: undefined;
  CityDetail: { city: string };
  Landmark: undefined;
  Route: undefined;
  Lodging: undefined;
  Final: undefined;
  MyPlan: undefined;
  MyPlanDetail: { plan: any };
  TripStep: undefined;
  Login: undefined;
  Profile: undefined;
  Settings: undefined;
  Board: undefined;
  PostDetail: { postId: string };
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  PostEdit: { postId: string };
  PostWrite: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Keyword" component={KeywordScreen} />
      <Stack.Screen name="City" component={CityScreen} />
      <Stack.Screen name="CityDetail" component={CityDetailScreen} />
      <Stack.Screen name="Landmark" component={LandmarkScreen} />
      <Stack.Screen name="Route" component={RouteScreen} />
      <Stack.Screen name="Lodging" component={LodgingScreen} />
      <Stack.Screen name="Final" component={FinalScreen} />
      <Stack.Screen name="MyPlan" component={MyPlanScreen} />
      <Stack.Screen name="TripStep" component={TripStepScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyPlanDetail" component={MyPlanDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />
      <Stack.Screen name="PostWrite" component={PostWriteScreen} />
    </Stack.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: width * 0.8,
          backgroundColor: '#fff',
        },
        overlayColor: 'rgba(0, 0, 0, 0.7)',
        swipeEnabled: false,
        swipeEdgeWidth: 50,
        drawerPosition: 'right',
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen 
        name="MainStack" 
        component={MainStack} 
        options={{ 
          headerShown: false,
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
};

export default StackNavigator; 
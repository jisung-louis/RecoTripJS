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

const { width } = Dimensions.get('window');

export type RootStackParamList = {
  Home: undefined;
  MainStack: {
    screen: 'Home' | 'Start' | 'Keyword' | 'City' | 'CityDetail' | 'Landmark' | 'Route' | 'Lodging' | 'Final' | 'MyPlan' | 'TripStep';
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
  TripStep: undefined;
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
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Dimensions, Platform } from 'react-native';
import MapView, { Polyline, Marker, LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useTripStore } from '../store/useTripStore';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { Modal, ScrollView, Button } from 'react-native';

const { width } = Dimensions.get('window');

// 더미 일정 및 위치 데이터
const DUMMY_PLAN = [
  {
    day: 1,
    places: [
      { name: '도쿄 타워', latlng: { latitude: 35.6586, longitude: 139.7454 } },
      { name: '하라주쿠', latlng: { latitude: 35.6702, longitude: 139.7020 } },
    ],
    lodging: { name: '호텔A', latlng: { latitude: 35.6895, longitude: 139.6917 } },
  },
  {
    day: 2,
    places: [
      { name: '아사쿠사', latlng: { latitude: 35.7148, longitude: 139.7967 } },
      { name: '시부야 스크램블', latlng: { latitude: 35.6595, longitude: 139.7005 } },
      { name: '우에노 공원', latlng: { latitude: 35.7156, longitude: 139.7745 } },
    ],
    lodging: { name: '호텔C', latlng: { latitude: 35.6895, longitude: 139.6917 } },
  },
  {
    day: 3,
    places: [
      { name: '도쿄 국립박물관', latlng: { latitude: 35.7188, longitude: 139.7765 } },
      { name: '오다이바', latlng: { latitude: 35.6272, longitude: 139.7768 } },
    ],
    lodging: { name: '호텔E', latlng: { latitude: 35.6895, longitude: 139.6917 } },
  },
];

// 지도에 표시할 모든 경로(관광지+숙소) 좌표 추출
const getAllRouteCoords = () => {
  const coords: LatLng[] = [];
  DUMMY_PLAN.forEach((day) => {
    day.places.forEach((p) => coords.push(p.latlng));
    coords.push(day.lodging.latlng);
  });
  return coords;
};

const FinalScreen = () => {
  const routeCoords = getAllRouteCoords();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const tripState = useTripStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>여행 플랜 요약</Text>
      </View>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: 35.6895,
          longitude: 139.6917,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Polyline
          coordinates={routeCoords}
          strokeColor="#1CB5A3"
          strokeWidth={4}
        />
        {routeCoords.map((coord, idx) => (
          <Marker key={idx} coordinate={coord} pinColor={idx % 2 === 0 ? '#1CB5A3' : '#5CB8B2'} />
        ))}
      </MapView>
      <FlatList
        data={DUMMY_PLAN}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.day}일차</Text>
            {item.places.map((place, idx) => (
              <Text key={idx} style={styles.placeText}>• {place.name}</Text>
            ))}
            <Text style={styles.lodgingTitle}>숙소: {item.lodging.name}</Text>
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <CustomButton
          title="저장하기"
          type="primary"
          onPress={() => setModalVisible(true)}
          style={styles.saveButton}
        />
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', maxHeight: '80%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: '#197C6B' }}>스토어 저장값 미리보기</Text>
            <ScrollView style={{ maxHeight: 350 }}>
              <Text style={{ fontSize: 13, color: '#333' }}>{JSON.stringify(tripState, null, 2)}</Text>
            </ScrollView>
            <Button
              title="확인하고 홈으로"
              onPress={() => {
                setModalVisible(false);
                tripState.clearTrip();
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'MainStack', params: { screen: 'Home' } }
                  ],
                });
              }}
              color="#1CB5A3"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F6FDFD',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginLeft: 12,
  },
  map: {
    width: width,
    height: 220,
    borderRadius: 18,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1CB5A3',
    marginBottom: 8,
  },
  placeText: {
    fontSize: 15,
    color: '#197C6B',
    marginBottom: 4,
  },
  lodgingTitle: {
    fontSize: 15,
    color: '#5CB8B2',
    marginTop: 6,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F6FDFD',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    width: '100%',
  },
});

export default FinalScreen; 
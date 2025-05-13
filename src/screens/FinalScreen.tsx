import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Dimensions, Platform } from 'react-native';
import MapView, { Polyline, Marker, LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useTripStore, Place, RouteDay } from '../store/useTripStore';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { Modal, ScrollView, Button } from 'react-native';

const { width } = Dimensions.get('window');

interface PlanPlace {
  name: string;
  latlng: LatLng | null;
}
interface PlanDay {
  day: number;
  places: PlanPlace[];
  lodging: { name: string; latlng: LatLng | null } | null;
}

// 실제 일정, 관광지, 숙소 데이터를 기반으로 지도 경로 및 리스트 생성
const getPlanData = (routes: RouteDay[], landmarks: Place[], lodging: { [day: number]: any }): PlanDay[] => {
  return routes.map((route: RouteDay) => {
    const places: PlanPlace[] = route.places.map((name: string) => {
      const found = landmarks.find((p: Place) => p.name === name);
      return found
        ? { name: found.name, latlng: { latitude: found.location.lat, longitude: found.location.lng } }
        : { name, latlng: null };
    });
    // day별 숙소 정보
    let lodgingInfo: { name: string; latlng: LatLng | null } | null = null;
    const hotel = lodging && lodging[route.day];
    if (hotel) {
      lodgingInfo = {
        name: hotel.name,
        latlng: hotel.location
          ? { latitude: hotel.location.lat, longitude: hotel.location.lng }
          : null,
      };
    }
    return { day: route.day, places, lodging: lodgingInfo };
  });
};

const getAllRouteCoords = (plan: PlanDay[]): LatLng[] => {
  const coords: LatLng[] = [];
  plan.forEach((day: PlanDay) => {
    day.places.forEach((p: PlanPlace) => p.latlng && coords.push(p.latlng));
    if (day.lodging && day.lodging.latlng) coords.push(day.lodging.latlng);
  });
  return coords;
};

const FinalScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const tripState = useTripStore();
  const { routes, selectedLandmarks, selectedLodging } = tripState;

  // 실제 데이터 기반 플랜 생성
  const plan: PlanDay[] = getPlanData(routes, selectedLandmarks, selectedLodging);
  const routeCoords: LatLng[] = getAllRouteCoords(plan);
  const [modalVisible, setModalVisible] = useState(false);

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
          latitude: routeCoords[0]?.latitude || 35.6895,
          longitude: routeCoords[0]?.longitude || 139.6917,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Polyline
          coordinates={routeCoords}
          strokeColor="#1CB5A3"
          strokeWidth={4}
        />
        {routeCoords.map((coord: LatLng, idx: number) => (
          <Marker key={idx} coordinate={coord} pinColor={idx % 2 === 0 ? '#1CB5A3' : '#5CB8B2'} />
        ))}
      </MapView>
      <FlatList
        data={plan}
        keyExtractor={(item: PlanDay) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }: { item: PlanDay }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.day}일차</Text>
            {item.places.map((place: PlanPlace, idx: number) => (
              <Text key={idx} style={styles.placeText}>• {place.name}</Text>
            ))}
            {item.lodging && item.lodging.name && (
              <Text style={styles.lodgingTitle}>숙소: {item.lodging.name}</Text>
            )}
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
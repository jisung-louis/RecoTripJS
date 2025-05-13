import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Dimensions, Platform, Image, TouchableOpacity, Modal, ScrollView, Button } from 'react-native';
import MapView, { Polyline, Marker, LatLng, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useTripStore, Place, RouteDay, Hotel } from '../store/useTripStore';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// 직접 타입 정의
interface MapViewRef {
  animateToRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }, duration: number) => void;
}

interface MarkerRef {
  showCallout: () => void;
}

interface PlanPlace {
  name: string;
  latlng: LatLng | null;
  photo?: string | null;
  address?: string;
  rating?: number;
}
interface PlanDay {
  day: number;
  places: PlanPlace[];
  lodging: (Hotel & { latlng: LatLng | null }) | null;
}

// 더 구분감 있는 색상
const POLYLINE_COLORS = ['#1976D2', '#C62828', '#2E7D32', '#F9A825', '#6A1B9A', '#00838F', '#FF7043', '#7B1FA2'];

const getPlanData = (routes: RouteDay[], landmarks: Place[], lodging: { [day: number]: Hotel }): PlanDay[] => {
  return routes.map((route: RouteDay) => {
    const places: PlanPlace[] = route.places.map((name: string) => {
      const found = landmarks.find((p: Place) => p.name === name);
      return found
        ? {
            name: found.name,
            latlng: { latitude: found.location.lat, longitude: found.location.lng },
            photo: found.photo,
            address: found.address,
            rating: found.rating,
          }
        : { name, latlng: null };
    });
    let lodgingInfo: (Hotel & { latlng: LatLng | null }) | null = null;
    const hotel = lodging && lodging[route.day];
    if (hotel) {
      lodgingInfo = {
        ...hotel,
        latlng: hotel.location
          ? { latitude: hotel.location.lat, longitude: hotel.location.lng }
          : null,
      };
    }
    return { day: route.day, places, lodging: lodgingInfo };
  });
};

// Polyline 경로: [전날 숙소, ...관광지, 오늘 숙소]
const getAllRouteCoords = (plan: PlanDay[]): LatLng[][] => {
  return plan.map((day: PlanDay, idx: number) => {
    const coords: LatLng[] = [];
    // 2일차부터는 전날 숙소에서 출발
    if (idx > 0) {
      const prevLodging = plan[idx - 1].lodging;
      if (prevLodging?.latlng) {
        coords.push(prevLodging.latlng);
      }
    }
    day.places.forEach((p: PlanPlace) => {
      if (p.latlng) {
        coords.push(p.latlng);
      }
    });
    if (day.lodging?.latlng) {
      coords.push(day.lodging.latlng);
    }
    return coords;
  });
};

const FinalScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const tripState = useTripStore();
  const { routes, selectedLandmarks, selectedLodging, tripName, startDate, endDate, selectedPeople, selectedKeywords } = tripState;

  const plan: PlanDay[] = getPlanData(routes, selectedLandmarks, selectedLodging);
  const routeCoords: LatLng[][] = getAllRouteCoords(plan);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  // 지도/마커 ref 관리
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: MarkerRef | null }>({});

  // 모든 마커 좌표 수집
  useEffect(() => {
    if (!mapRef.current) return;
    // 모든 관광지/숙소 좌표
    const allCoords: LatLng[] = plan.flatMap(day => [
      ...day.places.filter(p => p.latlng).map(p => p.latlng as LatLng),
      ...(day.lodging?.latlng ? [day.lodging.latlng] : []),
    ]);
    if (allCoords.length > 0) {
      setTimeout(() => {
        (mapRef.current as any).fitToCoordinates(allCoords, {
          edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
          animated: false,
        });
      }, 400);
    }
  }, [plan.length]);

  // 리스트에서 관광지 클릭 시 해당 마커로 이동 및 Callout 오픈
  const focusMarker = (dayIdx: number, placeIdx: number, latlng: LatLng | null) => {
    if (!mapRef.current) return;
    // 해당 일차의 모든 마커 좌표 구하기
    const dayPlan = plan[dayIdx];
    const coords: LatLng[] = [
      ...dayPlan.places.filter(p => p.latlng).map(p => p.latlng as LatLng),
    ]; // 관광지
    if (dayPlan.lodging?.latlng) coords.push(dayPlan.lodging.latlng); // 숙소
    if (coords.length > 0) {
      // fitToCoordinates로 모든 마커가 보이게 하고, 클릭한 마커가 중심에 오도록 edgePadding 조정
      (mapRef.current as any).fitToCoordinates(coords, {
        edgePadding: {
          top: 80,
          bottom: 80,
          left: 80,
          right: 80,
        },
        animated: true,
      });
      // 클릭한 마커 Callout 오픈 (약간의 딜레이)
      const refKey = `place-${dayIdx}-${placeIdx}`;
      setTimeout(() => {
        markerRefs.current[refKey]?.showCallout();
      }, 600);
    }
  };

  // 선택된 날짜의 경로만 표시
  const getFilteredRouteCoords = () => {
    if (selectedDay === null) return routeCoords;
    return [routeCoords[selectedDay]];
  };

  // 선택된 날짜의 마커만 표시
  const getFilteredMarkers = () => {
    if (selectedDay === null) return plan;
    return [plan[selectedDay]];
  };

  // 지도 확대 버튼 클릭 시에만 모달 오픈
  const handleExpandMap = () => setMapModalVisible(true);

  // n일차 텍스트 클릭 시 해당 일차만 지도에 표시, 다시 누르면 전체 표시
  const handleDayTitlePress = (index: number) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      {/* 1. 여행 요약 카드 + BackButton */}
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>여행 플랜 요약</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{tripName || '여행 플랜'}</Text>
        <Text style={styles.summaryText}>
          {startDate ? new Date(startDate).toLocaleDateString() : ''} ~ {endDate ? new Date(endDate).toLocaleDateString() : ''} | {selectedPeople.length}명
        </Text>
        <Text style={styles.summaryText}>
          {selectedKeywords.map(k => `#${k}`).join(' ')}
        </Text>
      </View>
      {/* 2. 지도 개선 */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={{
            latitude: routeCoords[0]?.[0]?.latitude || 35.6895,
            longitude: routeCoords[0]?.[0]?.longitude || 139.6917,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          {getFilteredRouteCoords().map((coords, idx) => (
            coords.length > 1 && (
              <Polyline
                key={idx}
                coordinates={coords}
                strokeColor={POLYLINE_COLORS[(selectedDay ?? idx) % POLYLINE_COLORS.length]}
                strokeWidth={4}
              />
            )
          ))}
          {getFilteredMarkers().map((day, dayIdx) => (
            <React.Fragment key={day.day}>
              {day.places.map((place, idx) =>
                place.latlng ? (
                  <Marker
                    ref={(ref: MarkerRef | null) => {
                      if (ref) {
                        markerRefs.current[`place-${dayIdx}-${idx}`] = ref;
                      }
                    }}
                    key={`place-${dayIdx}-${idx}`}
                    coordinate={place.latlng}
                    pinColor={POLYLINE_COLORS[(selectedDay ?? dayIdx) % POLYLINE_COLORS.length]}
                  >
                    <Callout>
                      <Text style={styles.calloutText}>{`${day.day}일차 ${idx + 1}번: ${place.name}`}</Text>
                    </Callout>
                  </Marker>
                ) : null
              )}
              {day.lodging && day.lodging.latlng && (
                <Marker
                  key={`lodging-${day.day}`}
                  coordinate={day.lodging.latlng}
                  pinColor={POLYLINE_COLORS[(selectedDay ?? dayIdx) % POLYLINE_COLORS.length]}
                >
                  <Callout>
                    <Text style={styles.calloutText}>{`${day.day}일차 숙소: ${day.lodging.name}`}</Text>
                  </Callout>
                </Marker>
              )}
            </React.Fragment>
          ))}
        </MapView>
        <TouchableOpacity style={styles.mapOverlay} onPress={handleExpandMap} activeOpacity={0.8}>
          <Icon name="expand-outline" size={24} color="#197C6B" />
        </TouchableOpacity>
      </View>
      {/* 3. 일정 리스트 개선 */}
      <FlatList
        data={plan}
        keyExtractor={(item: PlanDay) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }: { item: PlanDay, index: number }) => (
          <View style={styles.dayCard}>
            <TouchableOpacity onPress={() => handleDayTitlePress(index)}>
              <Text style={[styles.dayTitle, selectedDay === index && { color: POLYLINE_COLORS[index % POLYLINE_COLORS.length] }]}>{item.day}일차</Text>
            </TouchableOpacity>
            {item.places.map((place: PlanPlace, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => focusMarker(index, idx, place.latlng)} style={styles.placeRow}>
                {place.photo && <Image source={{ uri: place.photo }} style={styles.placeThumb} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeText}>• {place.name}</Text>
                  {place.address && <Text style={styles.placeDesc}>{place.address}</Text>}
                  {place.rating && <Text style={styles.placeRating}>⭐ {place.rating.toFixed(1)}</Text>}
                </View>
              </TouchableOpacity>
            ))}
            {item.lodging && (
              <TouchableOpacity 
                onPress={() => item.lodging?.latlng && focusMarker(index, -1, item.lodging.latlng)} 
                style={styles.placeRow}
              >
                {item.lodging.image && <Image source={{ uri: item.lodging.image }} style={styles.placeThumb} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.lodgingTitle}>숙소: {item.lodging.name}</Text>
                  {item.lodging.address && <Text style={styles.placeDesc}>{item.lodging.address}</Text>}
                  {item.lodging.rating && <Text style={styles.placeRating}>⭐ {item.lodging.rating.toFixed(1)}</Text>}
                </View>
              </TouchableOpacity>
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
      {/* 저장값 미리보기 모달 */}
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
      {/* 지도 확대 모달 */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>여행 경로</Text>
              <TouchableOpacity onPress={() => setMapModalVisible(false)}>
                <Icon name="close" size={24} color="#197C6B" />
              </TouchableOpacity>
            </View>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.modalMap}
              initialRegion={{
                latitude: routeCoords[0]?.[0]?.latitude || 35.6895,
                longitude: routeCoords[0]?.[0]?.longitude || 139.6917,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              {getFilteredRouteCoords().map((coords, idx) => (
                coords.length > 1 && (
                  <Polyline
                    key={idx}
                    coordinates={coords}
                    strokeColor={POLYLINE_COLORS[idx % POLYLINE_COLORS.length]}
                    strokeWidth={4}
                  />
                )
              ))}
              {getFilteredMarkers().map((day, dayIdx) => (
                <React.Fragment key={day.day}>
                  {day.places.map((place, idx) =>
                    place.latlng ? (
                      <Marker
                        key={`place-${dayIdx}-${idx}`}
                        coordinate={place.latlng}
                        pinColor={POLYLINE_COLORS[dayIdx % POLYLINE_COLORS.length]}
                      >
                        <Callout>
                          <Text style={styles.calloutText}>{`${day.day}일차 ${idx + 1}번: ${place.name}`}</Text>
                        </Callout>
                      </Marker>
                    ) : null
                  )}
                  {day.lodging && day.lodging.latlng && (
                    <Marker
                      key={`lodging-${day.day}`}
                      coordinate={day.lodging.latlng}
                      pinColor={POLYLINE_COLORS[dayIdx % POLYLINE_COLORS.length]}
                    >
                      <Callout>
                        <Text style={styles.calloutText}>{`${day.day}일차 숙소: ${day.lodging.name}`}</Text>
                      </Callout>
                    </Marker>
                  )}
                </React.Fragment>
              ))}
            </MapView>
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
  mapContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  map: {
    width: width - 32,
    height: 220,
    borderRadius: 18,
  },
  mapOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
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
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  placeText: {
    fontSize: 15,
    color: '#197C6B',
    marginBottom: 2,
    fontWeight: '500',
  },
  placeDesc: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  placeRating: {
    fontSize: 13,
    color: '#FFB347',
    marginBottom: 2,
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#197C6B',
    marginBottom: 2,
  },
  calloutText: {
    fontSize: 14,
    color: '#197C6B',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#197C6B',
  },
  modalMap: {
    flex: 1,
  },
});

export default FinalScreen; 
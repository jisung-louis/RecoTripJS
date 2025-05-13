import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions, Platform, Image, TouchableOpacity, Modal, ScrollView, Button, Alert } from 'react-native';
import MapView, { Polyline, Marker, LatLng, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import CustomBackButton from '../components/CustomBackButton';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const POLYLINE_COLORS = ['#1976D2', '#C62828', '#2E7D32', '#F9A825', '#6A1B9A', '#00838F', '#FF7043', '#7B1FA2'];

const getAllRouteCoords = (plan: any[]) => {
  return plan.map((day: any, idx: number) => {
    const coords: LatLng[] = [];
    if (idx > 0 && day.lodging?.latlng) {
      coords.push(day.lodging.latlng);
    }
    day.places.forEach((p: any) => {
      if (p.latlng) coords.push(p.latlng);
    });
    if (day.lodging?.latlng) coords.push(day.lodging.latlng);
    return coords;
  });
};

const MyPlanDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const plan = route.params?.plan;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});

  // 실제 플랜 데이터 구조 맞추기
  const planDays = plan?.routes?.map((route: any) => {
    const places = route.places.map((placeName: string) => {
      // selectedLandmarks에서 name이 일치하는 landmark 찾기
      const found = Array.isArray(plan.selectedLandmarks)
        ? plan.selectedLandmarks.find((lm: any) => lm.name === placeName)
        : null;
      if (found && found.location) {
        return {
          name: found.name,
          latlng: {
            latitude: found.location.lat,
            longitude: found.location.lng,
          },
          ...found,
        };
      }
      // 못 찾으면 더미 좌표
      return { name: placeName, latlng: { latitude: 37.5665, longitude: 126.9780 } };
    });
    let lodgingInfo = null;
    if (plan.selectedLodging && plan.selectedLodging[route.day]) {
      const lodging = plan.selectedLodging[route.day];
      lodgingInfo = {
        ...lodging,
        latlng: lodging.location
          ? {
              latitude: lodging.location.lat,
              longitude: lodging.location.lng,
            }
          : { latitude: 37.5700, longitude: 126.9769 },
      };
    }
    return { day: route.day, places, lodging: lodgingInfo };
  }) || [];
  const routeCoords = getAllRouteCoords(planDays);

  useEffect(() => {
    if (!mapRef.current) return;
    const allCoords: LatLng[] = planDays.flatMap((day: any) => [
      ...day.places.filter((p: any) => p.latlng).map((p: any) => p.latlng),
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
  }, [planDays.length]);

  const focusMarker = (dayIdx: number, placeIdx: number, latlng: LatLng | null) => {
    if (!mapRef.current) return;
    const dayPlan = planDays[dayIdx];
    const coords: LatLng[] = [
      ...dayPlan.places.filter((p: any) => p.latlng).map((p: any) => p.latlng),
    ];
    if (dayPlan.lodging?.latlng) coords.push(dayPlan.lodging.latlng);
    if (coords.length > 0) {
      (mapRef.current as any).fitToCoordinates(coords, {
        edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
        animated: true,
      });
      let refKey = placeIdx === -1 ? `lodging-${dayIdx}` : `place-${dayIdx}-${placeIdx}`;
      setTimeout(() => {
        markerRefs.current[refKey]?.showCallout();
      }, 600);
    }
  };

  const getFilteredRouteCoords = () => {
    if (selectedDay === null) return routeCoords;
    return [routeCoords[selectedDay]];
  };
  const getFilteredMarkers = () => {
    if (selectedDay === null) return planDays;
    return [planDays[selectedDay]];
  };
  const handleExpandMap = () => setMapModalVisible(true);
  const handleDayTitlePress = (index: number) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>{plan?.tripName || '여행 플랜 상세'}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{plan?.tripName || '여행 플랜'}</Text>
        <Text style={styles.summaryText}>
          {plan?.startDate?.toDate ? plan.startDate.toDate().toLocaleDateString() : ''} ~ {plan?.endDate?.toDate ? plan.endDate.toDate().toLocaleDateString() : ''} | {typeof plan?.selectedPeople === 'number' ? plan.selectedPeople : 0}명
        </Text>
        <Text style={styles.summaryText}>
          {plan?.selectedKeywords?.map((k: string) => `#${k}`).join(' ')}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.9780,
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
          {getFilteredMarkers().map((day: any, dayIdx: number) => (
            <React.Fragment key={day.day}>
              {day.places.map((place: any, idx: number) =>
                place.latlng ? (
                  <Marker
                    ref={(ref: any) => {
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
                  ref={(ref: any) => {
                    if (ref) {
                      markerRefs.current[`lodging-${dayIdx}`] = ref;
                    }
                  }}
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
      <FlatList
        data={planDays}
        keyExtractor={(item: any) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <View style={styles.dayCard}>
            <TouchableOpacity onPress={() => handleDayTitlePress(index)}>
              <Text style={[styles.dayTitle, selectedDay === index && { color: POLYLINE_COLORS[index % POLYLINE_COLORS.length] }]}>{item.day}일차</Text>
            </TouchableOpacity>
            {item.places.map((place: any, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => focusMarker(index, idx, place.latlng)} style={styles.placeRow}>
                {place.photo && (
                  <Image source={{ uri: place.photo }} style={styles.placeThumb} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeText}>• {place.name}</Text>
                  {place.address && (
                    <Text style={styles.placeDesc}>{place.address}</Text>
                  )}
                  {place.rating !== undefined && place.rating !== null && (
                    <Text style={styles.placeRating}>⭐ {place.rating.toFixed(1)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {item.lodging && (
              <TouchableOpacity 
                onPress={() => item.lodging?.latlng && focusMarker(index, -1, item.lodging.latlng)}
                style={styles.placeRow}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.lodgingTitle}>숙소: {item.lodging.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
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
                latitude: planDays[0]?.places[0]?.latlng?.latitude || 37.5665,
                longitude: planDays[0]?.places[0]?.latlng?.longitude || 126.9780,
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
              {getFilteredMarkers().map((day: any, dayIdx: number) => (
                <React.Fragment key={day.day}>
                  {day.places.map((place: any, idx: number) =>
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
    marginBottom: 10,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeText: {
    fontSize: 15,
    color: '#197C6B',
    fontWeight: '500',
  },
  lodgingTitle: {
    fontSize: 15,
    color: '#5CB8B2',
    marginTop: 6,
    fontWeight: 'bold',
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
  placeThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
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
});

export default MyPlanDetailScreen; 
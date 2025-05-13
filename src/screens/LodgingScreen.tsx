import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTripStore, Place, Hotel } from '../store/useTripStore';
import axios from 'axios';

interface DayLodging {
  day: number;
  lodgings: Hotel[];
}

const LodgingScreen = () => {
  const [selected, setSelected] = useState<{ [day: number]: string }>({});
  const [lodgings, setLodgings] = useState<DayLodging[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const { setSelectedLodging, routes, selectedLandmarks } = useTripStore();

  useEffect(() => {
    console.log('==== [LodgingScreen] routes ====', routes);
    console.log('==== [LodgingScreen] selectedLandmarks ====', selectedLandmarks);
    fetchLodgings();
  }, [routes, selectedLandmarks]);

  const fetchLodgings = async () => {
    if (!routes || routes.length === 0 || !selectedLandmarks || selectedLandmarks.length === 0) {
      console.log('[진단] routes 또는 selectedLandmarks가 비어 있음');
      setLodgings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const newLodgings: DayLodging[] = [];
    for (const route of routes) {
      const placeNames: string[] = route.places;
      const coords = placeNames
        .map((name) => selectedLandmarks.find((p) => p.name === name)?.location)
        .filter((loc): loc is { lat: number; lng: number } => !!loc);
      let centroid = { lat: 0, lng: 0 };
      if (coords.length > 0) {
        centroid.lat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
        centroid.lng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
      }
      console.log(`[진단] day ${route.day} coords:`, coords, 'centroid:', centroid);
      let hotels: Hotel[] = [];
      try {
        const res = await axios.get('https://recotrip-backend-production.up.railway.app/api/hotels', {
          params: {
            lat: centroid.lat,
            lng: centroid.lng,
            radius: 1500,
          },
        });
        console.log(`[진단] day ${route.day} API response:`, res.data);
        hotels = (res.data.hotels || []).map((item: any) => ({
          name: item.name,
          image: item.photo || 'https://via.placeholder.com/400x200?text=No+Image',
          desc: item.address || '',
          rating: item.rating || 0,
        }));
      } catch (e) {
        console.error(`[진단] day ${route.day} Hotel API error:`, e);
        hotels = [];
      }
      newLodgings.push({ day: route.day, lodgings: hotels });
    }
    setLodgings(newLodgings);
    setLoading(false);
  };

  // N-1박만큼만 숙소 선택
  const nights = Math.max(1, routes.length - 1);
  const lodgingDays = lodgings.slice(0, nights);

  const handleSelect = (day: number, lodging: string) => {
    setSelected((prev) => ({ ...prev, [day]: lodging }));
  };

  // day별로 Hotel 객체 전체를 저장
  const saveLodgingToStore = () => {
    const lodgingObj: { [day: number]: Hotel } = {};
    lodgingDays.forEach((dayLodging) => {
      const selectedHotelName = selected[dayLodging.day];
      const hotel = dayLodging.lodgings.find((h) => h.name === selectedHotelName);
      if (hotel) {
        lodgingObj[dayLodging.day] = hotel;
      }
    });
    setSelectedLodging(lodgingObj);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6FDFD' }}>
        <Text style={{ fontSize: 16, color: '#197C6B', fontWeight: '500' }}>숙소를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>숙소 선택</Text>
      </View>
      <FlatList
        data={lodgingDays}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.day}일차 숙소</Text>
            <FlatList
              data={item.lodgings}
              keyExtractor={(lodging) => lodging.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.lodgingRow}
              renderItem={({ item: lodging }) => {
                const isSelected = selected[item.day] === lodging.name;
                return (
                  <TouchableOpacity
                    key={lodging.name}
                    style={[
                      styles.lodgingCard,
                      isSelected && styles.selectedLodging,
                    ]}
                    onPress={() => handleSelect(item.day, lodging.name)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: lodging.image }} style={styles.lodgingImage} />
                    <View style={styles.lodgingInfo}>
                      <Text style={styles.lodgingName}>{lodging.name}</Text>
                      <Text style={styles.lodgingDesc}>{lodging.desc}</Text>
                      <View style={styles.ratingRow}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{lodging.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <CustomButton
          title="다음"
          type="primary"
          onPress={() => {
            saveLodgingToStore();
            navigation.navigate('MainStack', { screen: 'Final' });
          }}
          style={styles.nextButton}
        />
      </View>
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
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
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
  lodgingRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  lodgingCard: {
    backgroundColor: '#E0F7F3',
    borderRadius: 14,
    width: 160,
    marginRight: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLodging: {
    borderColor: '#1CB5A3',
    backgroundColor: '#B6F2E6',
  },
  lodgingImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  lodgingInfo: {
    alignItems: 'center',
  },
  lodgingName: {
    color: '#197C6B',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  lodgingDesc: {
    color: '#444',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: '#1CB5A3',
    fontWeight: 'bold',
    fontSize: 13,
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
  nextButton: {
    width: '100%',
  },
});

export default LodgingScreen; 
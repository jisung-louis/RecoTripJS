import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTripStore } from '../store/useTripStore';

const HOTEL_LIST = [
  {
    name: '호텔A',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: '도쿄 중심에 위치한 4성급 호텔',
    rating: 4.7,
  },
  {
    name: '호텔B',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    desc: '합리적인 가격의 깔끔한 숙소',
    rating: 4.3,
  },
  {
    name: '호텔C',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    desc: '도쿄역 근처의 모던한 호텔',
    rating: 4.5,
  },
  {
    name: '호텔D',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    desc: '조용하고 쾌적한 숙소',
    rating: 4.2,
  },
  {
    name: '호텔E',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    desc: '공항 접근성이 좋은 호텔',
    rating: 4.6,
  },
];

const DUMMY_LODGINGS = [
  { day: 1, lodgings: HOTEL_LIST },
  { day: 2, lodgings: HOTEL_LIST },
  { day: 3, lodgings: HOTEL_LIST },
];

const LodgingScreen = () => {
  const [selected, setSelected] = useState<{ [day: number]: string }>({});
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const { setSelectedLodging } = useTripStore();

  const handleSelect = (day: number, lodging: string) => {
    setSelected((prev) => ({ ...prev, [day]: lodging }));
  };

  const saveLodgingToStore = () => {
    const firstDay = Object.keys(selected)[0];
    if (firstDay) {
      setSelectedLodging({
        name: selected[Number(firstDay)],
        address: '',
        checkIn: null,
        checkOut: null,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>숙소 선택</Text>
      </View>
      <FlatList
        data={DUMMY_LODGINGS}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.day}일차</Text>
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
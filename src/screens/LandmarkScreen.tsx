import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTripStore } from '../store/useTripStore';
import axios from 'axios';

interface Place {
  name: string;
  address: string;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  place_id: string;
  photo: string | null;
}

const MAX_SELECT = 6;

const LandmarkScreen = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const { addLandmark, removeLandmark, selectedCity } = useTripStore();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `https://recotrip-backend-production.up.railway.app/api/places`,
        {
          params: { query: selectedCity }
        }
      );
      
      setPlaces(response.data.results);
    } catch (err) {
      console.error('관광지 조회 API 오류:', err);
      setError('관광지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (placeId: string) => {
    setSelected((prev) =>
      prev.includes(placeId)
        ? prev.filter((item) => item !== placeId)
        : prev.length < MAX_SELECT
        ? [...prev, placeId]
        : prev
    );
  };

  const saveLandmarksToStore = () => {
    selected.forEach((placeId) => {
      const place = places.find(p => p.place_id === placeId);
      if (place) {
        addLandmark(place);
      }
    });
  };

  const renderItem = ({ item }: { item: Place }) => {
    const isSelected = selected.includes(item.place_id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.85}
        onPress={() => toggleSelect(item.place_id)}
      >
        <Image 
          source={{ uri: item.photo || 'https://via.placeholder.com/400x200?text=No+Image' }} 
          style={styles.image} 
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.tag}>관광지</Text>
            {isSelected && (
              <Icon name="checkmark-circle" size={22} color="#1CB5A3" style={{ marginLeft: 6 }} />
            )}
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.address}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating?.toFixed(1) || '평점 없음'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#197C6B" />
        <Text style={styles.loadingText}>관광지를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPlaces}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>어디 가보실래요?</Text>
      </View>
      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomBar}>
        <Text style={styles.selectedCount}>
          {selected.length}/{MAX_SELECT} 선택
        </Text>
        <CustomButton
          title="다음"
          type="primary"
          disabled={selected.length === 0}
          onPress={() => {
            saveLandmarksToStore();
            navigation.navigate('MainStack', { screen: 'TripStep' });
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#1CB5A3',
    backgroundColor: '#E0F7F3',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#B6F2E6',
    color: '#197C6B',
    fontSize: 13,
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: '#1CB5A3',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F6FDFD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCount: {
    color: '#197C6B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButton: {
    minWidth: 120,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FDFD',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#197C6B',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FDFD',
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#197C6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LandmarkScreen; 
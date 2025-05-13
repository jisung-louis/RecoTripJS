import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBackButton from '../components/CustomBackButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import axios from 'axios';
import { useTripStore } from '../store/useTripStore';

interface City {
  id: string;
  name_ko: string;
  country: string;
}

const CityScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedKeywords } = useTripStore();

  useEffect(() => {
    fetchRecommendedCities();
  }, []);

  const fetchRecommendedCities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        'https://recotrip-backend-production.up.railway.app/api/recommend/city',
        { keywords: selectedKeywords }
      );
      
      setCities(response.data.cities);
    } catch (err) {
      console.error('도시 추천 API 오류:', err);
      setError('도시 추천을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#197C6B" />
        <Text style={styles.loadingText}>도시를 추천받고 있어요...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendedCities}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>고르신 키워드를 기반으로</Text>
        <Text style={styles.subtitle}>RecoAI가 장소를 추천해봤어요.</Text>
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('MainStack', { 
                screen: 'CityDetail', 
                params: { city: item.id } 
              })}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                <Icon name="location-outline" size={28} color="#222" />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cityName}>{item.name_ko}</Text>
                <Text style={styles.countryName}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#197C6B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1CB5A3',
    textAlign: 'center',
    marginBottom: 28,
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FDFD',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconWrapper: {
    marginRight: 16,
    backgroundColor: '#E6F7F4',
    borderRadius: 20,
    padding: 6,
  },
  textWrapper: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  countryName: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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

export default CityScreen;
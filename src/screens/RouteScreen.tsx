import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTripStore } from '../store/useTripStore';
import axios from 'axios';

interface RouteDay {
  day: number;
  places: string[];
}

const RouteScreen = () => {
  const [routes, setRoutes] = useState<RouteDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const { selectedCity, selectedLandmarks, startDate, endDate } = useTripStore();

  useEffect(() => {
    fetchRecommendedRoute();
  }, []);

  const fetchRecommendedRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        'https://recotrip-backend-production.up.railway.app/api/recommend/route',
        {
          city: selectedCity,
          landmarks: selectedLandmarks,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString()
        }
      );
      
      setRoutes(response.data.itinerary);
    } catch (err) {
      console.error('여행 일정 생성 API 오류:', err);
      setError('여행 일정을 생성하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    fetchRecommendedRoute();
  };

  const handleEdit = () => {
    Alert.alert('직접 수정', '직접 수정 화면으로 이동합니다.');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#197C6B" />
        <Text style={styles.loadingText}>여행 일정을 생성하는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendedRoute}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>여행 일정</Text>
      </View>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.day}일차</Text>
            {item.places.map((place, idx) => (
              <Text key={idx} style={styles.placeText}>• {place}</Text>
            ))}
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <View style={styles.actionButtons}>
          <CustomButton
            title="세부 일정 다시 짜기"
            type="text"
            onPress={handleRegenerate}
            style={styles.actionButton}
            textStyle={{ fontSize: 13 }}
          />
          <CustomButton
            title="여행 일정 직접 수정하기"
            type="text"
            onPress={handleEdit}
            style={styles.actionButton}
            textStyle={{ fontSize: 13 }}
          />
        </View>
        <CustomButton
          title="다음"
          type="primary"
          onPress={() => navigation.navigate('MainStack', { screen: 'Lodging' })}
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
    paddingBottom: 120,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  nextButton: {
    width: '100%',
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

export default RouteScreen; 
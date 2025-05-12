import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const DUMMY_CITIES = [
  { name: '도쿄', country: '일본' },
  { name: '홍콩', country: '중국' },
  { name: '뉴욕', country: '미국' },
  { name: '파리', country: '프랑스' },
  { name: '피렌체', country: '이탈리아' },
];

const CityScreen = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const handleSelect = (city: string) => {
    setSelected(city);
    navigation.navigate('MainStack', { screen: 'CityDetail', params: { city } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>고르신 키워드를 기반으로</Text>
        <Text style={styles.subtitle}>RecoAI가 장소를 추천해봤어요.</Text>
        <FlatList
          data={DUMMY_CITIES}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isSelected = selected === item.name;
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item.name)}
                activeOpacity={0.8}
              >
                <View style={styles.iconWrapper}>
                  <Icon name="location-outline" size={28} color={isSelected ? '#197C6B' : '#222'} />
                </View>
                <View style={styles.textWrapper}>
                  <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>{item.name}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <CustomButton
          title="다음"
          type="primary"
          disabled={!selected}
          onPress={() => {/* 다음 단계로 이동 */}}
          style={styles.nextButton}
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
  cardSelected: {
    borderColor: '#1CB5A3',
    backgroundColor: '#E0F7F3',
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
  cityNameSelected: {
    color: '#197C6B',
  },
  countryName: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  nextButton: {
    marginTop: 'auto',
    marginBottom: 24,
  },
});

export default CityScreen;
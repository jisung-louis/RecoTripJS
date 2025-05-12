import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';

const DUMMY_CITY_DETAILS: Record<string, { desc: string; highlights: string[] }> = {
  '도쿄': {
    desc: '일본의 수도로, 전통과 현대가 공존하는 대도시입니다.',
    highlights: ['스카이트리', '아사쿠사', '시부야', '도쿄타워'],
  },
  '홍콩': {
    desc: '동서양 문화가 어우러진 국제도시로, 야경과 쇼핑이 유명합니다.',
    highlights: ['빅토리아 피크', '몽콕', '침사추이'],
  },
  '뉴욕': {
    desc: '미국의 대표적인 대도시로, 다양한 문화와 예술의 중심지입니다.',
    highlights: ['센트럴파크', '타임스퀘어', '브루클린 브리지'],
  },
  '파리': {
    desc: '프랑스의 수도로, 예술과 낭만의 도시입니다.',
    highlights: ['에펠탑', '루브르 박물관', '몽마르트 언덕'],
  },
  '피렌체': {
    desc: '이탈리아의 예술과 르네상스의 중심지입니다.',
    highlights: ['두오모', '우피치 미술관', '베키오 다리'],
  },
};

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;
type CityDetailScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'MainStack'>;

const CityDetailScreen = () => {
  const navigation = useNavigation<CityDetailScreenNavigationProp>();
  const route = useRoute<CityDetailScreenRouteProp>();
  const { city } = route.params;
  const details = DUMMY_CITY_DETAILS[city] || { desc: '', highlights: [] };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.desc}>{details.desc}</Text>
        <Text style={styles.sectionTitle}>주요 명소</Text>
        {details.highlights.map((hl) => (
          <View key={hl} style={styles.highlightBox}>
            <Text style={styles.highlightText}>{hl}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="이 도시로 결정하기!"
          type="primary"
          onPress={() => navigation.navigate('MainStack', { screen: 'Landmark' })}
          style={styles.selectButton}
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1CB5A3',
    marginBottom: 10,
  },
  highlightBox: {
    backgroundColor: '#E0F7F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  highlightText: {
    color: '#197C6B',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
  selectButton: {
    width: '100%',
  },
});

export default CityDetailScreen; 
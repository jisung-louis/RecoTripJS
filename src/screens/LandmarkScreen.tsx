import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const DUMMY_LANDMARKS = [
  {
    id: '1',
    name: '도쿄 타워',
    desc: '도쿄의 상징적인 랜드마크, 멋진 전망과 야경을 자랑합니다.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    tag: '전망대',
    rating: 4.8,
  },
  {
    id: '2',
    name: '하라주쿠',
    desc: '트렌디한 패션과 다양한 먹거리를 즐길 수 있는 거리.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    tag: '쇼핑',
    rating: 4.6,
  },
  {
    id: '3',
    name: '아사쿠사',
    desc: '센소지 절과 전통적인 분위기의 거리.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    tag: '전통',
    rating: 4.7,
  },
  {
    id: '4',
    name: '시부야 스크램블',
    desc: '세계에서 가장 붐비는 교차로, 활기찬 분위기.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    tag: '핫플',
    rating: 4.5,
  },
  {
    id: '5',
    name: '우에노 공원',
    desc: '벚꽃 명소로 유명한 도심 속 공원.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    tag: '자연',
    rating: 4.6,
  },
  {
    id: '6',
    name: '도쿄 국립박물관',
    desc: '일본 최대의 박물관, 다양한 전시와 유물.',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    tag: '문화',
    rating: 4.4,
  },
  {
    id: '7',
    name: '오다이바',
    desc: '바다와 쇼핑, 엔터테인먼트가 어우러진 복합 공간.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    tag: '복합',
    rating: 4.5,
  },
  {
    id: '8',
    name: '롯폰기 힐즈',
    desc: '고급 레스토랑과 전망대, 예술 공간이 있는 복합 빌딩.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    tag: '전망대',
    rating: 4.3,
  },
  {
    id: '9',
    name: '메이지 신궁',
    desc: '도심 속 평온한 신사, 산책로가 아름다움.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    tag: '전통',
    rating: 4.7,
  },
  {
    id: '10',
    name: '긴자',
    desc: '고급 쇼핑과 미식의 거리.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    tag: '쇼핑',
    rating: 4.6,
  },
];

const MAX_SELECT = 6;

const LandmarkScreen = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length < MAX_SELECT
        ? [...prev, id]
        : prev
    );
  };

  const renderItem = ({ item }: { item: typeof DUMMY_LANDMARKS[0] }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.85}
        onPress={() => toggleSelect(item.id)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.tag}>{item.tag}</Text>
            {isSelected && (
              <Icon name="checkmark-circle" size={22} color="#1CB5A3" style={{ marginLeft: 6 }} />
            )}
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>어디 가보실래요?</Text>
      </View>
      <FlatList
        data={DUMMY_LANDMARKS}
        keyExtractor={(item) => item.id}
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
          onPress={() => navigation.navigate('MainStack', { screen: 'People' })}
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
});

export default LandmarkScreen; 
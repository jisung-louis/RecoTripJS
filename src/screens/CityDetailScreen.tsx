import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripStore } from '../store/useTripStore';

// 더미 데이터 타입 정의
interface CityDetail {
  image: string;
  desc: string;
  keywords: string[];
  highlights: string[];
  weather: {
    current: string;
    temperature: string;
    bestTime: string;
  };
  visa: {
    required: boolean;
    duration: string;
    cost: string;
  };
  flight: {
    fromSeoul: string;
    fromTokyo: string;
  };
  cost: {
    daily: string;
    level: '저렴' | '보통' | '비쌈';
  };
  electricity: {
    voltage: string;
    plugType: string;
  };
  language: {
    main: string;
    greeting: string;
  };
  payment: {
    cardUsage: string;
    cashRatio: string;
  };
  documents: string[];
  transportation: {
    subway: boolean;
    bus: boolean;
    passes: string[];
  };
  timezone: string;
  similarCities: string[];
}

// 더미 데이터
const DUMMY_CITY_DETAILS: Record<string, CityDetail> = {
  '도쿄': {
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    desc: '일본의 수도로, 전통과 현대가 공존하는 대도시입니다. 첨단 기술과 전통 문화가 조화롭게 어우러진 독특한 매력을 가진 도시입니다.',
    keywords: ['쇼핑', '맛집', '문화', '테크놀로지', '야경'],
    highlights: ['도쿄 스카이트리', '시부야', '하라주쿠', '아사쿠사', '도쿄 디즈니랜드'],
    weather: {
      current: '맑음',
      temperature: '23°C',
      bestTime: '3월~5월, 9월~11월',
    },
    visa: {
      required: false,
      duration: '90일',
      cost: '무비자',
    },
    flight: {
      fromSeoul: '2시간 30분',
      fromTokyo: '-',
    },
    cost: {
      daily: '15만원~20만원',
      level: '보통',
    },
    electricity: {
      voltage: '100V',
      plugType: 'A형 (미국식)',
    },
    language: {
      main: '일본어',
      greeting: 'こんにちは (콘니치와)',
    },
    payment: {
      cardUsage: '대부분의 곳에서 사용 가능',
      cashRatio: '30% 정도는 현금 필요',
    },
    documents: ['여권', '항공권', '숙소 예약 확인서'],
    transportation: {
      subway: true,
      bus: true,
      passes: ['도쿄 메트로 패스', 'JR 패스'],
    },
    timezone: 'UTC+9',
    similarCities: ['서울', '홍콩', '싱가포르'],
  },
  '홍콩': {
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    desc: '동서양 문화가 어우러진 국제도시로, 야경과 쇼핑이 유명합니다. 현대적인 스카이라인과 전통적인 시장이 공존하는 독특한 매력을 가진 도시입니다.',
    keywords: ['쇼핑', '야경', '맛집', '문화', '테마파크'],
    highlights: ['빅토리아 피크', '몽콕', '침사추이', '홍콩 디즈니랜드', '오션파크'],
    weather: {
      current: '흐림',
      temperature: '26°C',
      bestTime: '10월~12월',
    },
    visa: {
      required: false,
      duration: '90일',
      cost: '무비자',
    },
    flight: {
      fromSeoul: '3시간 30분',
      fromTokyo: '4시간',
    },
    cost: {
      daily: '20만원~25만원',
      level: '비쌈',
    },
    electricity: {
      voltage: '220V',
      plugType: 'G형 (영국식)',
    },
    language: {
      main: '광동어, 영어',
      greeting: '你好 (니하오)',
    },
    payment: {
      cardUsage: '대부분의 곳에서 사용 가능',
      cashRatio: '20% 정도는 현금 필요',
    },
    documents: ['여권', '항공권', '숙소 예약 확인서'],
    transportation: {
      subway: true,
      bus: true,
      passes: ['옥토퍼스 카드'],
    },
    timezone: 'UTC+8',
    similarCities: ['싱가포르', '마카오', '도쿄'],
  },
  '뉴욕': {
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    desc: '미국의 대표적인 대도시로, 다양한 문화와 예술의 중심지입니다. 자유의 여신상과 타임스퀘어 등 세계적으로 유명한 명소들이 있는 도시입니다.',
    keywords: ['예술', '쇼핑', '문화', '음식', '야경'],
    highlights: ['센트럴파크', '타임스퀘어', '브루클린 브리지', '자유의 여신상', '엠파이어 스테이트 빌딩'],
    weather: {
      current: '맑음',
      temperature: '18°C',
      bestTime: '4월~6월, 9월~10월',
    },
    visa: {
      required: true,
      duration: '90일',
      cost: '약 20만원',
    },
    flight: {
      fromSeoul: '14시간',
      fromTokyo: '13시간',
    },
    cost: {
      daily: '25만원~30만원',
      level: '비쌈',
    },
    electricity: {
      voltage: '120V',
      plugType: 'A형 (미국식)',
    },
    language: {
      main: '영어',
      greeting: 'Hello',
    },
    payment: {
      cardUsage: '대부분의 곳에서 사용 가능',
      cashRatio: '10% 정도는 현금 필요',
    },
    documents: ['여권', '비자', '항공권', '숙소 예약 확인서'],
    transportation: {
      subway: true,
      bus: true,
      passes: ['메트로카드'],
    },
    timezone: 'UTC-4',
    similarCities: ['런던', '파리', '시카고'],
  },
  '파리': {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    desc: '프랑스의 수도로, 예술과 낭만의 도시입니다. 에펠탑과 루브르 박물관 등 세계적으로 유명한 명소들이 있는 도시입니다.',
    keywords: ['예술', '문화', '맛집', '쇼핑', '건축'],
    highlights: ['에펠탑', '루브르 박물관', '몽마르트 언덕', '노트르담 대성당', '샹젤리제 거리'],
    weather: {
      current: '맑음',
      temperature: '20°C',
      bestTime: '4월~6월, 9월~10월',
    },
    visa: {
      required: true,
      duration: '90일',
      cost: '약 15만원',
    },
    flight: {
      fromSeoul: '12시간',
      fromTokyo: '13시간',
    },
    cost: {
      daily: '20만원~25만원',
      level: '비쌈',
    },
    electricity: {
      voltage: '230V',
      plugType: 'E형 (프랑스식)',
    },
    language: {
      main: '프랑스어',
      greeting: 'Bonjour',
    },
    payment: {
      cardUsage: '대부분의 곳에서 사용 가능',
      cashRatio: '20% 정도는 현금 필요',
    },
    documents: ['여권', '비자', '항공권', '숙소 예약 확인서'],
    transportation: {
      subway: true,
      bus: true,
      passes: ['파리 비지트 패스'],
    },
    timezone: 'UTC+1',
    similarCities: ['로마', '바르셀로나', '런던'],
  },
  '피렌체': {
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    desc: '이탈리아의 예술과 르네상스의 중심지입니다. 두오모와 우피치 미술관 등 세계적으로 유명한 예술 작품들이 있는 도시입니다.',
    keywords: ['예술', '문화', '건축', '맛집', '와인'],
    highlights: ['두오모', '우피치 미술관', '베키오 다리', '피티 궁전', '산타 크로체 성당'],
    weather: {
      current: '맑음',
      temperature: '22°C',
      bestTime: '4월~6월, 9월~10월',
    },
    visa: {
      required: true,
      duration: '90일',
      cost: '약 15만원',
    },
    flight: {
      fromSeoul: '13시간',
      fromTokyo: '14시간',
    },
    cost: {
      daily: '15만원~20만원',
      level: '보통',
    },
    electricity: {
      voltage: '230V',
      plugType: 'F형 (이탈리아식)',
    },
    language: {
      main: '이탈리아어',
      greeting: 'Ciao',
    },
    payment: {
      cardUsage: '대부분의 곳에서 사용 가능',
      cashRatio: '30% 정도는 현금 필요',
    },
    documents: ['여권', '비자', '항공권', '숙소 예약 확인서'],
    transportation: {
      subway: false,
      bus: true,
      passes: ['피렌체 카드'],
    },
    timezone: 'UTC+1',
    similarCities: ['로마', '베니스', '밀라노'],
  },
};

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;
type CityDetailScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'MainStack'>;

const CityDetailScreen = () => {
  const navigation = useNavigation<CityDetailScreenNavigationProp>();
  const route = useRoute<CityDetailScreenRouteProp>();
  const { city } = route.params;
  const details = DUMMY_CITY_DETAILS[city] || DUMMY_CITY_DETAILS['도쿄']; // 기본값으로 도쿄 설정
  const insets = useSafeAreaInsets();
  const { setSelectedCity } = useTripStore();

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  const renderTag = (text: string) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[styles.fixedBackButton, { top: insets.top + 8 }]}> 
        <CustomBackButton />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Image
          source={{ uri: details.image }}
          style={styles.cityImage}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.desc}>{details.desc}</Text>

          {renderSection('추천 키워드', (
            <View style={styles.tagsContainer}>
              {details.keywords.map((keyword, idx) => (
                <View key={keyword + idx} style={styles.tag}>
                  <Text style={styles.tagText}>{keyword}</Text>
                </View>
              ))}
            </View>
          ))}

          {renderSection('주요 명소', (
            <View style={styles.highlightsContainer}>
              {details.highlights.map((hl, idx) => (
                <View key={hl + idx} style={styles.highlightBox}>
                  <Icon name="location" size={20} color="#197C6B" style={styles.highlightIcon} />
                  <Text style={styles.highlightText}>{hl}</Text>
                </View>
              ))}
            </View>
          ))}

          {renderSection('날씨 정보', (
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>현재 날씨</Text>
                <Text style={styles.infoValue}>{details.weather.current}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>기온</Text>
                <Text style={styles.infoValue}>{details.weather.temperature}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>최적 여행 시기</Text>
                <Text style={styles.infoValue}>{details.weather.bestTime}</Text>
              </View>
            </View>
          ))}

          {renderSection('비자 정보', (
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>비자 필요 여부</Text>
                <Text style={styles.infoValue}>{details.visa.required ? '필요' : '불필요'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>체류 기간</Text>
                <Text style={styles.infoValue}>{details.visa.duration}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>비용</Text>
                <Text style={styles.infoValue}>{details.visa.cost}</Text>
              </View>
            </View>
          ))}

          {renderSection('교통 정보', (
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>서울에서 비행 시간</Text>
                <Text style={styles.infoValue}>{details.flight.fromSeoul}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>지하철</Text>
                <Text style={styles.infoValue}>{details.transportation.subway ? '있음' : '없음'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>버스</Text>
                <Text style={styles.infoValue}>{details.transportation.bus ? '있음' : '없음'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>교통 패스</Text>
                <Text style={styles.infoValue}>{details.transportation.passes.join(', ')}</Text>
              </View>
            </View>
          ))}

          {renderSection('경비 정보', (
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>일일 예산</Text>
                <Text style={styles.infoValue}>{details.cost.daily}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>물가 수준</Text>
                <Text style={styles.infoValue}>{details.cost.level}</Text>
              </View>
            </View>
          ))}

          {renderSection('기타 정보', (
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>전압/콘센트</Text>
                <Text style={styles.infoValue}>{`${details.electricity.voltage} (${details.electricity.plugType})`}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>시차</Text>
                <Text style={styles.infoValue}>{details.timezone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>주요 언어</Text>
                <Text style={styles.infoValue}>{details.language.main}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>인사말</Text>
                <Text style={styles.infoValue}>{details.language.greeting}</Text>
              </View>
            </View>
          ))}

          {renderSection('비슷한 도시', (
            <View style={styles.tagsContainer}>
              {details.similarCities.map((city, idx) => (
                <View key={city + idx} style={styles.tag}>
                  <Text style={styles.tagText}>{city}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="이 도시로 결정하기!"
          type="primary"
          onPress={() => {
            setSelectedCity({ name: city });
            navigation.navigate('MainStack', { screen: 'Landmark' });
          }}
          style={styles.selectButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cityImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 24,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1CB5A3',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: '#E0F7F3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#197C6B',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsContainer: {
    gap: 8,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FDFD',
    borderRadius: 12,
    padding: 12,
  },
  highlightIcon: {
    marginRight: 8,
  },
  highlightText: {
    color: '#197C6B',
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F6FDFD',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F7F3',
  },
  infoLabel: {
    color: '#666',
    fontSize: 15,
  },
  infoValue: {
    color: '#197C6B',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  selectButton: {
    width: '100%',
  },
  fixedBackButton: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.0)',
    borderRadius: 24,
  },
});

export default CityDetailScreen; 
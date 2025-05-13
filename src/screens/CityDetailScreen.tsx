import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripStore } from '../store/useTripStore';
import axios from 'axios';

// 더미 데이터 타입 정의
interface CityDetail {
  image: string;
  description: string;
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
  name_ko?: string;
  country?: string;
}


const DUMMY_CITY_DETAILS: Partial<CityDetail> = {
  description: '정보를 불러오는 데 실패했습니다. 기본 정보입니다.',
  keywords: ['여행', '문화', '도시'],
  transportation: { subway: false, bus: false, passes: [] },
  cost: { daily: '정보 없음', level: '보통' },
  electricity: { voltage: '정보 없음', plugType: '정보 없음' },
  language: { main: '정보 없음', greeting: '정보 없음' },
  payment: { cardUsage: '정보 없음', cashRatio: '정보 없음' },
  documents: ['여권', '항공권', '숙소 예약 확인서'],
  timezone: '정보 없음',
  similarCities: [],
};

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;
type CityDetailScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'MainStack'>;

const CityDetailScreen = () => {
  const navigation = useNavigation<CityDetailScreenNavigationProp>();
  const route = useRoute<CityDetailScreenRouteProp>();
  const { city: cityId } = route.params;
  const [details, setDetails] = React.useState<CityDetail | null>(null);
  const insets = useSafeAreaInsets();
  const { setSelectedCity } = useTripStore();
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firestore().collection('cities').doc(cityId).get();
        if (!!doc.exists) {
          setDetails(doc.data() as CityDetail);
        } else {
          setDetails(DUMMY_CITY_DETAILS as CityDetail);
        }
      } catch (e) {
        console.error('Firestore fetch error:', e);
        setDetails(DUMMY_CITY_DETAILS as CityDetail);
      }
    };
    fetchData();
  }, [cityId]);

  React.useEffect(() => {
    if (!details) return;
    const fetchImages = async () => {
      try {
        const res = await axios.get('https://recotrip-backend-production.up.railway.app/api/places', {
          params: { query: details.name_ko || cityId }
        });
        // 여러 관광지의 photo 필드에서 최대 5장만 추출
        const imgArr = (res.data.results || [])
          .map((place: any) => place.photo)
          .filter((url: string | null) => !!url)
          .slice(0, 5);
        setImages(imgArr);
      } catch (e) {
        setImages([]);
      }
    };
    fetchImages();
  }, [details, cityId]);

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
      {!details ? (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>도시 정보를 불러오는 중입니다...</Text>
        </SafeAreaView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[styles.fixedBackButton]}>
            <CustomBackButton />
          </View>
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.content}>
              <Text style={styles.cityName}>{details.name_ko || cityId}</Text>
              <Text style={styles.countryName}>{details.country || ''}</Text>
            </View>
            {/* 대표 이미지 슬라이더 */}
            {images.length > 0 && (
              <FlatList
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, idx) => item + idx}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.cityImage} resizeMode="cover" />
                )}
                style={{ marginBottom: 16, marginTop: 4 }}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 4 }}
              />
            )}
            <View style={styles.content}>
              <Text style={styles.desc}>{details.description}</Text>

              {renderSection('추천 키워드', (
                <View style={styles.tagsContainer}>
                  {details.keywords && details.keywords.map((keyword, idx) => (
                    <View key={keyword + idx} style={styles.tag}>
                      <Text style={styles.tagText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {details.highlights && renderSection('주요 명소', (
                <View style={styles.highlightsContainer}>
                  {details.highlights.map((hl, idx) => (
                    <View key={hl + idx} style={styles.highlightBox}>
                      <Icon name="location" size={20} color="#197C6B" style={styles.highlightIcon} />
                      <Text style={styles.highlightText}>{hl}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {details.weather && renderSection('날씨 정보', (
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

              {details.visa && renderSection('비자 정보', (
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
                    <Text style={styles.infoValue}>{details.flight ? details.flight.fromSeoul : '정보 없음'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>지하철</Text>
                    <Text style={styles.infoValue}>{details.transportation && details.transportation.subway ? '있음' : '없음'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>버스</Text>
                    <Text style={styles.infoValue}>{details.transportation && details.transportation.bus ? '있음' : '없음'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>교통 패스</Text>
                    <Text style={styles.infoValue}>{details.transportation && details.transportation.passes ? details.transportation.passes.join(', ') : ''}</Text>
                  </View>
                </View>
              ))}

              {renderSection('경비 정보', (
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>일일 예산</Text>
                    <Text style={styles.infoValue}>{details.cost && details.cost.daily}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>물가 수준</Text>
                    <Text style={styles.infoValue}>{details.cost && details.cost.level}</Text>
                  </View>
                </View>
              ))}

              {renderSection('기타 정보', (
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>전압/콘센트</Text>
                    <Text style={styles.infoValue}>{details.electricity ? `${details.electricity.voltage} (${details.electricity.plugType})` : '정보 없음'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>시차</Text>
                    <Text style={styles.infoValue}>{details.timezone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>주요 언어</Text>
                    <Text style={styles.infoValue}>{details.language && details.language.main}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>인사말</Text>
                    <Text style={styles.infoValue}>{details.language && details.language.greeting}</Text>
                  </View>
                </View>
              ))}

              {renderSection('비슷한 도시', (
                <View style={styles.tagsContainer}>
                  {details.similarCities && details.similarCities.map((city, idx) => (
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
                setSelectedCity({ name: details.name_ko || cityId });
                navigation.navigate('MainStack', { screen: 'Landmark' });
              }}
              style={styles.selectButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cityImage: {
    width: 320,
    height: 200,
    borderRadius: 16,
    marginRight: 12,
  },
  content: {
    padding: 24,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 12,
    marginTop: 35,
  },
  countryName: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
    marginLeft: 2,
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
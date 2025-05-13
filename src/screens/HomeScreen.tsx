import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultCityPhoto from '../components/DefaultCityPhoto';

type HomeScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [user, setUser] = React.useState<any>(auth().currentUser);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 사용자 상태 실시간 감지
  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // 플랜 불러오기
  React.useEffect(() => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = firestore()
      .collection('plans')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot?.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || [];
        setPlans(data);
        setLoading(false);
      });
    return unsubscribe;
  }, [user]);

  return (
    <LinearGradient colors={['#A8FFCE', '#1CB5A3']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>RecoTrip</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
            >
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>

          {/* 메인 컨텐츠 */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              당신만의 특별한 여행을{"\n"}시작해보세요
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('MainStack', { screen: 'Start' })}
            >
              <Text style={styles.startButtonText}>출발하기</Text>
            </TouchableOpacity>
            {/* 내 플랜 카드: 로그인 시에만 */}
            {user && (
              <View style={{ width: '100%', marginTop: 32 }}>
                <Text style={{ color: '#197C6B', fontWeight: 'bold', fontSize: 18, marginBottom: 12, }}>내 플랜</Text>
                {loading ? (
                  <ActivityIndicator size="small" color="#1CB5A3" />
                ) : plans.length === 0 ? (
                  <Text style={{ color: '#888', textAlign: 'center', marginBottom: 12 }}>저장된 플랜이 없습니다.</Text>
                ) : (
                  <FlatList
                    data={plans}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 2 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.planCard, { width: 260, marginRight: 14 }]}
                        onPress={() => navigation.navigate('MainStack', { screen: 'MyPlanDetail', params: { plan: item } })}
                      >
                        <View style={{ marginBottom: 10 }}>
                          {item.selectedLandmarks?.[0]?.photo ? (
                            <Image
                              source={{ uri: item.selectedLandmarks[0].photo }}
                              style={styles.planImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <DefaultCityPhoto cityName={item.selectedCity?.name} width={260} height={120} />
                          )}
                        </View>
                        <Text style={styles.planName}>{item.tripName || '여행 플랜'}</Text>
                        <Text style={styles.planDate}>
                          {item.startDate?.toDate ? item.startDate.toDate().toLocaleDateString() : ''}
                          ~
                          {item.endDate?.toDate ? item.endDate.toDate().toLocaleDateString() : ''}
                        </Text>
                        <Text style={styles.planPeople}>인원: {typeof item.selectedPeople === 'number' ? item.selectedPeople : 0}명</Text>
                        <Text style={styles.planKeywords}>{item.selectedKeywords?.map((k: string) => `#${k}`).join(' ')}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  planCard: {
    backgroundColor: '#F6FDFD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 4,
  },
  planDate: {
    fontSize: 15,
    color: '#197C6B',
    marginBottom: 2,
  },
  planPeople: {
    fontSize: 14,
    color: '#197C6B',
    marginBottom: 2,
  },
  planKeywords: {
    fontSize: 14,
    color: '#1CB5A3',
  },
  planImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
});

export default HomeScreen; 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Button, Image } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import DefaultCityPhoto from '../components/DefaultCityPhoto';

const MyPlanScreen = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!user) return;
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

  // 뒤로 갈 스크린이 없으면 홈으로 이동
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStack', params: { screen: 'Home' } }],
      });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <CustomBackButton />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>로그인 후 내 플랜을 확인할 수 있습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton onPress={handleBack} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>내 여행 플랜</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1CB5A3" />
        ) : plans.length === 0 ? (
          <Text style={styles.text}>저장된 플랜이 없습니다.</Text>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.planCard}
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
      {/* 플랜 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', maxHeight: '85%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: '#197C6B' }}>플랜 상세 정보</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {selectedPlan && (
                <>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>여행 이름: {selectedPlan.tripName || '여행 플랜'}</Text>
                  <Text style={{ fontSize: 15, marginBottom: 4 }}>
                    날짜: {selectedPlan.startDate?.toDate ? selectedPlan.startDate.toDate().toLocaleDateString() : ''} ~ {selectedPlan.endDate?.toDate ? selectedPlan.endDate.toDate().toLocaleDateString() : ''}
                  </Text>
                  <Text style={{ fontSize: 15, marginBottom: 4 }}>인원: {selectedPlan.selectedPeople?.length || 0}명</Text>
                  <Text style={{ fontSize: 15, marginBottom: 4 }}>키워드: {selectedPlan.selectedKeywords?.map((k: string) => `#${k}`).join(' ')}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10, marginBottom: 4 }}>여행 경로</Text>
                  {selectedPlan.routes?.map && selectedPlan.routes.map((day: any, idx: number) => (
                    <View key={idx} style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', color: '#197C6B' }}>{day.day}일차</Text>
                      {day.places?.map && day.places.map((place: string, i: number) => (
                        <Text key={i} style={{ marginLeft: 8, color: '#333' }}>• {place}</Text>
                      ))}
                    </View>
                  ))}
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10, marginBottom: 4 }}>숙소 정보</Text>
                  {selectedPlan.selectedLodging && Object.values(selectedPlan.selectedLodging).map((hotel: any, i: number) => (
                    <Text key={i} style={{ marginLeft: 8, color: '#333' }}>• {hotel.name}</Text>
                  ))}
                </>
              )}
            </ScrollView>
            <Button title="닫기" onPress={() => setModalVisible(false)} color="#1CB5A3" />
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
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

export default MyPlanScreen; 
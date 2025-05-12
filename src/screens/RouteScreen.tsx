import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const DUMMY_ROUTES = [
  { day: 1, places: ['도쿄 타워', '하라주쿠'] },
  { day: 2, places: ['아사쿠사', '시부야 스크램블', '우에노 공원'] },
  { day: 3, places: ['도쿄 국립박물관', '오다이바'] },
];

const RouteScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const handleRegenerate = () => {
    Alert.alert('일정 재생성', 'GPT API를 호출하여 일정을 다시 생성합니다.');
  };

  const handleEdit = () => {
    Alert.alert('직접 수정', '직접 수정 화면으로 이동합니다.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>여행 일정</Text>
      </View>
      <FlatList
        data={DUMMY_ROUTES}
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
});

export default RouteScreen; 
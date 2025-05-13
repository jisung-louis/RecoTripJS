import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTripStore } from '../store/useTripStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StepIndicator = ({ step }: { step: number }) => (
  <View style={styles.stepIndicator}>
    {[0, 1, 2].map((s) => (
      <View key={s} style={[styles.stepDot, step === s && styles.activeDot]} />
    ))}
  </View>
);

const TripStepScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  // 상태: 인원, 날짜, 항공편
  const [people, setPeople] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [departTime, setDepartTime] = useState<Date>(new Date());
  const [arriveTime, setArriveTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showArrivePicker, setShowArrivePicker] = useState(false);
  const { setSelectedPeople, setDates, setSelectedFlight } = useTripStore();

  // 애니메이션 관련
  const translateX = useRef(new Animated.Value(0)).current;
  const [animating, setAnimating] = useState(false);

  // 스텝별 UI 렌더 함수
  const renderPeopleStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>몇 명이서 여행하시나요?</Text>
      <FlatList
        data={Array.from({ length: 10 }, (_, i) => i + 1)}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.numberButton, people === item && styles.selectedButton]}
            onPress={() => setPeople(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.numberText, people === item && styles.selectedText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderDateStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>여행 날짜를 선택하세요</Text>
      <Text style={styles.label}>시작일</Text>
      {Platform.OS === 'ios' ? (
        <DateTimePicker value={startDate} mode="date" display="default" onChange={(_, date) => date && setStartDate(date)} style={{ width: '100%' }} />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker value={startDate} mode="date" display="default" onChange={(_, date) => { setShowStartPicker(false); date && setStartDate(date); }} />
          )}
        </>
      )}
      <Text style={[styles.label, { marginTop: 24 }]}>종료일</Text>
      {Platform.OS === 'ios' ? (
        <DateTimePicker value={endDate} mode="date" display="default" onChange={(_, date) => date && setEndDate(date)} style={{ width: '100%' }} />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker value={endDate} mode="date" display="default" onChange={(_, date) => { setShowEndPicker(false); date && setEndDate(date); }} />
          )}
        </>
      )}
    </View>
  );

  const renderFlightStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>항공편 시간을 선택하세요</Text>
      <Text style={styles.label}>출발 시간</Text>
      {Platform.OS === 'ios' ? (
        <DateTimePicker value={departTime} mode="time" display="default" onChange={(_, date) => date && setDepartTime(date)} />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDepartPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{departTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showDepartPicker && (
            <DateTimePicker value={departTime} mode="time" display="default" onChange={(_, date) => { setShowDepartPicker(false); date && setDepartTime(date); }} />
          )}
        </>
      )}
      <Text style={[styles.label, { marginTop: 24 }]}>도착 시간</Text>
      {Platform.OS === 'ios' ? (
        <DateTimePicker value={arriveTime} mode="time" display="default" onChange={(_, date) => date && setArriveTime(date)} />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowArrivePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{arriveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showArrivePicker && (
            <DateTimePicker value={arriveTime} mode="time" display="default" onChange={(_, date) => { setShowArrivePicker(false); date && setArriveTime(date); }} />
          )}
        </>
      )}
    </View>
  );

  // 스텝별 컴포넌트 배열
  const stepComponents = [renderPeopleStep(), renderDateStep(), renderFlightStep()];

  // 애니메이션으로 스텝 변경
  const animateStep = (nextStep: number) => {
    if (animating) return;
    setAnimating(true);
    setPrevStep(step);
    // 방향 결정
    const direction = nextStep > step ? 1 : -1;
    // 시작 위치 설정
    translateX.setValue(direction * SCREEN_WIDTH);
    // step 상태 먼저 변경
    setStep(nextStep);
    // 애니메이션 실행
    Animated.timing(translateX, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setAnimating(false));
  };

  // 검증: 각 스텝별 필수값 입력 여부
  const isNextEnabled = () => {
    if (step === 0) return people !== null;
    if (step === 1) return startDate && endDate;
    if (step === 2) return departTime && arriveTime;
    return false;
  };

  // 완료(저장/전송) 핸들러
  const handleComplete = () => {
    // Zustand에 정보 저장
    if (people) setSelectedPeople(people);
    if (startDate && endDate) setDates(startDate, endDate);
    if (departTime && arriveTime) setSelectedFlight({
      departure: departTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      arrival: arriveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: startDate // 출발일 기준(필요시)
    });
    navigation.navigate('MainStack', { screen: 'Route' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <StepIndicator step={step} />
      </View>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          {stepComponents[step]}
        </Animated.View>
      </View>
      <View style={styles.bottomBar}>
        {step > 0 && (
          <CustomButton
            title="이전"
            type="secondary"
            onPress={() => animateStep(step - 1)}
            style={{ ...styles.nextButton, marginRight: 8 }}
          />
        )}
        <CustomButton
          title={step === 2 ? '완료' : '다음'}
          type="primary"
          disabled={!isNextEnabled()}
          onPress={() => {
            if (step < 2) animateStep(step + 1);
            else handleComplete();
          }}
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
    justifyContent: 'space-between',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0F7F3',
  },
  activeDot: {
    backgroundColor: '#1CB5A3',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  numberButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#E0F7F3',
    borderColor: '#1CB5A3',
  },
  numberText: {
    fontSize: 18,
    color: '#197C6B',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#1CB5A3',
  },
  label: {
    fontSize: 16,
    color: '#197C6B',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#197C6B',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#197C6B',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextButton: {
    width: 120,
  },
});

export default TripStepScreen; 
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const DateScreen = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const onStartDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) setStartDate(date);
    if (Platform.OS === 'android') setShowStartPicker(false);
  };
  const onEndDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) setEndDate(date);
    if (Platform.OS === 'android') setShowEndPicker(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>여행 날짜를 선택하세요</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>시작일</Text>
        {Platform.OS === 'ios' ? (
          <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} style={{ width: '100%' }} />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
            )}
          </>
        )}
        <Text style={[styles.label, { marginTop: 24 }]}>종료일</Text>
        {Platform.OS === 'ios' ? (
          <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} style={{ width: '100%' }} />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />
            )}
          </>
        )}
      </View>
      <View style={styles.bottomBar}>
        <CustomButton
          title="다음"
          type="primary"
          onPress={() => navigation.navigate('MainStack', { screen: 'Flight' })}
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
  pickerContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  label: {
    fontSize: 16,
    color: '#197C6B',
    fontWeight: 'bold',
    marginBottom: 8,
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
  nextButton: {
    width: '100%',
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#197C6B',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#197C6B',
  },
});

export default DateScreen;
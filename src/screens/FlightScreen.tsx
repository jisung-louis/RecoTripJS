import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const FlightScreen = () => {
  const [departTime, setDepartTime] = useState<Date>(new Date());
  const [arriveTime, setArriveTime] = useState<Date>(new Date());
  const [showDepartPicker, setShowDepartPicker] = useState<boolean>(false);
  const [showArrivePicker, setShowArrivePicker] = useState<boolean>(false);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const onDepartTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) setDepartTime(date);
  };
  const onArriveTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) setArriveTime(date);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>항공편 시간을 선택하세요</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>출발 시간</Text>
        {Platform.OS === 'android' ? (
          <>
            <TouchableOpacity onPress={() => setShowDepartPicker(true)}>
              <Text style={styles.label}>{departTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showDepartPicker && (
              <DateTimePicker
                value={departTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowDepartPicker(false);
                  if (date) setDepartTime(date);
                }}
              />
            )}
          </>
        ) : (
          <DateTimePicker value={departTime} mode="time" display="default" onChange={onDepartTimeChange} />
        )}
        <Text style={[styles.label, { marginTop: 24 }]}>도착 시간</Text>
        {Platform.OS === 'android' ? (
          <>
            <TouchableOpacity onPress={() => setShowArrivePicker(true)}>
              <Text style={styles.label}>{arriveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showArrivePicker && (
              <DateTimePicker
                value={arriveTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowArrivePicker(false);
                  if (date) setArriveTime(date);
                }}
              />
            )}
          </>
        ) : (
          <DateTimePicker value={arriveTime} mode="time" display="default" onChange={onArriveTimeChange} />
        )}
      </View>
      <View style={styles.bottomBar}>
        <CustomButton
          title="다음"
          type="primary"
          onPress={() => navigation.navigate('MainStack', { screen: 'Route' })}
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
});

export default FlightScreen;
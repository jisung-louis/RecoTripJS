import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';

const MyPlanScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>내 플랜 화면</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MyPlanScreen; 
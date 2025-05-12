import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const PeopleScreen = () => {
  const [people, setPeople] = useState<number | null>(null);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.title}>몇 명이서 여행하시나요?</Text>
      </View>
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
      <View style={styles.bottomBar}>
        <CustomButton
          title="다음"
          type="primary"
          disabled={people === null}
          onPress={() => navigation.navigate('MainStack', { screen: 'Date' })}
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
    paddingTop: 32,
    paddingBottom: 100,
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

export default PeopleScreen; 
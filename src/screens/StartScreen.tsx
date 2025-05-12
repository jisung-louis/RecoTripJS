import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';

type StartScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Start'>;

const StartScreen = () => {
  const navigation = useNavigation<StartScreenNavigationProp>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>어디로 가고 싶나요?</Text>
        <CustomButton
          title="Reco AI에게 추천 받기"
          type="secondary"
          onPress={() => navigation.navigate('MainStack', { screen: 'Keyword' })}
          style={styles.mainButton}
        />
        <CustomButton
          title="이미 정했어요"
          type="text"
          onPress={() => {}}
          style={styles.subButton}
        />
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
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#197C6B',
    marginBottom: 48,
    textAlign: 'center',
  },
  mainButton: {
    width: '90%',
    marginBottom: 16,
  },
  subButton: {
    marginTop: 8,
  },
});

export default StartScreen;
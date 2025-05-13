import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';

const PRIVACY_TEXT = `
[여기에 개인정보 처리방침 내용을 입력하세요.]

1. 수집하는 개인정보 항목
2. 개인정보의 수집 및 이용목적
3. 개인정보의 보유 및 이용기간
4. 개인정보의 제3자 제공
5. 개인정보의 파기절차 및 방법
6. 이용자의 권리와 행사방법
7. 기타

(실제 서비스에 맞는 내용을 입력하세요)
`;

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>개인정보 처리방침</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.bodyText}>{PRIVACY_TEXT}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#F6FDFD',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  bodyText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 26,
  },
});

export default PrivacyPolicyScreen; 
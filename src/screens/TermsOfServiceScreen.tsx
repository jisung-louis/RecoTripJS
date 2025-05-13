import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import CustomBackButton from '../components/CustomBackButton';

const TERMS_TEXT = `
[여기에 이용약관 내용을 입력하세요.]

제1조(목적)
제2조(정의)
제3조(약관의 효력 및 변경)
제4조(서비스의 제공 및 변경)
제5조(서비스의 중단)
제6조(회원가입)
제7조(회원 탈퇴 및 자격 상실)
제8조(회원에 대한 통지)
제9조(개인정보보호)
제10조(회사의 의무)
제11조(회원의 의무)
제12조(저작권의 귀속 및 이용제한)
제13조(분쟁해결)
제14조(재판권 및 준거법)

(실제 서비스에 맞는 내용을 입력하세요)
`;

const TermsOfServiceScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>이용약관</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.bodyText}>{TERMS_TEXT}</Text>
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

export default TermsOfServiceScreen; 
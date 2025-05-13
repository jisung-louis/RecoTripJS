import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import { createPost } from '../services/postService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PostWriteScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  // 로그인 유저의 닉네임 불러오기
  useEffect(() => {
    const fetchNickname = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('users').doc(user.uid).get();
        setNickname(!!doc.exists ? doc.data()?.nickname || '' : '');
      }
    };
    fetchNickname();
  }, []);

  // 게시글 저장 핸들러
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await createPost({ title: title.trim(), content: content.trim(), nickname });
      Alert.alert('작성 완료', '게시글이 등록되었습니다.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('오류', '게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>게시글 작성</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            placeholderTextColor="#888"
            maxLength={50}
          />
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            value={content}
            onChangeText={setContent}
            placeholder="내용을 입력하세요"
            placeholderTextColor="#888"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: '#B0B0B0' }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? '저장 중...' : '저장하기'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#197C6B',
    marginTop: 10,
    marginLeft: 8,
  },
  container: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: '#197C6B',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1CB5A3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default PostWriteScreen; 
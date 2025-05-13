import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import firestore from '@react-native-firebase/firestore';
import { updatePost } from '../services/postService';

const PostEditScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PostEdit'>>();
  const { postId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 게시글 정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const doc = await firestore().collection('posts').doc(postId).get();
        if (!!doc.exists) {
          const data = doc.data();
          setTitle(data?.title || '');
          setContent(data?.content || '');
          setNickname(data?.nickname || '');
        }
      } catch (e) {
        Alert.alert('오류', '게시글 정보를 불러오지 못했습니다.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // 게시글 수정 저장
  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !nickname.trim()) {
      Alert.alert('입력 오류', '제목, 내용, 닉네임을 모두 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await updatePost(postId, { title: title.trim(), content: content.trim() });
      Alert.alert('수정 완료', '게시글이 수정되었습니다.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('오류', '게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1CB5A3" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>게시글 수정</Text>
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
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
            editable={false}
          />
          <TouchableOpacity
            style={[styles.button, saving && { backgroundColor: '#B0B0B0' }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>{saving ? '저장 중...' : '저장하기'}</Text>
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

export default PostEditScreen; 
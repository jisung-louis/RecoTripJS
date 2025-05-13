import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import CustomBackButton from '../components/CustomBackButton';
import CommentItem from '../components/CommentItem';
import LikeButton from '../components/LikeButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { deletePost, addComment, deleteComment, toggleLike, isLikedByUser, getLikeCount } from '../services/postService';

const PostDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const userId = auth().currentUser?.uid || '';

  useEffect(() => {
    const unsubPost = firestore().collection('posts').doc(postId).onSnapshot(doc => {
      setPost({ id: doc.id, ...doc.data() });
      setLoading(false);
    });
    const unsubComments = firestore().collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'asc')
      .onSnapshot(snap => {
        setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    const fetchLike = async () => {
      setLikeCount(await getLikeCount(postId));
      setLiked(await isLikedByUser(postId, userId));
    };
    fetchLike();
    return () => { unsubPost(); unsubComments(); };
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '좋아요는 로그인 후 이용 가능합니다.');
      return;
    }
    const result = await toggleLike(postId, userId);
    setLiked(result);
    setLikeCount(await getLikeCount(postId));
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await addComment(postId, { content: comment.trim(), nickname: post?.nickname || '익명' });
    setComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert('댓글 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: async () => await deleteComment(postId, commentId) }
    ]);
  };

  const handleDeletePost = async () => {
    Alert.alert('게시글 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: async () => {
        await deletePost(postId);
        Alert.alert('삭제 완료', '게시글이 삭제되었습니다.');
        navigation.goBack();
      }}
    ]);
  };

  const handleReport = () => {
    Alert.alert('신고 접수 완료 (더미)');
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1CB5A3" />
      </SafeAreaView>
    );
  }

  const isMine = post.userId === userId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>게시글 상세</Text>
        <TouchableOpacity onPress={handleReport} style={{ marginLeft: 'auto', marginRight: 8 }}>
          <Text style={{ color: '#FF6B6B', fontWeight: 'bold' }}>신고</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CommentItem
            content={item.content}
            nickname={item.nickname}
            createdAt={item.createdAt?.toDate?.().toLocaleString?.() || ''}
            isMine={item.userId === userId}
            onDelete={() => handleDeleteComment(item.id)}
            onReport={handleReport}
          />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.nickname}>{post.nickname}</Text>
              <Text style={styles.time}>{post.createdAt?.toDate?.().toLocaleString?.() || ''}</Text>
            </View>
            <View style={styles.actionRow}>
              <LikeButton liked={liked} count={likeCount} onPress={handleLike} />
              {isMine && (
                <>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PostEdit', { postId })}>
                    <Text style={styles.actionText}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleDeletePost}>
                    <Text style={[styles.actionText, { color: '#FF6B6B' }]}>삭제</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.divider} />
            <Text style={styles.commentTitle}>댓글</Text>
          </View>
        }
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>아직 댓글이 없습니다.</Text>}
        ListFooterComponent={
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="댓글을 입력하세요"
              placeholderTextColor="#888"
              maxLength={200}
            />
            <TouchableOpacity style={styles.commentBtn} onPress={handleAddComment}>
              <Text style={styles.commentBtnText}>등록</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10, backgroundColor: '#F6FDFD', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#197C6B', marginTop: 10, marginLeft: 8 },
  container: { padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#197C6B', marginBottom: 8 },
  content: { fontSize: 16, color: '#222', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nickname: { color: '#197C6B', fontWeight: 'bold', fontSize: 14 },
  time: { color: '#888', fontSize: 13 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  actionBtn: { marginLeft: 8 },
  actionText: { color: '#197C6B', fontWeight: 'bold', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
  commentTitle: { fontSize: 16, color: '#197C6B', fontWeight: 'bold', marginBottom: 8 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 24 },
  commentInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#B0B0B0', paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, marginRight: 8 },
  commentBtn: { backgroundColor: '#1CB5A3', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  commentBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default PostDetailScreen; 
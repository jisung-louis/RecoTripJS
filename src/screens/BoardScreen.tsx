import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import SortTabs from '../components/SortTabs';
import firestore from '@react-native-firebase/firestore';
import { getLikeCount } from '../services/postService';
import CustomBackButton from '../components/CustomBackButton';

const PAGE_SIZE = 10;

const BoardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'latest' | 'like'>('latest');
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // 게시글 불러오기 (검색, 정렬, 무한스크롤)
  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true);
    let q: any = firestore().collection('posts');
    if (search.trim()) {
      q = q.orderBy('createdAt', 'desc');
    } else if (sort === 'latest') {
      q = q.orderBy('createdAt', 'desc');
    } else {
      q = q.orderBy('createdAt', 'desc'); // 좋아요순은 클라이언트에서 정렬
    }
    if (!reset && lastDoc) q = q.startAfter(lastDoc);
    q = q.limit(PAGE_SIZE);

    const snap = await q.get();
    let docs: any[] = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      docs = docs.filter(
        d =>
          (d.title?.toLowerCase?.().includes(keyword) ||
          d.content?.toLowerCase?.().includes(keyword))
      );
    }
    if (sort === 'like') {
      for (const d of docs) {
        d.likeCount = await getLikeCount(d.id);
      }
      docs.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    }
    setPosts(reset ? docs : [...posts, ...docs]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setHasMore(snap.docs.length === PAGE_SIZE);
    setLoading(false);
  }, [search, sort, lastDoc, posts]);

  useEffect(() => {
    fetchPosts(true);
  }, [search, sort]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastDoc(null);
    await fetchPosts(true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await fetchPosts();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FDFD' }}>
      <View style={styles.header}>
        <CustomBackButton />
        <Text style={styles.headerTitle}>게시판</Text>
        <TouchableOpacity style={styles.writeBtn} onPress={() => navigation.navigate('MainStack', { screen: 'PostWrite' })}>
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <SearchBar value={search} onChange={setSearch} />
        <SortTabs value={sort} onChange={setSort} />
        {loading && posts.length === 0 ? (
          <ActivityIndicator size="large" color="#1CB5A3" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PostCard
                title={item.title}
                content={item.content}
                nickname={item.nickname}
                createdAt={item.createdAt?.toDate?.().toLocaleString?.() || ''}
                likeCount={item.likeCount ?? 0}
                onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>게시글이 없습니다.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10, backgroundColor: '#F6FDFD', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#197C6B', flex: 1 },
  writeBtn: { backgroundColor: '#1CB5A3', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 },
  writeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  container: { flex: 1, padding: 18 },
});

export default BoardScreen; 
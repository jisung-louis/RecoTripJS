import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PostCardProps {
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  likeCount: number;
  onPress: () => void;
}

const PostCard = ({ title, content, nickname, createdAt, likeCount, onPress }: PostCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content} numberOfLines={2}>{content}</Text>
    <View style={styles.metaRow}>
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.time}>{createdAt}</Text>
      <Text style={styles.like}>♥ {likeCount}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#197C6B', marginBottom: 6 },
  content: { fontSize: 15, color: '#333', marginBottom: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nickname: { color: '#197C6B', fontWeight: 'bold', fontSize: 14 },
  time: { color: '#888', fontSize: 13 },
  like: { color: '#FF6B6B', fontWeight: 'bold', fontSize: 14 },
});

export default PostCard; 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CommentItemProps {
  content: string;
  nickname: string;
  createdAt: string;
  isMine: boolean;
  onDelete: () => void;
  onReport: () => void;
}

const CommentItem = ({ content, nickname, createdAt, isMine, onDelete, onReport }: CommentItemProps) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.time}>{createdAt}</Text>
    </View>
    <Text style={styles.content}>{content}</Text>
    <View style={styles.actionRow}>
      <TouchableOpacity onPress={onReport}>
        <Text style={styles.report}>신고</Text>
      </TouchableOpacity>
      {isMine && (
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.delete}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#F6FDFD', borderRadius: 10, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  nickname: { color: '#197C6B', fontWeight: 'bold', fontSize: 14 },
  time: { color: '#888', fontSize: 12 },
  content: { color: '#222', fontSize: 15, marginBottom: 4 },
  actionRow: { flexDirection: 'row', gap: 16 },
  report: { color: '#FF6B6B', fontSize: 13, marginRight: 12 },
  delete: { color: '#888', fontSize: 13 },
});

export default CommentItem; 
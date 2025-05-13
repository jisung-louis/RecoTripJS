import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// 게시글 생성
export const createPost = async ({ title, content, nickname }: { title: string; content: string; nickname: string }) => {
  return firestore().collection('posts').add({
    title,
    content,
    nickname,
    userId: auth().currentUser?.uid || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

// 게시글 수정
export const updatePost = async (postId: string, { title, content }: { title: string; content: string }) => {
  return firestore().collection('posts').doc(postId).update({
    title,
    content,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

// 게시글 삭제
export const deletePost = async (postId: string) => {
  return firestore().collection('posts').doc(postId).delete();
};

// 댓글 추가
export const addComment = async (postId: string, { content, nickname }: { content: string; nickname: string }) => {
  return firestore().collection('posts').doc(postId).collection('comments').add({
    content,
    nickname,
    userId: auth().currentUser?.uid || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// 댓글 삭제
export const deleteComment = async (postId: string, commentId: string) => {
  return firestore().collection('posts').doc(postId).collection('comments').doc(commentId).delete();
};

// 좋아요 토글
export const toggleLike = async (postId: string, userId: string) => {
  const likeRef = firestore().collection('posts').doc(postId).collection('likes').doc(userId);
  const doc = await likeRef.get();
  if (!!doc.exists) {
    await likeRef.delete();
    return false;
  } else {
    await likeRef.set({ createdAt: firestore.FieldValue.serverTimestamp() });
    return true;
  }
};

// 좋아요 개수 가져오기
export const getLikeCount = async (postId: string) => {
  const snap = await firestore().collection('posts').doc(postId).collection('likes').get();
  return snap.size;
};

// 유저가 좋아요 눌렀는지 확인
export const isLikedByUser = async (postId: string, userId: string) => {
  const doc = await firestore().collection('posts').doc(postId).collection('likes').doc(userId).get();
  return doc.exists;
}; 
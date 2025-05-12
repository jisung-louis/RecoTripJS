import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBackButton from '../components/CustomBackButton';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/StackNavigator';

const SUGGESTED_KEYWORDS = [
  '액티비티', '산', '강', '호수', '맛집', '바다', '휴양', '정글', '캠핑', '관광'
];

const KeywordScreen = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(['도심', '쇼핑']);
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'MainStack'>>();

  const addKeyword = (keyword: string) => {
    if (!selected.includes(keyword)) {
      setSelected([...selected, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSelected(selected.filter(k => k !== keyword));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <CustomBackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>원하는 키워드를 선택하세요</Text>
        <View style={styles.searchBoxWrapper}>
          <TextInput
            style={styles.searchBox}
            placeholder="키워드 검색"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Icon name="search" size={22} color="#197C6B" />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedWrapper}>
          {selected.map((keyword) => (
            <View key={keyword} style={styles.selectedTag}>
              <Text style={styles.selectedTagText}>{keyword}</Text>
              <TouchableOpacity onPress={() => removeKeyword(keyword)}>
                <Icon name="close" size={16} color="#888" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.divider} />
        <FlatList
          data={SUGGESTED_KEYWORDS}
          keyExtractor={(item) => item}
          numColumns={4}
          contentContainerStyle={styles.keywordsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.keywordTag}
              onPress={() => addKeyword(item)}
              disabled={selected.includes(item)}
            >
              <Text style={[styles.keywordTagText, selected.includes(item) && { color: '#B0B0B0' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <CustomButton
          title="다음"
          type="primary"
          onPress={() => navigation.navigate('MainStack', { screen: 'City' })}
          style={styles.nextButton}
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
    paddingHorizontal: 20,
    paddingTop: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#197C6B',
    textAlign: 'center',
    marginBottom: 28,
  },
  searchBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  searchIcon: {
    marginLeft: 8,
  },
  selectedWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    minHeight: 32,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  selectedTagText: {
    color: '#888',
    fontSize: 15,
    marginRight: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#B0B0B0',
    marginVertical: 12,
    opacity: 0.5,
  },
  keywordsList: {
    alignItems: 'flex-start',
  },
  keywordTag: {
    backgroundColor: '#B6F2E6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 10,
    marginBottom: 12,
    minWidth: 48,
    alignItems: 'center',
  },
  keywordTagText: {
    color: '#197C6B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default KeywordScreen; 
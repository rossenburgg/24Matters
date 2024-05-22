import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Text, View, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';
import { Alert, AlertIcon, AlertText, CheckCircleIcon, VStack } from '@gluestack-ui/themed';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNoResultsAlert, setShowNoResultsAlert] = useState(false); // State to control showing the alert
  const navigation = useNavigation();

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchQuery.trim() !== '') {
        setPage(1); // Reset to first page for new searches
        handleSearch(1); // Start from the first page for new searches
      } else {
        setUsers([]);
      }
    }, 300);
    debouncedSearch();
    // Cleanup debounce
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleSearch = async (searchPage) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await axios.get(`http://192.168.8.130:3001/api/users/search?q=${searchQuery}&page=${searchPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.users.length === 0) {
        setShowNoResultsAlert(true); // Set state to show the alert
        setUsers([]);
      } else {
        setShowNoResultsAlert(false); // Reset state if there are search results
        if (searchPage === 1) {
          setUsers(response.data.users);
        } else {
          setUsers(prev => [...prev, ...response.data.users]);
        }
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error searching users:', error.response ? error.response.data : error);
      Alert.alert('Error', 'Failed to fetch search results. Please try again later.');
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(nextPage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('UserProfileScreen', { userId: item._id })}>
            <Image source={{ uri: item.profilePictureUrl || 'https://via.placeholder.com/150' }} style={styles.profilePic} />
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
      {showNoResultsAlert && ( // Render the alert if showNoResultsAlert is true
        <Alert action='success' style={styles.container}>
          <AlertIcon as={CheckCircleIcon} size="xl" mr="$3" />
          <VStack space='xs'>
            <AlertText fontWeight ='bold'>
              No result
            </AlertText >
            <AlertText>
              No user found.
            </AlertText>
          </VStack>
        </Alert>
      )}
      {page < totalPages && (
        <Button title="Load More" onPress={loadMore} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default SearchScreen;

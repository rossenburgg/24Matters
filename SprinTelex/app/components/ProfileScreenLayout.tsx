import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';
import { InstagramSansText } from '@/components/StyledText';


const ProfileScreenLayout = () => {
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false); // State to track image uploading
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Authentication token not found.');
            }
            const response = await axios.get('http://192.168.8.130:3001/api/profile', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch profile data.');
            Alert.alert("Error", err.message || 'Failed to fetch profile data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const pickImageAndUpdate = async (isCoverPhoto) => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission to access gallery is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        setImageUploading(true); // Start uploading indicator
        updateProfilePhoto(pickerResult.uri, isCoverPhoto);
    };

    const updateProfilePhoto = async (imageUri, isCoverPhoto) => {
        const token = await AsyncStorage.getItem('userToken');
        const formData = new FormData();
        formData.append(isCoverPhoto ? 'coverImage' : 'profileImage', { uri: imageUri, name: isCoverPhoto ? 'cover.jpg' : 'profile.jpg', type: 'image/jpeg' });
        try {
            const response = await axios.patch('http://192.168.8.130:3001/api/profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                Alert.alert("Success", "Profile updated successfully");
                fetchProfile(); // Refresh profile data
            }
        } catch (err) {
            console.error("Error updating profile photo:", err.response || err);
            setError(err.message || 'Failed to update profile photo.');
            Alert.alert("Error", err.response?.data?.message || "Failed to update profile photo.");
        } finally {
            setImageUploading(false); // End uploading indicator
        }
    };

    if (isLoading || imageUploading) { // Show loading indicator if fetching profile or uploading image
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <View style={styles.container}>
                {error ? (
                    <InstagramSansText style={styles.error}>{error}</InstagramSansText>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => pickImageAndUpdate(true)}>
                            <View style={styles.coverPhotoContainer}>
                                <Image source={{ uri: profile?.coverPhotoUrl || 'https://via.placeholder.com/150' }} style={styles.coverPhoto} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAndUpdate(false)}>
                            <View style={styles.profilePhotoContainer}>
                                <Image source={{ uri: profile?.profilePhotoUrl || 'https://via.placeholder.com/150' }} style={styles.profilePhoto} />
                            </View>
                        </TouchableOpacity>
                        <InstagramSansText style={styles.username}>{profile?.username || 'Username'}</InstagramSansText>
                        <Text style={styles.bio}>{profile?.bio || 'This is a bio placeholder text.'}</Text>
                        <Button title="Followers" onPress={() => navigation.navigate('FollowersScreen', { userId: profile?._id })} />
                        <Button title="Following" onPress={() => navigation.navigate('FollowingScreen', { userId: profile?._id })} />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
      
    },
    coverPhotoContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#e1e4e8',
    },
    coverPhoto: {
        width: '100%',
        height: '100%',
    },
    profilePhotoContainer: {
        marginTop: -50,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'white',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bio: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    error: {
        color: 'red',
    },
});

export default ProfileScreenLayout;
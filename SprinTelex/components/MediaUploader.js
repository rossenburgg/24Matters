import React, { useState } from 'react';
import { Button, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const MediaUploader = ({ onUploadSuccess }) => {
  const [media, setMedia] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia(result.uri);
    }
  };

  const uploadMedia = async () => {
    const formData = new FormData();
    formData.append('media', {
      uri: media,
      name: 'upload.' + media.split('.').pop(),
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(`http://192.168.8.130:3001/api/upload-media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data.filePath);
      onUploadSuccess(response.data.filePath);
    } catch (error) {
      console.error('Error uploading media:', error);
      console.error(error.message);
    }
  };

  return (
    <View>
      <Button title="Pick Media" onPress={pickMedia} />
      {media && <Button title="Upload Media" onPress={uploadMedia} />}
    </View>
  );
};

export default MediaUploader;
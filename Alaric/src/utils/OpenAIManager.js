import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import axios from 'axios';
import Constants from 'expo-constants';

// Assuming the OpenAI API Key is stored in app.json under extra
const openAIKey = Constants.manifest.extra.openAIKey;

class OpenAIManager {
  static async transcribeAudio(audioPath) {
    try {
      // Ensure the audio file exists
      const fileInfo = await FileSystem.getInfoAsync(audioPath);
      if (!fileInfo.exists) {
        console.error('Audio file does not exist:', audioPath);
        throw new Error(`Audio file does not exist at path: ${audioPath}`);
      }
      const fileUri = fileInfo.uri;

      // Determine the MIME type of the audio file
      const fileType = this.getMimeType(fileUri);

      // Prepare the audio file for uploading
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: `audio-${Date.now()}.${fileType.split('/')[1]}`, // Naming the file with current timestamp
      });

      // Transcribe the audio using OpenAI's Whisper model
      const transcriptionResponse = await axios.post('https://api.openai.com/v1/whisper', formData, {
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (transcriptionResponse.status === 200) {
        console.log('Transcription successful:', transcriptionResponse.data);
        return transcriptionResponse.data;
      } else {
        console.error('Failed to transcribe audio:', transcriptionResponse.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error in transcribing audio file:', error);
      throw error;
    }
  }

  static getMimeType(fileUri) {
    const extension = fileUri.split('.').pop();
    switch (extension.toLowerCase()) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'm4a':
        return 'audio/x-m4a';
      default:
        return 'application/octet-stream'; // Fallback MIME type
    }
  }
}

export default OpenAIManager;
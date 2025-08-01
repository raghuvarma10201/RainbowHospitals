import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Button,
  PermissionsAndroid,
  Linking,
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { greenColor, purpuleColor, whiteColor } from '../Constants/Constant';
import { RootStackParamList } from '../utils/types';

import { API_IMG_URL } from '../utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { pick, types } from '@react-native-documents/picker';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
  PlayBackType,
} from 'react-native-audio-recorder-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { fetchAppointmentChat, sendAppointmentChat } from '../services/common';
import { ToastService } from '../utils/ToastService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
const audioRecorderPlayer = new AudioRecorderPlayer();
const screen_height = Dimensions.get('window').height;
const screen_width = Dimensions.get('window').width;

const AppointmentChat: React.FC<any> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {bookingId} = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Doctor', message: 'Hi', media: [{ file_path: '' }] },
  ]);
  const [mediaFile, setMediaFile] = useState({ name: '', uri: '', type: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [typeOfMedia, setTypeOfMedia] = useState('');
  const [recordTime, setRecordTime] = useState('');
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [playStarted, setPlayStarted] = useState(false);


  useEffect(() => {
    fetchChat();
    requestMediaPermissions();
  }, []);

  const requestMediaPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        console.log('write external storage', grants);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const fetchChat = async () => {
    try {
      const data = await fetchAppointmentChat(bookingId);
      const chat = data?.data || [];
      setMessages(chat);
      console.log(chat);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages([]);
    } finally {
    }
  };

  const sendMessage = async () => {
    try {
      let formdata = new FormData();
      formdata.append('sender', 'Patient');
      formdata.append('receiver', 'Doctor');
      formdata.append('message', inputText);
      formdata.append('bookingUID', bookingId);
      if (mediaFile?.name) formdata.append('document', mediaFile);
      
      const response = await sendAppointmentChat(formdata);
      console.log(response);
      if (response && response.status == 200) {
        console.log('message sent', response);
        setInputText('');
        fetchChat();
      } else {
        //setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages([]);
    } finally {
    }
  };
  const selectMediaType = async (mediaType: string) => {
    switch (mediaType) {
      case 'cam':
        console.log('camera selected');
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        }).then(image => {
          console.log(image);
        });
        break;
      case 'img':
        console.log('image selected');
        ImagePicker.openPicker({
          mediaType: 'photo',
        }).then(image => {
          console.log(image);
          setMediaFile({
            uri: image?.path,
            type: image?.mime,
            name: 'image.jpg',
          });
          setTypeOfMedia('');
        });
        break;
      case 'vid':
        console.log('video selected');
        ImagePicker.openPicker({
          mediaType: 'video',
        }).then(video => {
          console.log(video);
          setMediaFile({
            uri: video?.path,
            type: video?.mime,
            name: 'video.mp4',
          });
          setTypeOfMedia('');
        });
        break;
      case 'file':
        console.log('file selected');
        const result = await pick({
          type: [types.pdf, types.docx, types.doc],
        });
        console.log(result);
        setMediaFile({
          uri: result[0]?.uri,
          type: result[0]?.type || '',
          name:
            result[0]?.type?.includes('document') ||
              result[0]?.type?.includes('msword')
              ? 'upload.doc'
              : 'upload.pdf',
        });
      case 'aud':
        console.log('audio selected');
        setRecordingStarted(prev => !prev);
        onStartRecord();
      default:
        break;
    }
  };

  const openDocument = (url: string) => {
    Linking.openURL(url);
  };

  const onStartRecord = async () => {
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      console.log('Recording progress:', e.currentPosition, e.currentMetering);
      // setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });

    const result = await audioRecorderPlayer.startRecorder();
    console.log('Recording started:', result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log('Recording stopped:', result);
    setRecordingStarted(prev => !prev);
    setMediaFile({
      uri: result,
      type: 'audio/mpeg',
      name: 'audio.mp3',
    });
  };

  const onStartPlay = async () => {
    // Set up playback progress listener
    setPlayStarted(prev => !prev);
    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      console.log('Playback progress:', e.currentPosition, e.duration);
      if (e.currentPosition === e.duration) {
        onStopPlay();
      }
    });

    const result = await audioRecorderPlayer.startPlayer();
    console.log('Playback started:', result);
  };

  const onStopPlay = async () => {
    setPlayStarted(prev => !prev);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.messagesContainer}>
        {messages.reverse().map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === 'Patient' ? styles.userBubble : styles.aiBubble,
            ]}>
            {msg?.media?.length
              ? msg?.media?.map((file, index) =>
                file?.file_path.includes('.mp4') ? (
                  <View>
                    <Video
                      source={{
                        uri: `${API_IMG_URL}/${file?.file_path}`.replace(
                          /\\/g,
                          '/',
                        ),
                      }}
                      paused={!isPlaying}
                      style={styles.media}
                      onEnd={() => setIsPlaying(p => !p)}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPlaying(p => !p)}
                      style={styles.playPauseIcon}>
                      <Icon
                        name={!isPlaying ? 'play-sharp' : 'pause'}
                        color={'white'}
                        size={screen_width * 0.06}
                      />
                    </TouchableOpacity>
                  </View>
                ) : file?.file_path.includes('.pdf') ||
                  file?.file_path.includes('.doc') ? (
                  <TouchableOpacity
                    onPress={() =>
                      openDocument(
                        `${API_IMG_URL}/${file?.file_path}`.replace(
                          /\\/g,
                          '/',
                        ),
                      )
                    }
                    style={styles.document}>
                    <Text style={styles.documentName}>
                      {file?.file_path.replace(/\\/g, '/').split('/').pop()}
                    </Text>
                  </TouchableOpacity>
                ) : file?.file_path.includes('.mp3') ? (
                  <View
                    style={[
                      styles.document,
                      { flexDirection: 'row', gap: screen_width * 0.02 },
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        playStarted ? onStopPlay() : onStartPlay()
                      }
                      style={styles.playPause}>
                      <Icon
                        name={playStarted ? 'stop-circle' : 'play'}
                        color={'#00000080'}
                        size={screen_width * 0.065}
                      />
                    </TouchableOpacity>
                    <Text style={styles.documentName}>
                      {file?.file_path.replace(/\\/g, '/').split('/').pop()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{
                      uri: `${API_IMG_URL}/${file?.file_path}`.replace(
                        /\\/g,
                        '/',
                      ),
                    }}
                    style={styles.media}
                  />
                ),
              )
              : null}
            <Text style={styles.messageText}>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWithIcon}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            style={styles.input}
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setTypeOfMedia('gallery')}>
              <Icon
                name="images"
                color={'#00000080'}
                size={screen_width * 0.06}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectMediaType('file')}>
              <Icon
                name="document"
                color={'#00000080'}
                size={screen_width * 0.06}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                recordingStarted
                  ? onStopRecord()
                  : ToastService.error('Long press to start recording')
              }
              onLongPress={() => selectMediaType('aud')}>
              <Icon
                name={recordingStarted ? 'stop-circle' : 'mic'}
                color={'#00000080'}
                size={screen_width * 0.065}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            inputText
              ? sendMessage()
              : ToastService.error('Please enter a message to send')
          }
          style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
        {typeOfMedia == 'gallery' && (
          <View style={styles.floatingLabel}>
            {/* <TouchableOpacity onPress={() => selectMediaType('cam')}>
              <Icon
                name={'camera'}
                color={whiteColor}
                size={screen_width * 0.06}
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => selectMediaType('img')}>
              <Icon
                name={'image'}
                color={whiteColor}
                size={screen_width * 0.06}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectMediaType('vid')}>
              <Icon
                name={'videocam'}
                color={whiteColor}
                size={screen_width * 0.06}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTypeOfMedia('')}>
              <Icon
                name="close"
                color={whiteColor}
                size={screen_width * 0.06}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
export default AppointmentChat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#f3dcfa',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#EEE',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'right',
    marginVertical: 5,
  },
  media: {
    // height: 'auto',
    height: screen_height * 0.2,
    width: screen_width * 0.6,
    resizeMode: 'cover',
  },
  playPauseIcon: {
    position: 'absolute',
    right: '40%',
    top: '35%',
    padding: screen_width * 0.025,
    borderWidth: 0.7,
    borderRadius: screen_width,
    borderColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  document: {
    padding: screen_width * 0.02,
    backgroundColor: '#00000010',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  documentName: {
    color: '#000',
    fontSize: 16,
  },
  playPause: {},
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  inputWithIcon: {
    flexDirection: 'row',
    width: screen_width * 0.75,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginEnd: screen_width * 0.02,
  },
  input: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    width: '65%',
  },
  iconContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sendButton: {
    backgroundColor: purpuleColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
  },
  floatingLabel: {
    position: 'absolute',
    paddingHorizontal: screen_width * 0.03,
    paddingVertical: screen_height * 0.013,
    backgroundColor: '#631879',
    borderRadius: screen_width,
    top: -screen_height * 0.06,
    right: screen_width * 0.2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: screen_width * 0.03,
  },
});



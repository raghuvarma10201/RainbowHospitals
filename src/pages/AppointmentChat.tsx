import React, {useEffect, useRef, useState} from 'react';
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
  PermissionsAndroid,
  Linking,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {pallette, purpuleColor, whiteColor} from '../Constants/Constant';
import {API_IMG_URL} from '../utils/environment';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {pick, types} from '@react-native-documents/picker';
import {RecordBackType, PlayBackType} from 'react-native-audio-recorder-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {fetchAppointmentChat, sendAppointmentChat} from '../services/common';
import {ToastService} from '../utils/ToastService';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/types';
import CommonHeader from '../components/header';
import {adjust} from '../utils/commonFunctions';

const audioRecorderPlayer = new AudioRecorderPlayer();
const screen_height = Dimensions.get('window').height;
const screen_width = Dimensions.get('window').width;

const AppointmentChat: React.FC<any> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const {bookingId, doctor} = route.params;

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {sender: 'Doctor', message: 'Hi', media: [{file_path: ''}]},
  ]);
  const [mediaFile, setMediaFile] = useState({name: '', uri: '', type: ''});
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
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const fetchChat = async () => {
    try {
      const data = await fetchAppointmentChat(bookingId);
      const chat = data?.data?.reverse() || [];
      setMessages(chat);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages([]);
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
      if (response && response.status == 200) {
        setInputText('');
        setMediaFile({name: '', uri: '', type: ''});
        setTypeOfMedia('');
        fetchChat();
        scrollViewRef.current?.scrollToEnd({animated: true});
      } else {
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      console.error('Error sending chat:', error);
    }
  };

  const selectMediaType = async (mediaType: string) => {
    switch (mediaType) {
      case 'img':
        ImagePicker.openPicker({mediaType: 'photo'}).then(image => {
          setMediaFile({
            uri: image?.path,
            type: image?.mime,
            name: 'image.jpg',
          });
          setTypeOfMedia('');
        });
        break;
      case 'vid':
        ImagePicker.openPicker({mediaType: 'video'}).then(video => {
          setMediaFile({
            uri: video?.path,
            type: video?.mime,
            name: 'video.mp4',
          });
          setTypeOfMedia('');
        });
        break;
      case 'file':
        const result = await pick({type: [types.pdf, types.docx, types.doc]});
        setMediaFile({
          uri: result[0]?.uri,
          type: result[0]?.type || '',
          name: result[0]?.name || 'upload',
        });
        break;
      case 'aud':
        setRecordingStarted(prev => !prev);
        onStartRecord();
        break;
      default:
        break;
    }
  };

  const openDocument = (url: string) => {
    Linking.openURL(url);
  };

  const onStartRecord = async () => {
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    await audioRecorderPlayer.startRecorder();
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordingStarted(prev => !prev);
    setMediaFile({
      uri: result,
      type: 'audio/mpeg',
      name: 'audio.mp3',
    });
  };

  const onStartPlay = async () => {
    setPlayStarted(prev => !prev);
    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      if (e.currentPosition === e.duration) {
        onStopPlay();
      }
    });
    await audioRecorderPlayer.startPlayer();
  };

  const onStopPlay = async () => {
    setPlayStarted(prev => !prev);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <CommonHeader showLocation={false} title={doctor || 'Doctor'} />

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
        {messages?.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === 'Patient' ? styles.userBubble : styles.aiBubble,
              index === messages.length - 1 && {
                marginBottom: screen_height * 0.03,
              },
            ]}>
            {msg?.media?.length
              ? msg?.media?.map((file, index) =>
                  file?.file_path.includes('.mp4') ? (
                    <View key={index}>
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
                      key={index}
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
                      key={index}
                      style={[
                        styles.document,
                        {flexDirection: 'row', gap: screen_width * 0.02},
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
                      key={index}
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

      {/* File preview before sending */}
      {mediaFile?.uri ? (
        <View style={styles.previewContainer}>
          {mediaFile.type.startsWith('image') ? (
            <Image source={{uri: mediaFile.uri}} style={styles.previewImage} />
          ) : mediaFile.type.startsWith('video') ? (
            <Video
              source={{uri: mediaFile.uri}}
              style={styles.previewImage}
              paused={true}
              resizeMode="cover"
            />
          ) : mediaFile.type.startsWith('audio') ? (
            <View style={styles.previewFile}>
              <Icon name="musical-notes" size={24} color="#000" />
              <Text style={styles.previewFileName}>{mediaFile.name}</Text>
            </View>
          ) : (
            <View style={styles.previewFile}>
              <Icon name="document" size={24} color="#000" />
              <Text style={styles.previewFileName}>{mediaFile.name}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setMediaFile({name: '', uri: '', type: ''})}
            style={styles.removePreview}>
            <Icon name="close-circle" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      ) : null}

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
            inputText || mediaFile.uri
              ? sendMessage()
              : ToastService.error(
                  'Please enter a message or select a file to send',
                )
          }
          style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
        {typeOfMedia == 'gallery' && (
          <View style={styles.floatingLabel}>
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
    backgroundColor: pallette.white,
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
    fontSize: adjust(14),
    textAlign: 'right',
    marginVertical: 5,
  },
  media: {
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
  documentName: {color: pallette.black, fontSize: 16},
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: adjust(14),
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
  sendText: {color: pallette.white, fontSize: 16},
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
  // New preview styles
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
    position: 'relative',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  previewFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewFileName: {
    fontSize: adjust(12),
    maxWidth: 150,
  },
  removePreview: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

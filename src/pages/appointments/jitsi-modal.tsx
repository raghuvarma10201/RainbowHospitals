import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  View,
  BackHandler,
  Platform,
  StatusBar,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {adjust} from '../../utils/common-functions';
import {h, pallette, w} from '../../constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {pick, types} from '@react-native-documents/picker';
import {RecordBackType, PlayBackType} from 'react-native-audio-recorder-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {styles as chatStyles} from './common-styles';
import {API_IMG_URL, ToastService} from '../../utils';
import {fetchAppointmentChat, sendAppointmentChat} from '../../services/common';

interface JitsiModalProps {
  visible: boolean;
  options?: any; // adjust type as needed
  onClose: () => void;
}

// === Constants ===
const initialScreen = Dimensions.get('window');
const CORNER_MARGIN = 10;
const audioRecorderPlayer = new AudioRecorderPlayer();

const JitsiModal: FC<JitsiModalProps> = ({visible, options, onClose}: any) => {
  const jitsiMeeting = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [minimized, setMinimized] = useState(false);
  const [conferenceActive, setConferenceActive] = useState(false);
  const [rxValue, setRxValue] = React.useState('');
  const [pipMode, setPipMode] = useState(false);

  const [screen, setScreen] = useState(initialScreen);

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
  const [isSending, setIsSending] = useState(false); // loader state
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState(false);

  useEffect(() => {
    const listener = ({window}: {window: any}) => setScreen(window);
    const sub = Dimensions.addEventListener('change', listener);
    return () => {
      // handle different RN versions
      // @ts-ignore
      if (typeof sub?.remove === 'function') sub.remove();
      // @ts-ignore
      else Dimensions.removeEventListener?.('change', listener);
    };
  }, []);

  // Animated height for smooth transition
  const animatedHeight = useRef(new Animated.Value(screen.height)).current;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: minimized ? screen.height : screen.height,
      useNativeDriver: false,
    }).start();
  }, [minimized, screen.height]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setConferenceActive(false);
      setPipMode(false);
      setMinimized(false);
      jitsiMeeting.current?.close?.();
    }
  }, [visible]);

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current?.close?.();
    onClose?.();
  }, [onClose]);

  const eventListeners = useMemo(
    () => ({
      onReadyToClose,
      onConferenceJoined: () => setConferenceActive(true),
      onConferenceTerminated: () => setConferenceActive(false),
      onEnterPip: () => setPipMode(true),
      onExitPip: () => setPipMode(false),
    }),
    [onReadyToClose],
  );

  // Android Back button → minimize instead of close
  useEffect(() => {
    const onBackPress = () => {
      if (visible && !minimized) {
        setMinimized(true);
        return true;
      }
      return false;
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    };
  }, [visible, minimized]);

  if (!visible || !options?.roomName) return null;

  const iconSize = Math.max(24, Math.round(screen.width * 0.07));
  const miniIconSize = Math.max(16, Math.round(screen.width * 0.06));

  const handleMinimize = useCallback(() => setMinimized(true), []);
  const handleExpand = useCallback(() => setMinimized(false), []);

  useEffect(() => {
    fetchChat();
    requestMediaPermissions();
  }, []);

  const requestMediaPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      } catch (error: any) {
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
      }
    }
  };

  const fetchChat = async () => {
    try {
      const data = await fetchAppointmentChat(options?.bookingId);
      const chat = data?.data || [];
      setMessages(chat);
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    try {
      setIsSending(true);
      let formdata = new FormData();
      formdata.append('sender', 'Patient');
      formdata.append('receiver', 'Doctor');
      formdata.append('message', inputText);
      formdata.append('bookingUID', options?.bookingId);
      if (mediaFile?.name) formdata.append('document', mediaFile);

      const response = await sendAppointmentChat(formdata);
      if (response && response.status == 200) {
        setInputText('');
        setMediaFile({name: '', uri: '', type: ''});
        setTypeOfMedia('');
        setPreviewVideoPlaying(false);
        fetchChat();
        scrollViewRef.current?.scrollToEnd({animated: true});
      } else {
        ToastService.error('Error', response.message);
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setIsSending(false);
    }
  };

  const selectMediaType = async (mediaType: string) => {
    try {
      switch (mediaType) {
        case 'img':
        case 'vid': {
          const isPhoto = mediaType === 'img';
          const picked = await ImagePicker.openPicker({
            mediaType: isPhoto ? 'photo' : 'video',
          });
          setMediaFile({
            uri: picked?.path,
            type: picked?.mime,
            name: isPhoto ? 'image.jpg' : 'video.mp4',
          });
          break;
        }
        case 'file': {
          const [result] = await pick({
            type: [types.pdf, types.docx, types.doc],
          });
          if (result) {
            setMediaFile({
              uri: result.uri,
              type: result.type || '',
              name: result.name || 'upload',
            });
          }
          break;
        }
        case 'aud': {
          setRecordingStarted(prev => !prev);
          onStartRecord();
          break;
        }
        default:
          console.warn(`Unsupported media type: ${mediaType}`);
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
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
    <Animated.View
      style={[
        styles.jitsiWrapper,
        minimized ? styles.jitsiMinimized : styles.jitsiFull,
        {height: animatedHeight},
      ]}
      pointerEvents="box-none">
      {conferenceActive && !pipMode && !minimized && (
        <TouchableOpacity
          onPress={handleMinimize}
          style={[
            styles.minimizeButton,
            {top: (StatusBar.currentHeight || 0) * 2},
          ]}>
          <Image
            source={require('../../../assets/images/compress-icon.png')}
            style={{height: iconSize, width: iconSize, resizeMode: 'cover'}}
          />
        </TouchableOpacity>
      )}

      {conferenceActive && !pipMode && minimized && (
        <TouchableOpacity onPress={handleExpand} style={styles.expandOverlay}>
          <Image
            source={require('../../../assets/images/expand-icon.png')}
            style={{
              height: miniIconSize,
              width: miniIconSize,
              resizeMode: 'cover',
            }}
          />
        </TouchableOpacity>
      )}
      <View style={{flex: 1}}>
        <View style={{flex: minimized ? 1 : 0.93}}>
          <JitsiMeeting
            ref={jitsiMeeting}
            token={options.token}
            room={options.roomName}
            serverURL={options.serverURL || 'https://meet.jit.si'}
            style={{flex: 1}}
            config={{
              hideConferenceTimer: true,
              toolbarButtons: [
                'microphone',
                'camera',
                'toggle-share-screen',
                'switch-camera',
                'overflowmenu',
                'hangup',
                'desktop',
              ],
            }}
            eventListeners={eventListeners}
            flags={{
              'audioMute.enabled': true,
              'fullscreen.enabled': false,
              'android.screensharing.enabled': true,
              'ios.screensharing.enabled': true,
              'pip.enabled': false,
              'welcomepage.enabled': false,
              'recording.enabled': true,
              'live-streaming.enabled': true,
              'videoMute.enabled': true,
            }}
            userInfo={{
              displayName: options.patient?.name || 'Patient',
              email: '',
              avatarURL: '',
            }}
          />
        </View>

        {minimized && (
          <View style={styles.belowView}>
            {/* <View style={styles.mainContainer}>
              <View style={{paddingHorizontal: 12}}>
                <Text style={styles.title}>Prescription</Text>
                <View style={styles.textAreaContainer}>
                  <RxIcon width={24} height={24} />
                  <TextInput
                    value={rxValue}
                    onChangeText={setRxValue}
                    placeholder="Write your notes here..."
                    multiline
                    numberOfLines={3}
                    style={styles.textArea}
                  />
                </View>

                <TouchableOpacity style={styles.uploadBtn}>
                  <UploadIcon width={18} height={18} color={pallette.black} />
                  <Text style={styles.uploadBtnTxt}>Upload Prescription</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <KeyboardAvoidingView
              style={[chatStyles.container, {marginBottom: h * 0.04}]}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
              <ScrollView
                style={chatStyles.messagesContainer}
                ref={scrollViewRef}
                onContentSizeChange={() =>
                  scrollViewRef.current?.scrollToEnd({animated: true})
                }>
                {messages?.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      chatStyles.messageBubble,
                      msg.sender === 'Patient'
                        ? chatStyles.userBubble
                        : chatStyles.aiBubble,
                      index === messages.length - 1 && {
                        marginBottom: h * 0.03,
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
                                style={chatStyles.media}
                                onEnd={() => setIsPlaying(p => !p)}
                              />
                              <TouchableOpacity
                                onPress={() => setIsPlaying(p => !p)}
                                style={chatStyles.playPauseIcon}>
                                <Icon
                                  name={!isPlaying ? 'play-sharp' : 'pause'}
                                  color={'white'}
                                  size={w * 0.06}
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
                              style={chatStyles.document}>
                              <Text style={chatStyles.documentName}>
                                {file?.file_path
                                  .replace(/\\/g, '/')
                                  .split('/')
                                  .pop()}
                              </Text>
                            </TouchableOpacity>
                          ) : file?.file_path.includes('.mp3') ? (
                            <View
                              key={index}
                              style={[
                                chatStyles.document,
                                {
                                  flexDirection: 'row',
                                  gap: w * 0.02,
                                },
                              ]}>
                              <TouchableOpacity
                                onPress={() =>
                                  playStarted ? onStopPlay() : onStartPlay()
                                }>
                                <Icon
                                  name={playStarted ? 'stop-circle' : 'play'}
                                  color={'#00000080'}
                                  size={w * 0.065}
                                />
                              </TouchableOpacity>
                              <Text style={chatStyles.documentName}>
                                {file?.file_path
                                  .replace(/\\/g, '/')
                                  .split('/')
                                  .pop()}
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
                              style={chatStyles.media}
                            />
                          ),
                        )
                      : null}
                    {msg.message && (
                      <Text style={chatStyles.messageText}>{msg.message}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* File preview before sending */}
              {mediaFile?.uri ? (
                <View style={chatStyles.previewContainer}>
                  {mediaFile.type.startsWith('image') ? (
                    <Image
                      source={{uri: mediaFile.uri}}
                      style={chatStyles.previewImage}
                    />
                  ) : mediaFile.type.startsWith('video') ? (
                    <View>
                      <Video
                        source={{uri: mediaFile.uri}}
                        style={chatStyles.previewImage}
                        paused={!previewVideoPlaying}
                        resizeMode="cover"
                        onEnd={() => setPreviewVideoPlaying(false)}
                      />
                      <TouchableOpacity
                        onPress={() => setPreviewVideoPlaying(p => !p)}
                        style={chatStyles.playPauseIcon}>
                        <Icon
                          name={!previewVideoPlaying ? 'play-sharp' : 'pause'}
                          color={'white'}
                          size={w * 0.03}
                        />
                      </TouchableOpacity>
                      <Text style={chatStyles.previewFileName}>
                        {mediaFile.name}
                      </Text>
                    </View>
                  ) : mediaFile.type.startsWith('audio') ? (
                    <View style={chatStyles.previewFile}>
                      <TouchableOpacity
                        onPress={() =>
                          playStarted ? onStopPlay() : onStartPlay()
                        }>
                        <Icon
                          name={playStarted ? 'stop-circle' : 'play'}
                          size={28}
                          color="#000"
                        />
                      </TouchableOpacity>
                      <Text style={chatStyles.previewFileName}>
                        {mediaFile.name}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={chatStyles.previewFile}
                      onPress={() => Linking.openURL(mediaFile.uri)}>
                      <Icon name="document" size={24} color="#000" />
                      <Text style={chatStyles.previewFileName}>
                        {mediaFile.name}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => setMediaFile({name: '', uri: '', type: ''})}
                    style={chatStyles.removePreview}>
                    <Icon name="close-circle" size={28} color="#000" />
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={chatStyles.inputContainer}>
                <View style={chatStyles.inputWithIcon}>
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                    placeholderTextColor={pallette.dark_grey}
                    style={chatStyles.input}
                  />
                  <View style={chatStyles.iconContainer}>
                    <TouchableOpacity onPress={() => setTypeOfMedia('gallery')}>
                      <Icon name="images" color={'#00000080'} size={w * 0.06} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectMediaType('file')}>
                      <Icon
                        name="document"
                        color={'#00000080'}
                        size={w * 0.06}
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
                        size={w * 0.065}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  disabled={isSending}
                  onPress={() =>
                    inputText || mediaFile.uri
                      ? sendMessage()
                      : ToastService.error(
                          'Please enter a message or select a file to send',
                        )
                  }
                  style={[chatStyles.sendButton, isSending && {opacity: 0.6}]}>
                  {isSending ? (
                    <ActivityIndicator size="small" color={pallette.white} />
                  ) : (
                    <Text style={chatStyles.sendText}>Send</Text>
                  )}
                </TouchableOpacity>
                {typeOfMedia == 'gallery' && (
                  <View style={chatStyles.floatingLabel}>
                    <TouchableOpacity onPress={() => selectMediaType('img')}>
                      <Icon
                        name={'image'}
                        color={pallette.white}
                        size={w * 0.06}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectMediaType('vid')}>
                      <Icon
                        name={'videocam'}
                        color={pallette.white}
                        size={w * 0.06}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTypeOfMedia('')}>
                      <Icon
                        name="close"
                        color={pallette.white}
                        size={w * 0.06}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  jitsiWrapper: {
    position: 'absolute',
    zIndex: 999,
    elevation: 999,
    backgroundColor: 'black',
    overflow: 'hidden',
    width: '100%',
  },
  jitsiFull: {
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: 0,
  },
  jitsiMinimized: {
    position: 'absolute',
    // top: StatusBar.currentHeight,
    left: 0,
    width: '100%',
    height: initialScreen.height / 3, // 1/3 of screen height
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  minimizeButton: {
    position: 'absolute',
    right: Math.round(initialScreen.width * 0.015),
    zIndex: 1001,
    backgroundColor: pallette.black,
    padding: 8,
    borderRadius: 10,
  },
  expandOverlay: {
    position: 'absolute',
    top: h * 0.07,
    right: w * 0.03,
    zIndex: 1001,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  belowView: {
    flex: 3,
    backgroundColor: pallette.dark_grey,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 10,
  },

  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: pallette.dark_purple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mainContainer: {
    backgroundColor: pallette.white,
    width: '100%',
    height: h * 0.5,
  },
  textArea: {
    padding: 5,
    marginBottom: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: adjust(14),
    lineHeight: 19,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: pallette.black,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    marginTop: 5,
    fontSize: adjust(17),
    fontFamily: 'Poppins-Bold',
    color: '#472D7A',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  uploadBtn: {
    paddingVertical: h * 0.02,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.7,
    borderColor: pallette.black,
    borderRadius: w * 0.2,
    marginVertical: h * 0.02,
    flexDirection: 'row',
    gap: w * 0.02,
  },
  uploadBtnTxt: {
    fontSize: adjust(13),
    color: pallette.black,
    fontFamily: 'Poppins-Regular',
  },
});

export default JitsiModal;

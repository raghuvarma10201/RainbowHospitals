// File: JitsiModal.tsx

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
  PanResponder,
  Dimensions,
  View,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {h, pallette, w} from '../../constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {pick, types} from '@react-native-documents/picker';
import {RecordBackType, PlayBackType} from 'react-native-audio-recorder-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {styles as chatStyles} from './common-styles';
import {adjust, API_IMG_URL, ToastService} from '../../utils';
import {fetchAppointmentChat, sendAppointmentChat} from '../../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JitsiModalProps {
  visible: boolean;
  options?: any;
  onClose: () => void;
}

// === Constants ===
const CORNER_MARGIN = 10;
const initialScreen = Dimensions.get('window');
const audioRecorderPlayer = new AudioRecorderPlayer();

// === Component ===
const JitsiModal: FC<JitsiModalProps> = ({visible, options, onClose}: any) => {
  const jitsiMeeting = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [minimized, setMinimized] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const [conferenceActive, setConferenceActive] = useState(false);
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

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const layoutAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(layoutAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(layoutAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Track screen dimensions
  const [screen, setScreen] = useState(initialScreen);
  const SNAP_WIDTH = screen.width / 2; // Half screen width
  const SNAP_HEIGHT = screen.height / 3; // One-third screen height

  useEffect(() => {
    const listener = ({window}: {window: any}) => setScreen(window);
    const sub = Dimensions.addEventListener('change', listener);
    return () => {
      if (typeof sub?.remove === 'function') sub.remove();
      else Dimensions.removeEventListener?.('change', listener);
    };
  }, []);

  useEffect(() => {
    fetchChat();
    requestMediaPermissions();
    const interval = setInterval(() => {
      fetchChat();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
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
      console.log(chat);

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
    const id = await AsyncStorage.getItem('user_id');
    try {
      setIsSending(true);
      let formdata = new FormData();
      formdata.append('sender', 'Patient');
      formdata.append('receiver', 'Doctor');
      formdata.append('message', inputText);
      formdata.append('bookingUID', options?.bookingId);
      formdata.append('senderId', id);
      formdata.append('receiverId', options?.careprovider);
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

  // Position for minimized draggable view (start bottom-right)
  const position = useRef(
    new Animated.ValueXY({
      x: screen.width - SNAP_WIDTH - CORNER_MARGIN,
      y: screen.height - SNAP_HEIGHT - CORNER_MARGIN,
    }),
  ).current;

  // Keep position within screen bounds on rotate
  useEffect(() => {
    Animated.spring(position, {
      toValue: {
        x: Math.min(
          Math.max(
            (position.x as any).__getValue?.() ?? CORNER_MARGIN,
            CORNER_MARGIN,
          ),
          screen.width - SNAP_WIDTH - CORNER_MARGIN,
        ),
        y: Math.min(
          Math.max(
            (position.y as any).__getValue?.() ?? CORNER_MARGIN,
            CORNER_MARGIN,
          ),
          screen.height - SNAP_HEIGHT - CORNER_MARGIN,
        ),
      },
      useNativeDriver: false,
    }).start();
  }, [screen.width, screen.height]);

  // Reset flags when modal hides
  useEffect(() => {
    if (!visible) {
      setConferenceActive(false);
      setMinimized(false);
      jitsiMeeting.current?.close?.();
    }
  }, [visible]);

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current?.close?.();
    onClose?.();
  }, [onClose]);

  // Jitsi Event Listeners
  const eventListeners = useMemo(
    () => ({
      onReadyToClose,
      onConferenceJoined: () => setConferenceActive(true),
      onConferenceTerminated: () => setConferenceActive(false),
    }),
    [onReadyToClose],
  );

  // Android Back Button → minimize
  useEffect(() => {
    const onBackPress = () => {
      setChatOpened(false);
      if (visible && conferenceActive) {
        if (!minimized) {
          setMinimized(true);
        }
        return true; // prevent bubbling to Jitsi
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => sub.remove();
  }, [visible, conferenceActive, minimized]);

  // Snap minimized view to nearest corner (with bounds)
  const snapToNearestCorner = useCallback(() => {
    const currentX = (position.x as any).__getValue?.() ?? CORNER_MARGIN;
    const currentY =
      (position.y as any).__getValue?.() ??
      screen.height - SNAP_HEIGHT - CORNER_MARGIN;

    const corners = [
      {x: CORNER_MARGIN, y: CORNER_MARGIN},
      {x: screen.width - SNAP_WIDTH - CORNER_MARGIN, y: CORNER_MARGIN},
      {x: CORNER_MARGIN, y: screen.height - SNAP_HEIGHT - CORNER_MARGIN},
      {
        x: screen.width - SNAP_WIDTH - CORNER_MARGIN,
        y: screen.height - SNAP_HEIGHT - CORNER_MARGIN,
      },
    ];

    let closest = corners[0];
    let minDistance = Infinity;

    for (const c of corners) {
      const dx = c.x - currentX;
      const dy = c.y - currentY;
      const dist = Math.hypot(dx, dy);
      if (dist < minDistance) {
        minDistance = dist;
        closest = c;
      }
    }

    Animated.spring(position, {
      toValue: {
        x: Math.min(
          Math.max(closest.x, CORNER_MARGIN),
          screen.width - SNAP_WIDTH - CORNER_MARGIN,
        ),
        y: Math.min(
          Math.max(closest.y, CORNER_MARGIN),
          screen.height - SNAP_HEIGHT - CORNER_MARGIN,
        ),
      },
      useNativeDriver: false,
    }).start();
  }, [position, screen.height, screen.width]);

  // Pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: (position as any).x._value,
          y: (position as any).y._value,
        });
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: position.x, dy: position.y}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: () => {
        position.flattenOffset();

        // Clamp before snapping
        const clampedX = Math.min(
          Math.max((position.x as any).__getValue?.(), CORNER_MARGIN),
          screen.width - SNAP_WIDTH - CORNER_MARGIN,
        );
        const clampedY = Math.min(
          Math.max((position.y as any).__getValue?.(), CORNER_MARGIN),
          screen.height - SNAP_HEIGHT - CORNER_MARGIN,
        );
        position.setValue({x: clampedX, y: clampedY});

        snapToNearestCorner();
      },
    }),
  ).current;

  if (!visible || !options?.roomName) return null;

  const iconSize = Math.max(24, Math.round(screen.width * 0.05));
  const handleMinimize = useCallback(() => {
    setMinimized(true), setChatOpened(false);
  }, []);
  const handleChatOpened = useCallback(() => setChatOpened(true), []);
  const handleExpand = useCallback(() => {
    setMinimized(false), setChatOpened(false);
  }, []);
  const handleChatClosed = useCallback(() => setChatOpened(false), []);

  const videoTranslateY = layoutAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, h * 0.4], // Push video down when keyboard active
  });

  // Chat view moves up/down in opposite direction
  const chatTranslateY = layoutAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -h * 0.4], // Pull chat up when keyboard active
  });

  return (
    <Animated.View
      style={[
        styles.jitsiWrapper,
        minimized
          ? [styles.jitsiMinimized, {width: SNAP_WIDTH, height: SNAP_HEIGHT}]
          : chatOpened
          ? styles.jitsiChatMode
          : styles.jitsiFull,
        minimized && {transform: position.getTranslateTransform()},
      ]}
      pointerEvents="box-none">
      {conferenceActive && !minimized ? (
        <TouchableOpacity
          onPress={handleMinimize}
          style={[
            styles.minimizeButton,
            {bottom: chatOpened ? h * 0.625 : h * 0.015},
          ]}>
          <Image
            source={require('../../../assets/images/min.png')}
            style={{
              height: Math.round(screen.width * 0.05),
              width: Math.round(screen.width * 0.05),
              resizeMode: 'cover',
              tintColor: pallette.white,
            }}
          />
        </TouchableOpacity>
      ) : (
        conferenceActive && (
          <TouchableOpacity
            onPress={handleExpand}
            style={styles.maximizeButton}>
            <Image
              source={require('../../../assets/images/max.png')}
              style={{
                height: Math.round(screen.width * 0.045),
                width: Math.round(screen.width * 0.045),
                resizeMode: 'cover',
                tintColor: pallette.white,
              }}
            />
          </TouchableOpacity>
        )
      )}

      {conferenceActive && !minimized && !chatOpened ? (
        <TouchableOpacity
          onPress={handleChatOpened}
          style={[
            styles.chatButton,
            {bottom: chatOpened ? h * 0.625 : h * 0.015},
          ]}>
          <Image
            source={require('../../../assets/images/message.png')}
            style={{
              height: Math.round(screen.width * 0.055),
              width: Math.round(screen.width * 0.055),
              resizeMode: 'cover',
              tintColor: pallette.white,
            }}
          />
        </TouchableOpacity>
      ) : (
        conferenceActive && (
          <TouchableOpacity
            onPress={handleChatClosed}
            style={[styles.chatButton, {top: h * 0.325}]}>
            <Image
              source={require('../../../assets/images/close-chat.png')}
              style={{
                height: iconSize,
                width: iconSize,
                resizeMode: 'cover',
                tintColor: pallette.white,
              }}
            />
          </TouchableOpacity>
        )
      )}

      {minimized && (
        <View style={styles.dragHandle} {...panResponder.panHandlers} />
      )}
      <Animated.View
        style={{flex: 1, transform: [{translateY: videoTranslateY}]}}>
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
              'hangup',
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
            'prejoinpage.enabled': false,
            'android.back-press.handled': false,
          }}
          userInfo={{
            displayName: options.patient?.name || 'Patient',
            email: '',
            avatarURL: '',
          }}
        />
      </Animated.View>

      {chatOpened && (
        <Animated.View
          style={[
            styles.belowView,
            {transform: [{translateY: chatTranslateY}]},
          ]}>
          <KeyboardAvoidingView
            style={[chatStyles.container, {marginBottom: h * 0.04}]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
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
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    marginRight: 10,
                    fontSize: adjust(14),
                    color: pallette.black,
                    width: '65%',
                  }}
                />
                <View style={chatStyles.iconContainer}>
                  <TouchableOpacity onPress={() => setTypeOfMedia('gallery')}>
                    <Icon name="images" color={'#00000080'} size={w * 0.06} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => selectMediaType('file')}>
                    <Icon name="document" color={'#00000080'} size={w * 0.06} />
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
                    <Icon name="close" color={pallette.white} size={w * 0.06} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </Animated.View>
  );
};

// === Styles ===
const styles = StyleSheet.create({
  jitsiWrapper: {
    position: 'absolute',
    zIndex: 999,
    elevation: 999,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  jitsiFull: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  jitsiMinimized: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  jitsiChatMode: {
    position: 'absolute',
    // top: StatusBar.currentHeight,
    left: 0,
    width: '100%',
    height: h, // 1/3 of screen height
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  maximizeButton: {
    position: 'absolute',
    right: 0,
    zIndex: 1001,
    padding: 8,
    borderRadius: 10,
  },
  minimizeButton: {
    position: 'absolute',
    left: Math.round(w * 0.25),
    zIndex: 1001,
    padding: 8,
    borderRadius: 10,
  },
  chatButton: {
    position: 'absolute',
    left: Math.round(w * 0.65),
    zIndex: 1001,
    padding: 8,
    borderRadius: 10,
  },
  dragHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  belowView: {
    flex: 1.5,
    backgroundColor: pallette.dark_grey,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 10,
  },
});

export default JitsiModal;

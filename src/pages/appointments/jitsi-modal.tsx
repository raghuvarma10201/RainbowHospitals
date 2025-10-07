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
} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {adjust} from '../../utils/common-functions';
import {h, pallette, w} from '../../constants/constants';

interface JitsiModalProps {
  visible: boolean;
  options?: any; // adjust type as needed
  onClose: () => void;
}

// === Constants ===
const initialScreen = Dimensions.get('window');
const CORNER_MARGIN = 10;

const JitsiModal: FC<JitsiModalProps> = ({visible, options, onClose}: any) => {
  const jitsiMeeting = useRef<any>(null);
  const [minimized, setMinimized] = useState(false);
  const [conferenceActive, setConferenceActive] = useState(false);
  const [rxValue, setRxValue] = React.useState('');
  const [pipMode, setPipMode] = useState(false);

  const [screen, setScreen] = useState(initialScreen);

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
            {top: (StatusBar.currentHeight || 0) * 3},
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
        <View style={{flex: minimized ? 1 : 1}}>
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
              displayName: options.doctor?.name || 'Doctor',
              email: '',
              avatarURL: '',
            }}
          />
        </View>

        {/* {minimized && (
          <View style={styles.belowView}>
            <View style={styles.mainContainer}>
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
            </View>
          </View>
        )} */}
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
    top: StatusBar.currentHeight,
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
    top: h * 0.1,
    right: w * 0.03,
    zIndex: 1001,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  belowView: {
    flex: 1,
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

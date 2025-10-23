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
  StatusBar,
} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {h, pallette, w} from '../../constants/constants';

interface JitsiModalProps {
  visible: boolean;
  options?: any; // adjust type as needed
  onClose: () => void;
}

// === Constants (kept module-scoped to avoid re-allocations per render) ===
const CORNER_MARGIN = 10;
const SNAP_WIDTH = 160;
const SNAP_HEIGHT = 100;

const initialScreen = Dimensions.get('window');

// Component
const JitsiModal: FC<JitsiModalProps> = ({visible, options, onClose}: any) => {
  const jitsiMeeting = useRef<any>(null);
  const [minimized, setMinimized] = useState(false);
  const [conferenceActive, setConferenceActive] = useState(false);
  // const [pipMode, setPipMode] = useState(false);

  // Track dimensions in case of rotation; updates only when dimension changes
  const [screen, setScreen] = useState(initialScreen);
  useEffect(() => {
    const listener = ({window}: {window: any}) => setScreen(window);
    const sub = Dimensions.addEventListener('change', listener);
    return () => {
      // RN >=0.65 returns subscription with remove, >=0.71 uses remove method on returned object
      // @ts-ignore
      if (typeof sub?.remove === 'function') sub.remove();
      // @ts-ignore (older RN versions)
      else Dimensions.removeEventListener?.('change', listener);
    };
  }, []);

  // Position (for minimized draggable view)
  const position = useRef(
    new Animated.ValueXY({
      x: CORNER_MARGIN,
      y: screen.height - SNAP_HEIGHT - CORNER_MARGIN,
    }),
  ).current;

  // Keep position within screen on rotate
  useEffect(() => {
    Animated.spring(position, {
      toValue: {
        x: Math.min(
          Math.max(
            (position.x as any).__getValue?.() ?? CORNER_MARGIN,
            CORNER_MARGIN,
          ),
          Math.max(screen.width - SNAP_WIDTH - CORNER_MARGIN, CORNER_MARGIN),
        ),
        y: Math.min(
          Math.max(
            (position.y as any).__getValue?.() ?? CORNER_MARGIN,
            CORNER_MARGIN,
          ),
          Math.max(screen.height - SNAP_HEIGHT - CORNER_MARGIN, CORNER_MARGIN),
        ),
      },
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.width, screen.height]);

  // Reset pip/conference flags when modal hides
  useEffect(() => {
    if (!visible) {
      setConferenceActive(false);
      // setPipMode(false);
      setMinimized(false);
      // Ensure we free Jitsi resources
      jitsiMeeting.current?.close?.();
    }
  }, [visible]);

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current?.close?.();
    onClose?.();
  }, [onClose]);

  // Jitsi event listeners (memoized to avoid re-renders)
  const eventListeners = useMemo(
    () => ({
      onReadyToClose,
      onConferenceJoined: () => setConferenceActive(true),
      onConferenceTerminated: () => setConferenceActive(false),
      // onEnterPip: () => setPipMode(true), // fixed: was `nEnterPip`
      // onExitPip: () => setPipMode(false),
    }),
    [onReadyToClose],
  );

  // Back button -> minimize (Android only)
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

  // Snap minimized video to nearest corner
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
      toValue: closest,
      useNativeDriver: false,
    }).start();
  }, [position, screen.height, screen.width]);

  // Pan responder (constructed once)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // setOffset uses current values to avoid jump
        position.setOffset({
          x: (position as any).x._value,
          y: (position as any).y._value,
        });
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: position.x, dy: position.y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        position.flattenOffset();
        snapToNearestCorner();
      },
    }),
  ).current;

  // Avoid rendering when not needed
  if (!visible || !options?.roomName) return null;

  // Derived sizes for icons based on current width
  const iconSize = Math.max(24, Math.round(screen.width * 0.05));
  const miniIconSize = Math.max(16, Math.round(screen.width * 0.05));

  // Stable handlers
  const handleMinimize = useCallback(() => setMinimized(true), []);
  const handleExpand = useCallback(() => setMinimized(false), []);

  return (
    <Animated.View
      style={[
        styles.jitsiWrapper,
        minimized ? styles.jitsiMinimized : styles.jitsiFull,
        minimized && {transform: position.getTranslateTransform()},
        // Platform.OS === 'android' && {paddingTop: StatusBar.currentHeight || 0},
      ]}
      pointerEvents="box-none">
      {conferenceActive && !minimized ? (
        <TouchableOpacity
          onPress={handleMinimize}
          style={[styles.minimizeButton, {bottom: h * 0.015}]}>
          <Image
            source={require('../../../assets/images/min.png')}
            style={{
              height: Math.round(screen.width * 0.045),
              width: Math.round(screen.width * 0.045),
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
      {conferenceActive && !minimized ? (
        <TouchableOpacity
          // onPress={handleMinimize}
          style={[styles.chatButton, {bottom: h * 0.015}]}>
          <Image
            source={require('../../../assets/images/message.png')}
            style={{
              height: Math.round(screen.width * 0.045),
              width: Math.round(screen.width * 0.045),
              resizeMode: 'cover',
              tintColor: pallette.white,
            }}
          />
        </TouchableOpacity>
      ) : (
        conferenceActive && (
          <TouchableOpacity
            onPress={handleExpand}
            style={[styles.chatButton, {top: h * 0.425}]}>
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

      <View style={{flex: 1}}>
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
              // 'overflowmenu',
              'hangup',
              // 'desktop',
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
          }}
          userInfo={{
            displayName: options.patient?.name || 'Patient',
            email: '',
            avatarURL: '',
          }}
        />
      </View>
    </Animated.View>
  );
};

// Styles (static for perf)
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
    width: SNAP_WIDTH,
    height: SNAP_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  maximizeButton: {
    position: 'absolute',
    right: 0,
    zIndex: 1001,
    // backgroundColor: pallette.black,
    padding: 8,
    borderRadius: 10,
  },
  minimizeButton: {
    position: 'absolute',
    left: Math.round(w * 0.25),
    zIndex: 1001,
    // backgroundColor: pallette.black,
    padding: 8,
    borderRadius: 10,
  },
  chatButton: {
    position: 'absolute',
    left: Math.round(w * 0.65),
    zIndex: 1001,
    // backgroundColor: pallette.black,
    padding: 8,
    borderRadius: 10,
  },
  expandOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1001,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
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
});

export default JitsiModal;

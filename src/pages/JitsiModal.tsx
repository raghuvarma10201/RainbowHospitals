import React, {useCallback, useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  BackHandler,
  Platform,
  Image,
} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';

const screen = Dimensions.get('window');

const CORNER_MARGIN = 10;
const SNAP_WIDTH = 160;
const SNAP_HEIGHT = 100;

const JitsiModal = ({visible, options, onClose}: any) => {
  const jitsiMeeting = useRef(null);
  const [minimized, setMinimized] = useState(false);

  const position = useRef(
    new Animated.ValueXY({
      x: CORNER_MARGIN,
      y: screen.height - SNAP_HEIGHT - CORNER_MARGIN,
    }),
  ).current;

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current?.close?.();
    onClose?.();
  }, [onClose]);

  // Auto-minimize on Android back press
  useEffect(() => {
    const onBackPress = () => {
      if (visible && !minimized) {
        setMinimized(true);
        return true; // prevent default back action
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

  useEffect(() => {
    if (!visible) {
      setMinimized(false);
      jitsiMeeting.current?.close?.();
    }
  }, [visible]);

  const snapToNearestCorner = () => {
    const {x, y} = position.__getValue();

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

    corners.forEach(corner => {
      const dist = Math.hypot(corner.x - x, corner.y - y);
      if (dist < minDistance) {
        closest = corner;
        minDistance = dist;
      }
    });

    Animated.spring(position, {
      toValue: closest,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: position.x, dy: position.y}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: () => {
        position.flattenOffset();
        snapToNearestCorner();
      },
    }),
  ).current;

  if (!visible || !options?.roomName) return null;

  return (
    <Animated.View
      style={[
        styles.jitsiWrapper,
        minimized ? styles.jitsiMinimized : styles.jitsiFull,
        minimized && {transform: position.getTranslateTransform()},
      ]}
      pointerEvents="box-none">
      {!minimized && (
        <TouchableOpacity
          onPress={() => setMinimized(true)}
          style={styles.minimizeButton}>
          {/* <Text style={styles.minimizeText}>—</Text> */}
          <Image
            source={require('../../assets/images/compress-icon.png')}
            style={styles.compressIcon}
          />
        </TouchableOpacity>
      )}

      {minimized && (
        <TouchableOpacity
          onPress={() => setMinimized(false)}
          style={styles.expandOverlay}>
          <Image
            source={require('../../assets/images/expand-icon.png')}
            style={styles.expandIcon}
          />
        </TouchableOpacity>
      )}

      {minimized && (
        <View style={styles.dragHandle} {...panResponder.panHandlers} />
      )}

      <TouchableWithoutFeedback>
        <View style={{flex: 1}}>
          <JitsiMeeting
            config={{
              hideConferenceTimer: true,
              toolbarButtons: [
                'microphone',
                'camera',
                'screensharing',
                'overflowmenu',
                'hangup',
                'toggle-camera',
              ],
            }}
            eventListeners={{onReadyToClose}}
            flags={{
              'audioMute.enabled': true,
              'fullscreen.enabled': false,
              'android.screensharing.enabled': true,
              'pip.enabled': true,
              'ios.screensharing.enabled': true,
            }}
            ref={jitsiMeeting}
            token={options.token}
            room={options.roomName}
            serverURL={options.serverURL || 'https://meet.jit.si'}
            style={{flex: 1}}
          />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

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
  minimizeButton: {
    position: 'absolute',
    top: h * 0.06,
    right: w * 0.015,
    zIndex: 1001,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 10,
  },
  compressIcon: {
    height: w * 0.07,
    width: w * 0.07,
    resizeMode: 'cover',
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
  expandIcon: {
    height: w * 0.05,
    width: w * 0.05,
    resizeMode: 'cover',
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

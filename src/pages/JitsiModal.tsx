// JitsiModal.tsx
import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';

const screen = Dimensions.get('window');

const JitsiModal = ({ visible, options, onClose }: any) => {
  const jitsiMeeting = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 10, y: screen.height - 160 })).current;

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current?.close?.();
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!visible) {
      setMinimized(false);
      jitsiMeeting.current?.close?.();
    }
  }, [visible]);

  // FIXED PanResponder with proper drag handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        position.flattenOffset();
        // Clamp to screen bounds
        const x = Math.min(Math.max(position.x._value, 0), screen.width - 160);
        const y = Math.min(Math.max(position.y._value, 0), screen.height - 120);
        Animated.spring(position, {
          toValue: { x, y },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  if (!visible || !options?.roomName) return null;

  return (
    <Animated.View
      style={[
        styles.jitsiWrapper,
        minimized ? styles.jitsiMinimized : styles.jitsiFull,
        minimized && {
          transform: position.getTranslateTransform(),
        },
      ]}
      {...(minimized ? panResponder.panHandlers : {})}
    >
      {/* Minimize Button (visible in full screen) */}
      {!minimized && (
        <TouchableOpacity
          onPress={() => setMinimized(true)}
          style={styles.minimizeButton}
        >
          <Text style={styles.minimizeText}>—</Text>
        </TouchableOpacity>
      )}

      {/* Restore Button (visible when minimized) */}
      {minimized && (
        <TouchableOpacity
          onPress={() => setMinimized(false)}
          style={styles.expandOverlay}
        >
          <Text style={styles.expandText}>⤢</Text>
        </TouchableOpacity>
      )}

      {/* Jitsi Meeting */}
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
        eventListeners={{ onReadyToClose }}
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
        style={{ flex: 1 }}
      />
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
  },
  jitsiFull: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  jitsiMinimized: {
    width: 160,
    height: 100,
    borderRadius: 12,
  },
  minimizeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 20,
  },
  minimizeText: {
    color: 'white',
    fontSize: 16,
  },
  expandOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1001,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  expandText: {
    color: 'white',
    fontSize: 12,
  },
});

export default JitsiModal;

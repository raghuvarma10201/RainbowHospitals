import React, {useCallback, useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
// import {useMeetingStore} from '../Context/meetingStore';

const JitsiCall = ({route, navigation}: any) => {
  const jitsiMeeting = useRef(null);
  const {roomName} = route.params;
//   const setMinimized = useMeetingStore(s => s.setMinimized);

  const onReadyToClose = useCallback(() => {
    navigation.goBack();
    jitsiMeeting.current?.close?.();
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived: () => {
      console.log('You got a message!');
    },
  };

  return (
    <View style={{flex: 1}}>
      {/* Jitsi meeting view */}
      <JitsiMeeting
        config={{
          hideConferenceTimer: true,
          toolbarButtons: [
            'microphone',
            'camera',
            'screensharing',
            'overflowmenu',
            'hangup',
          ],
          whiteboard: {
            enabled: true,
            collabServerBaseUrl: 'https://dev.rb.vc.demos.im/',
          },
        }}
        eventListeners={eventListeners as any}
        flags={{
          'audioMute.enabled': true,
          'fullscreen.enabled': false,
          'android.screensharing.enabled': true,
          'pip.enabled': true,
          'ios.screensharing.enabled': true
        }}
        token="..."
        ref={jitsiMeeting}
        room={roomName}
        serverURL="https://dev.rb.vc.demos.im/"
        style={{flex: 1}}
      />

      {/* Minimize button overlay */}
      {/* <TouchableOpacity
        style={styles.minimizeButton}
        onPress={() => {
          setMinimized(true);
          // navigation.goBack();
        }}>
        <Text style={styles.minimizeText}>⤢</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  minimizeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  minimizeText: {
    color: 'white',
    fontSize: 18,
  },
});

export default JitsiCall;

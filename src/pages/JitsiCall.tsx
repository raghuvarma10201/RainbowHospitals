import React, {useCallback, useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {NativeModules} from 'react-native';

const {ScreenRecorder} = NativeModules;

const JitsiCall = ({route, navigation}: any) => {
  const jitsiMeeting = useRef(null);
  const {roomName} = route.params;

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
          'ios.screensharing.enabled': true,
        }}
        token="..."
        ref={jitsiMeeting}
        room={roomName}
        serverURL="https://dev.rb.vc.demos.im/"
        style={{flex: 1}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recordButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    zIndex: 100,
    elevation: 5,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default JitsiCall;

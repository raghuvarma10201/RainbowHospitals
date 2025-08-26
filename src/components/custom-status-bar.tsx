// ---------- MODULE IMPORTS ----------
import React, {FC} from 'react';
import {
  StatusBar,
  Platform,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// ---------- TYPE IMPORTS ----------
import {CustomStatusBarProps} from '../types/components';

// ---------- COMPONENT ----------
const CustomStatusBar: FC<CustomStatusBarProps> = ({
  backgroundColor,
  barStyle = 'light-content',
}) => {
  // ---------- RENDER ----------
  return Platform.OS === 'ios' ? (
    <SafeAreaView style={[styles.iosStatusBar, {backgroundColor}]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </SafeAreaView>
  ) : (
    <View style={[styles.androidStatusBar, {backgroundColor}]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

export default CustomStatusBar;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  iosStatusBar: {
    zIndex: 10,
  },
  androidStatusBar: {
    height: StatusBar.currentHeight,
    zIndex: 10,
  },
});

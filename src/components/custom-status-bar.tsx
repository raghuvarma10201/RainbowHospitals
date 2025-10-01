// ---------- MODULE IMPORTS ----------
import React, {FC} from 'react';
import {StatusBar, Platform, View, StyleSheet} from 'react-native';

// ---------- TYPE IMPORTS ----------
import {CustomStatusBarProps} from '../types/components';

// ---------- COMPONENT ----------
const CustomStatusBar: FC<CustomStatusBarProps> = ({
  backgroundColor,
  barStyle = 'light-content',
}) => {
  return (
    <View style={[styles.statusBar, {backgroundColor}]}>
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
  statusBar: {
    height: Platform.OS === 'ios' ? 0 : 0, // no extra height
    zIndex: 10,
  },
});

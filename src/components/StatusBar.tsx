// src/components/StatusBar.tsx
import React from 'react';
import {
  StatusBar,
  Platform,
  View,
  StyleSheet,
  StatusBarStyle,
} from 'react-native';

interface MyStatusBarProps {
  backgroundColor: string;
  barStyle?: StatusBarStyle;
}

const MyStatusBar: React.FC<MyStatusBarProps> = ({
  backgroundColor,
  barStyle = 'light-content',
}) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default MyStatusBar;

import React from 'react';
import {
  StatusBar,
  Platform,
  View,
  StyleSheet,
  StatusBarStyle,
  SafeAreaView,
} from 'react-native';

interface MyStatusBarProps {
  backgroundColor: string;
  barStyle?: StatusBarStyle;
}

const CustomStatusBar: React.FC<MyStatusBarProps> = ({
  backgroundColor,
  barStyle = 'light-content',
}) => {
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

const styles = StyleSheet.create({
  iosStatusBar: {
    zIndex: 10,
  },
  androidStatusBar: {
    height: StatusBar.currentHeight,
    zIndex: 10,
  },
});

export default CustomStatusBar;

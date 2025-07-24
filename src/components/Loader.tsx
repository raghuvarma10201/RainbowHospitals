import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';

const theme = {
  colors: {
    primary: '#3C2871',
    background: '#f6f6f6',
  },
} as const;

const Loader: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = true }) => {

  useEffect(() => {

  }, []);

  return (
    <View style={styles.splashSt}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  splashSt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Loader;

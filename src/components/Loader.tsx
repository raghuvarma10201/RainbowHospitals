import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const theme = {
  colors: {
    primary: '#3C2871',
    background: '#f6f6f6',
  },
} as const;

const Loader: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = true }) => {

  useEffect(() => {
    // Any side effects if needed
  }, []);

  return (
    <View style={[styles.splashSt, !fullScreen && styles.inline]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  splashSt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'transparent', // Transparent background
  },
  inline: {
    flex: 0, // For non-fullscreen mode
    backgroundColor: 'transparent',
  },
});

export default Loader;

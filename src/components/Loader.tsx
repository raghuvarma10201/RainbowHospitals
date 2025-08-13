import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {pallette} from '../Constants/Constant';

const theme = {
  colors: {
    primary: pallette.app_purple,
    background: '#f6f6f6',
  },
} as const;

const Loader: React.FC<{fullScreen?: boolean}> = ({fullScreen = true}) => {
  useEffect(() => {
    // Side effects if needed
  }, []);

  return (
    <View style={[styles.overlay, !fullScreen && styles.inline]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  inline: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
    height: '100%',
  },
});

export default Loader;

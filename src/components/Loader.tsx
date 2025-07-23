import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

const Loader: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = true }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 5,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 2],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={fullScreen ? styles.fullScreen : styles.inline}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inline: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderStyle: 'dotted',
    borderColor: '#FF5400',
  },
  image: {
    width: 40,
    height: 40,
  },
});

export default Loader;

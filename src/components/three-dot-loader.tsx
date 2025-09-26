// ThreeDotLoader.js
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default function ThreeDotLoader({
  dotSize = 8,
  dotColor = '#333',
  dotSpacing = 8,
  animationDuration = 600, // ms for one dot "pulse"
  style,
  accessibilityLabel = 'Loading',
}) {
  // three animated values (0..1)
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // for each dot create a repeating animation that pulses (0 -> 1 -> 0)
    const animations = anims.map((av, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * (animationDuration / 3)), // stagger start
          Animated.timing(av, {
            toValue: 1,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(av, {
            toValue: 0,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    // start all
    animations.forEach(a => a.start());

    // cleanup
    return () => {
      animations.forEach(a => a.stop());
      anims.forEach(av => av.stopAnimation());
    };
  }, [anims, animationDuration]);

  // map animated values to style: scale + opacity for nicer effect
  const dots = anims.map((av, i) => {
    const scale = av.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1.25],
    });
    const opacity = av.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <Animated.View
        key={i}
        accessible={false}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            marginHorizontal: dotSpacing / 2,
            backgroundColor: dotColor,
            transform: [{scale}],
            opacity,
          },
        ]}
      />
    );
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, style]}>
      {dots}
    </View>
  );
}

ThreeDotLoader.propTypes = {
  dotSize: PropTypes.number,
  dotColor: PropTypes.string,
  dotSpacing: PropTypes.number,
  animationDuration: PropTypes.number,
  style: PropTypes.object,
  accessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    // width/height set dynamically
  },
});

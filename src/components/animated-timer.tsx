import React, {useEffect, useRef} from 'react';
import {Animated, View, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {adjust} from '../utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CountdownCircle = ({
  secondsLeft,
  totalSeconds,
  size = 100,
  strokeWidth = 10,
  color = 'purple',
}: {
  secondsLeft: number;
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fraction = secondsLeft / totalSeconds;
    Animated.timing(progress, {
      toValue: fraction,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [secondsLeft, totalSeconds, progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#eee"
          fill="white"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Animated Foreground Circle */}
        <AnimatedCircle
          stroke={color}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Timer Text */}
      <Text
        style={{
          position: 'absolute',
          fontSize: adjust(12),
          fontWeight: 'bold',
          color: 'black',
        }}>
        {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
        {String(secondsLeft % 60).padStart(2, '0')}
      </Text>
    </View>
  );
};

export default CountdownCircle;

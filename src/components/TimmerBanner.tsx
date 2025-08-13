import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTimer} from '../context/TimeContext';
import {pallette} from '../Constants/Constant';

const TimerBanner = () => {
  const {secondsLeft} = useTimer();

  if (secondsLeft <= 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.heading}>⏳ Time Remaining</Text>
      <Text style={styles.text}>
        Please complete your booking within{' '}
        <Text style={styles.timer}>{secondsLeft}s</Text>, or you’ll be
        redirected.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff8e1',
    borderTopWidth: 1,
    borderColor: '#ffe082',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: pallette.black,
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: -1},
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#6d4c41',
    textAlign: 'center',
  },
  timer: {
    fontWeight: 'bold',
    color: '#d84315',
  },
});

export default TimerBanner;

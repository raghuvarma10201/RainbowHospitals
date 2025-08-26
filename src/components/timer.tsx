import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTimer} from '../context/timer-context';
import {pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';

const Timer: FC = () => {
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
    backgroundColor: pallette.white,
    borderTopWidth: 1,
    borderColor: pallette.pale_turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: pallette.black,
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: -1},
    elevation: 2,
  },
  heading: {
    fontSize: adjust(14),
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 4,
  },
  text: {
    fontSize: adjust(12),
    color: '#6d4c41',
    textAlign: 'center',
  },
  timer: {
    fontWeight: 'bold',
    color: '#d84315',
  },
});

export default Timer;

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {h, pallette, w} from '../Constants/Constant';

interface Props {
  data: any[];
  activeIndex: number;
}

const PaginationDots: React.FC<Props> = ({data, activeIndex}) => {
  return (
    <View style={styles.container}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex && {
              backgroundColor: pallette.app_green,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default React.memo(PaginationDots);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: h * 0.02,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 5,
    backgroundColor: pallette.dark_grey,
    marginHorizontal: w * 0.01,
  },
});

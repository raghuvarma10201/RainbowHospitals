import {Image, StyleProp, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {adjust} from '../utils/common-functions';
import {h, pallette, w} from '../constants/constants';

interface NotFoundType {
  text: string;
  margin: any;
}

const NotFound: FC<NotFoundType> = ({
  text,
  margin,
}: {
  text: string;
  margin?: any;
}) => {
  return (
    <View style={[styles.container, {marginTop: margin}]}>
      <Image
        source={require('../../assets/images/empty.png')}
        style={styles.icon}
      />
      <Text style={[styles.emptyTxt]}>{text}</Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: h * 0.05,
    width: w * 0.1,
    resizeMode: 'contain',
  },
  emptyTxt: {
    fontSize: adjust(12),
    width: w * 0.4,
    alignSelf: 'center',
    textAlign: 'center',
    color: pallette.black,
  },
});

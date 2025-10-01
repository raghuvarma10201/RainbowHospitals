import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {adjust} from '../utils/common-functions';
import {h, pallette, w} from '../constants/constants';
import {NotFoundProps} from '../types/components';

const NotFound: FC<NotFoundProps> = ({text, margin, change, hideBtn}) => {
  return (
    <View style={[styles.container, {marginTop: margin}]}>
      <Image
        source={require('../../assets/images/empty.png')}
        style={styles.icon}
      />
      <Text style={[styles.emptyTxt]}>{text}</Text>
      {!hideBtn && (
        <TouchableOpacity
          onPress={change}
          style={[styles.formButton, {backgroundColor: pallette.dark_purple}]}>
          <Text style={styles.formButtonText}>Change Location</Text>
        </TouchableOpacity>
      )}
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
  formButton: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    // width: '80%',
    alignSelf: 'center',
  },
  formButtonText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },
});

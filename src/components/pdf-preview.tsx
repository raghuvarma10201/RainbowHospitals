import React from 'react';
import {View, Dimensions} from 'react-native';
import {Appbar} from 'react-native-paper';
import Pdf from 'react-native-pdf';
import {pallette} from '../constants/constants';

export const PdfPreview = ({source, back}: any) => {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        height: Dimensions.get('window').height * 0.8,
      }}>
      <Pdf
        source={source}
        onError={error => console.log('PDF error:', error)}
        style={{flex: 1, width: Dimensions.get('window').width}}
      />
      <Appbar.BackAction
        onPress={() => back()}
        color={pallette.black}
        style={{position: 'absolute'}}
      />
    </View>
  );
};

import React from 'react';
import {View, Dimensions, Platform} from 'react-native';
import {Appbar} from 'react-native-paper';
import Pdf from 'react-native-pdf';
import {pallette} from '../constants/constants';

interface PdfPreviewProps {
  source: string | {uri?: string; base64?: string};
  back: () => void;
}

export const PdfPreview = ({source, back}: PdfPreviewProps) => {
  const window = Dimensions.get('window');

  let pdfSource: any;

  // Handle different source types safely
  if (typeof source === 'string') {
    if (source.startsWith('data:application/pdf;base64,')) {
      pdfSource = {uri: source};
    } else if (source.startsWith('file://')) {
      pdfSource = {uri: source};
    } else if (source.startsWith('http://') || source.startsWith('https://')) {
      pdfSource = {uri: source, cache: true};
    } else if (Platform.OS === 'android') {
      pdfSource = {uri: `bundle-assets://${source}`};
    } else {
      // iOS fallback for assets
      pdfSource = require('../../android/app/src/main/assets/docs/DischargeSummary.pdf');
    }
  } else if (typeof source === 'object' && source !== null) {
    // Directly passed object (like {uri: 'file://...'})
    pdfSource = source;
  } else {
    console.warn('Invalid PDF source:', source);
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        height: window.height * 0.8,
        width: window.width,
        backgroundColor: 'white',
      }}>
      <Pdf
        source={pdfSource}
        onError={error => console.log('PDF error:', error)}
        style={{flex: 1, width: '100%'}}
      />
      <Appbar.BackAction
        onPress={back}
        color={pallette.black}
        style={{position: 'absolute', top: 10, left: 10, zIndex: 1}}
      />
    </View>
  );
};

import React from 'react';
import {View, Dimensions, Platform} from 'react-native';
import {Appbar} from 'react-native-paper';
import Pdf from 'react-native-pdf';
import {h, pallette, w} from '../constants/constants';

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
        height: window.height * 0.15,
        width: window.width * 0.8,
        alignSelf: 'center',
        marginVertical: h * 0.01,
        borderRadius: w * 0.02,
        // padding: 5,
        backgroundColor: '#e5e5e5',
        borderWidth: 0.5,
        borderColor: pallette.light_grey,
      }}>
      <Pdf
        source={pdfSource}
        onError={error => console.log('PDF error:', error)}
        style={{flex: 1, width: '100%', borderRadius: w * 0.02}}
        fitPolicy={0}
      />
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: pallette.black,
          opacity: 0.2,
          borderRadius: w * 0.02,
        }}
      />
    </View>
  );
};

import React, {FC, useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';

const PdfViewer: FC = ({route}: any) => {
  const {source} = route?.params;
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const res = await RNFetchBlob.config({
          fileCache: true,
        }).fetch('GET', source.uri);
        setFilePath(res.path());
      } catch (error) {
        console.error('Download error:', error);
      }
    };
    loadPdf();
  }, []);

  if (!filePath) return <ActivityIndicator style={{flex: 1}} />;

  return <Pdf source={{uri: `file://${filePath}`}} style={{flex: 1}} />;
};

export default PdfViewer;

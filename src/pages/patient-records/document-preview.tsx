import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import Pdf from 'react-native-pdf';
import {h, pallette, w} from '../../constants/constants';
import {Header} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNBlobUtil from 'react-native-blob-util';

export const DocumentPreview = ({route}: any) => {
  const {source, doc} = route?.params;
  console.log(source);

  const downloadPDF = async () => {
    try {
      const assetPath = `bundle-assets://docs/${doc}`;
      const dirs = RNBlobUtil.fs.dirs;
      const destPath = `${dirs.DownloadDir}/${doc}`;

      const data = await RNBlobUtil.fs.readFile(assetPath, 'base64');
      await RNBlobUtil.fs.writeFile(destPath, data, 'base64');

      await RNBlobUtil.android.addCompleteDownload({
        title: doc,
        description: 'PDF saved from app assets',
        mime: 'application/pdf',
        path: destPath,
        showNotification: true,
      });

      console.log('✅ PDF saved to:', destPath);
    } catch (error) {
      console.error('❌ Error copying asset PDF:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: h * 0.03,
        backgroundColor: pallette.white,
      }}>
      <Header showLocation />
      <View
        style={{
          padding: w * 0.04,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: pallette.black,
            textTransform: 'capitalize',
          }}>
          Preview
        </Text>

        <MaterialCommunityIcons
          name="download"
          color={pallette.black}
          size={w * 0.05}
          onPress={() => downloadPDF()}
        />
      </View>
      <Pdf
        source={source}
        onError={error => console.log('PDF error:', error)}
        style={{height: h * 0.63, width: '100%', borderRadius: w * 0.02}}
        fitPolicy={0}
      />
    </ScrollView>
  );
};

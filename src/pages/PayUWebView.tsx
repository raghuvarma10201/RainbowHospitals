import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  NativeEventEmitter,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { sha512 } from 'js-sha512';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../utils/types';
import { API_BASE_URL, PAYU_MERCHENT_KEY, PAYU_MERCHENT_SALT } from '../utils/environment';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { ToastService } from '../utils/ToastService';
import { bookAppointment } from '../services/common';

const PayUWebView: React.FC = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { finalPayload, txnId, amount, payuUrl } = route.params;
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const { profile } = useApp();

  const key = PAYU_MERCHENT_KEY;
  const txnid = txnId;
  const productinfo = 'Video Consultation';
  const firstname = profile?.PatientName || '';
  const email = profile?.EmailAddress || '';
  const salt = PAYU_MERCHENT_SALT;
  const phone = profile?.MobileNumber || '';
  const surl = API_BASE_URL + '/payment/success';
  const furl = API_BASE_URL + '/payment/failure';

  const fetchHash = useCallback(async () => {
    // ✅ Correct number of pipes (16 total)
    const hashString = `${key}|${txnid}|${finalPayload.price}|${productinfo}|${firstname}|${email}` + `|||||||||||${salt}`;
    const pipeCount = (hashString.match(/\|/g) || []).length;
    const hash = sha512(hashString);
    setHash(hash);
    console.log('Hash String:', `[${hashString}]`);
    console.log('Pipe Count:', pipeCount);
    console.log('Generated Hash:', `[${hash}]`);
  }, []);

  const postData = `key=${key}&txnid=${txnid}&amount=${finalPayload.price}&productinfo=${productinfo}&firstname=${firstname}&email=${email}&phone=${phone}&surl=${surl}&furl=${furl}&hash=${hash}`;

  console.log('Final postData:\n', postData);

  useEffect(() => {
    fetchHash();
  }, []);

  const handleNavigationChange = (navState: { url: string }) => {
    const url = navState.url;
    console.log('🔗 Navigation URL:', url);

    // ✅ Exact success URL
    if (url === API_BASE_URL + '/payment/success') {
      console.log('✅ Payment Success URL detected');
      setLoading(true);
      updatePayment(''); // Call your API
      // navigation.replace('SuccessScreen');
    }

    // Or detect if URL starts with it (in case there are query params)
    else if (url.startsWith(API_BASE_URL + '/payment/success')) {
      const urlObj = new URL(url);
      const mihpayid = urlObj.searchParams.get('mihpayid');
      console.log('✅ mihpayid:', mihpayid);
      setLoading(true);
      updatePayment(mihpayid);

    } else if (url.includes('failure')) {
      console.log('❌ Payment Failed');
      ToastService.error('Transaction failed. Please try again.');
      navigation.navigate('Home');
      // navigation.replace('FailureScreen');
    }
  };

  const updatePayment = useCallback(async (mihpayid: any) => {
    try {
      setLoading(true);
      finalPayload.mihpayid = mihpayid;
      finalPayload.transaction_id = txnId;
      console.log(finalPayload);
      const response = await bookAppointment(finalPayload);
      if (response && response.status == 200 && response.success == true) {
        navigation.navigate('AppointmentConfirmed');
        console.log('Booking successful:', response.data);
      }else{
        navigation.navigate('Dashboard');
        ToastService.error(response.message);
      }
    } catch (error : any) {
      console.log(error);
      //console.error('Failed to load specialities:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {hash && !loading ? (
        <WebView
          ref={webViewRef}
          source={{ uri: payuUrl, method: 'POST', body: postData }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" />}
        />
      ) : (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      )}
    </View>
  );
};

export default PayUWebView;

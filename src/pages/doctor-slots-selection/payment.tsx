import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {sha512} from 'js-sha512';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {
  API_BASE_URL,
  PAYU_MERCHENT_KEY,
  PAYU_MERCHENT_SALT,
  routes,
} from '../../utils/enums';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types/navigation';
import {useApp} from '../../context/app-context';
import {ToastService} from '../../utils/service-handlers';
import {advancePay, bookAppointment} from '../../services/common';
import {useTimer} from '../../context/timer-context';

const PayUWebView: React.FC = ({route}: any) => {
  const {secondsLeft} = useTimer();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {finalPayload, bookingId, payuUrl} = route.params;
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const {profile} = useApp();

  const key = PAYU_MERCHENT_KEY;
  const txnid = finalPayload?.transaction_id;
  const productinfo = 'Video Consultation';
  const firstname = profile?.PatientName || '';
  const email = profile?.EmailAddress || '';
  const salt = PAYU_MERCHENT_SALT;
  const phone = profile?.MobileNumber || '';
  const surl = API_BASE_URL + '/payment/success';
  const furl = API_BASE_URL + '/payment/failure';

  const fetchHash = useCallback(async () => {
    // ✅ Correct number of pipes (16 total)
    const hashString =
      `${key}|${txnid}|${finalPayload.price.toFixed(
        2,
      )}|${productinfo}|${firstname}|${email}` + `|||||||||||${salt}`;
    const pipeCount = (hashString.match(/\|/g) || []).length;
    const hash = sha512(hashString);
    setHash(hash);
  }, []);

  const postData = `key=${key}&txnid=${txnid}&amount=${finalPayload.price.toFixed(
    2,
  )}&productinfo=${productinfo}&firstname=${firstname}&email=${email}&phone=${phone}&surl=${surl}&furl=${furl}&hash=${hash}`;

  useEffect(() => {
    fetchHash();
  }, []);

  useEffect(() => {
    if (secondsLeft == 0) {
      console.log('called');

      ToastService.error('Payment Timeout');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: routes.Dashboard}],
        }),
      );
    }
  }, [secondsLeft]);

  const handleNavigationChange = (navState: {url: string}) => {
    try {
      const url = navState.url;
      if (url === API_BASE_URL + '/payment/success') {
        setLoading(true);
        updatePayment();
      } else if (url.startsWith(API_BASE_URL + '/payment/success')) {
        setLoading(true);
        updatePayment();
      } else if (url.includes('failure')) {
        ToastService.error('Transaction failed. Please try again.');
        navigation.navigate('Dashboard');
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    }
  };

  const updatePayment = useCallback(async () => {
    const payload = {
      orgcode: finalPayload?.orgcode ?? '40FD',
      mrn: finalPayload?.mrn ?? 'BAHTMP-761149',
      paidby: finalPayload?.payment_type == 'CASH' ? 'PAYATHOSPOTAL' : 'PayU',
      ConsultationFee: finalPayload?.price.toString() ?? '0',
      RegistrationFee: finalPayload.registrationFee.toString() ?? '0',
      comments: `Transaction ID:${finalPayload?.transaction_id},Booking Number:${bookingId},`,
      AppointmentNumber: bookingId ?? 'BAHOP-2972192',
      transaction_id: finalPayload?.transaction_id,
    };
    console.log(finalPayload);
    try {
      setLoading(true);
      const response = await advancePay(payload);
      if (response && response?.status == 200 && response?.success == true) {
        ToastService.success('Appointment Booked Successfully');
        navigation.navigate('AppointmentConfirmed');
      } else {
        ToastService.error(response.message);
        // navigation.navigate('Dashboard');
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      {hash && !loading ? (
        <WebView
          ref={webViewRef}
          source={{uri: payuUrl, method: 'POST', body: postData}}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" />}
        />
      ) : (
        <ActivityIndicator size="large" style={{flex: 1}} />
      )}
    </View>
  );
};

export default PayUWebView;

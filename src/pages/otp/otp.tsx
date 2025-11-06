import React, {useEffect, useState, useCallback} from 'react';
import {ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import {Loader} from '../../components';
import {login, VerifyOTP, authenticateUser} from '../../services/auth';
import {
  getPatientProfile,
  getRegions,
  getBranches,
} from '../../services/common';
import {
  ToastService,
  getCurrentCoordinates,
  requestUserPermission,
} from '../../utils/service-handlers';
import {
  findNearestBranch,
  findNearestRegion,
} from '../../services/Region/location';
import {useApp} from '../../context/app-context';
import {useAuth} from '../../context/auth-context';
import {CombinedNavigationProp} from '../../types/navigation';
import {h, pallette} from '../../constants/constants';
import {navigateTo} from '../../utils/common-functions';
import {routes} from '../../utils';
import {AuthCommonComponent} from '../../components/auth-common';
import {getMessaging, getToken} from '@react-native-firebase/messaging';
import {jwtDecode, JwtPayload} from 'jwt-decode';

const Otp: React.FC = () => {
  const navigation = useNavigation<CombinedNavigationProp>();
  const {
    updateMrn,
    updateProfile,
    updateBranch,
    updateAllBranch,
    updateRegion,
  } = useApp();
  const {setLoggedIn} = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [fcm, setFcm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('mobileNumber').then(setPhoneNumber);
    AsyncStorage.getItem('FcmTtoken').then(setFcm);
  }, []);

  useEffect(() => {
    if (resendDisabled && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) setResendDisabled(false);
  }, [timer, resendDisabled]);

  useEffect(() => {
    formik.setFieldValue('otp', value);
  }, [value]);

  const handleResend = useCallback(async () => {
    if (!phoneNumber || resendDisabled) return;
    setLoading(true);
    setTimer(30);
    setResendDisabled(true);
    try {
      const response = await login({number: phoneNumber});
      response?.success
        ? ToastService.success('Success', 'OTP sent successfully')
        : ToastService.error(
            'Error',
            response.message || 'Failed to resend OTP',
          );
    } catch (err: any) {
      ToastService.error('Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, resendDisabled]);

  const loadDetails = useCallback(async () => {
    try {
      const [regions, location] = await Promise.all([
        getRegions(),
        getCurrentCoordinates(),
      ]);
      if (!regions?.length || !location) return;

      const nearestRegion = findNearestRegion(
        regions,
        location.latitude,
        location.longitude,
      );
      if (!nearestRegion) return;

      updateRegion(nearestRegion);

      const allBranches = await getBranches(nearestRegion.region_id);
      if (!allBranches?.length) return;

      updateAllBranch(allBranches);

      const nearestBranch = findNearestBranch(
        allBranches,
        location.latitude,
        location.longitude,
      );
      if (nearestBranch) updateBranch(nearestBranch);
    } catch (err: any) {
      ToastService.error('Error', err?.message || 'Something went wrong');
    }
  }, [updateBranch, updateAllBranch, updateRegion]);

  const formik = useFormik({
    initialValues: {otp: ''},
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{6}$/, 'Enter a valid 6-digit OTP')
        .required('OTP is required'),
    }),
    onSubmit: async () => {
      if (!phoneNumber) return;
      setLoading(true);
      try {
        const fcmToken = (await AsyncStorage.getItem('FcmTtoken')) || fcm;
        if (!fcmToken) {
          await requestUserPermission();
          try {
            const messaging = getMessaging();
            const FcmTtoken = await getToken(messaging);
            await AsyncStorage.setItem('FcmTtoken', FcmTtoken);
          } catch (error) {
            ToastService.error('Error', 'Failed to fetch FCM Token!');
          }
          ToastService.error(
            'Error',
            'Failed to fetch FCM Token. Please try again.',
          );
          setLoading(false);
          return;
        } else {
          const verifyRes = await VerifyOTP({
            number: phoneNumber,
            otp: value,
            fcmToken,
          });
          console.log({
            number: phoneNumber,
            otp: value,
            fcmToken,
          });

          if (!verifyRes?.success) {
            ToastService.error(
              'Error',
              verifyRes?.message || 'OTP Verification Failed',
            );
            return;
          }
          ToastService.success('Success', 'OTP Verified Successfully');

          const authRes = await authenticateUser({MobileNo: phoneNumber});
          if (!authRes?.success) {
            navigateTo(navigation, routes.Registration);
            ToastService.error('', authRes?.error || 'User Not Registered');
            return;
          }

          const token = verifyRes.data.token;
          if (!token) ToastService.error('Error', 'Token Missing!');
          const decoded = jwtDecode<JwtPayload>(token);
          await AsyncStorage.multiSet([
            ['accessToken', token],
            ['refreshToken', token],
            ['tokenExpiry', verifyRes.data.expiryTime],
            ['user_id', decoded?.user?.id.toString()],
          ]);

          // const profileData = decoded.user ? decoded.user : null;

          updateMrn(authRes.data.LoginName);
          await AsyncStorage.setItem('mrn', authRes.data.LoginName);

          const profileData = await getPatientProfile({
            mrn: authRes.data.LoginName,
          });
          if (profileData?.success && profileData.data?.[0]) {
            updateProfile(profileData.data[0]);
            setLoggedIn(true);
          }

          await loadDetails();
        }
      } catch (err: any) {
        console.log(err?.message);

        ToastService.error('Error', err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) return <Loader />;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: h * 0.03,
          backgroundColor: pallette.white,
        }}>
        <AuthCommonComponent
          toEnter="OTP"
          subTxt={`Enter OTP sent to +91${phoneNumber}`}
          input="otp"
          btnTxt="Confirm"
          handleNumberChange={setValue}
          handleNumberBlur={handleResend}
          resendDisabled={resendDisabled}
          formik={formik}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Otp;

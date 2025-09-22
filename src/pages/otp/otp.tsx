// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback} from 'react';
import {ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

// ---------- COMPONENT IMPORTS ----------
import {Loader} from '../../components';

// ---------- OTHER IMPORTS ----------
import {login, VerifyOTP, authenticateUser} from '../../services/auth';
import {
  getPatientProfile,
  getRegions,
  getBranches,
} from '../../services/common';
import {ToastService} from '../../utils/service-handlers';
import {getCurrentCoordinates} from '../../utils/service-handlers';
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

// ---------- COMPONENT ----------
const Otp: React.FC = () => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
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
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      setPhoneNumber(storedNumber);
    })();
  }, []);

  useEffect(() => {
    if (resendDisabled && timer > 0) {
      console.log('timer running');
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  useEffect(() => {
    formik.setFieldValue('otp', value);
  }, [value]);

  // ---------- EVENT HANDLERS ----------
  const handleResend = useCallback(async () => {
    if (!phoneNumber || resendDisabled) return;
    try {
      setLoading(true);
      setTimer(30);
      setResendDisabled(true);

      const response = await login({number: phoneNumber});
      if (response.status === 200 && response.success) {
        ToastService.success('Success', 'OTP sent successfully');
      } else {
        ToastService.error('Error', response.message || 'Failed to resend OTP');
      }
    } catch {
      ToastService.error('Error', 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, resendDisabled]);

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
        const fcmToken = (await AsyncStorage.getItem('FcmTtoken')) || '';
        const response = await VerifyOTP({
          number: phoneNumber,
          otp: value,
          fcmToken,
        });
        console.log(response);
        if (response?.success && response?.status === 200) {
          ToastService.success('Success', 'OTP Verified Successfully');
        } else {
          ToastService.error(
            'Error',
            response?.message || 'OTP Verification Failed',
          );
          return;
        }
        const authResponse = await authenticateUser({MobileNo: phoneNumber});
        console.log(authResponse);
        if (authResponse?.success && authResponse?.status == 200) {
          ToastService.success('Success', 'User Authenticated Successfully');
          const token = response.data.token;
          if (!token) ToastService.error('Error', 'Token Missing!');
          await AsyncStorage.multiSet([
            ['accessToken', token],
            ['refreshToken', token],
            ['tokenExpiry', response.data.expiryTime],
          ]);
          updateMrn(authResponse.data.LoginName);
          await AsyncStorage.setItem('mrn', authResponse.data.LoginName);
          const profileData = await getPatientProfile({
            mrn: authResponse.data.LoginName,
          });
          console.log(profileData);
          if (profileData?.status == 200 && profileData?.success) {
            if (profileData.data?.[0]) {
              setLoggedIn(true);
              updateProfile(profileData.data[0]);
              navigation.navigate('Dashboard');
            } else {
              ToastService.error('Failed', 'Failed To Save Profile Details');
            }
          } else {
            ToastService.error('Error', 'Could Not Fetch Profile Details');
          }
          await loadDetails();
        } else {
          navigateTo(navigation, routes.Registration);
          ToastService.error('', authResponse?.error || 'User Not Registered');
        }
      } catch (e) {
        ToastService.error('Error', 'OTP Verification Failed');
      } finally {
        setLoading(false);
      }
    },
  });

  // ---------- CALLBACKS ----------
  const loadDetails = useCallback(async () => {
    try {
      const [regions, location] = await Promise.all([
        getRegions().catch(err => {
          ToastService.error('', `Failed to fetch regions: ${err}`);
          return null;
        }),
        getCurrentCoordinates().catch(err => {
          ToastService.error('', `Failed to get current location: ${err}`);
          return null;
        }),
      ]);
      if (regions?.length === 0) {
        ToastService.error('', `Failed to get regions`);
        return;
      }
      if (!location) {
        ToastService.error('', `Location unavailable`);
        return;
      }
      const nearestRegion = findNearestRegion(
        regions,
        location.latitude,
        location.longitude,
      );
      if (!nearestRegion) {
        ToastService.error('', `No nearest region found`);
        return;
      }
      updateRegion(nearestRegion);
      const allBranches = await getBranches(nearestRegion.region_id).catch(
        err => {
          ToastService.error('', `Failed to fetch branches: ${err}`);
          return null;
        },
      );
      if (!allBranches || allBranches.length === 0) {
        ToastService.error(
          '',
          `No branches found for region: ${nearestRegion.region_id}`,
        );
        return;
      }
      updateAllBranch(allBranches);
      const nearestBranch = findNearestBranch(
        allBranches,
        location.latitude,
        location.longitude,
      );
      if (nearestBranch) {
        updateBranch(nearestBranch);
      } else {
        ToastService.error('', `No nearest branch found`);
      }
    } catch (err) {
      ToastService.error('', `Failed to fetch details: ${err}`);
    }
  }, [updateBranch, updateAllBranch, updateRegion]);

  // ---------- LOADER ----------
  if (loading) return <Loader />;

  // ---------- RENDER ----------
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
          toEnter={'OTP'}
          subTxt={`Enter OTP sent to +91${phoneNumber}`}
          input={'otp'}
          btnTxt={'Confirm'}
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

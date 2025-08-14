import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Text} from 'react-native-paper';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, VerifyOTP, authenticateUser} from '../services/auth';
import {getPatientProfile, getRegions, getBranches} from '../services/common';
import {ToastService} from '../utils/ToastService';
import {getCurrentCoordinates} from '../utils/LocationService';
import {
  findNearestBranch,
  findNearestRegion,
} from '../services/Region/location';
import Loader from '../components/Loader';
import {useApp} from '../context/AppContext';
import {useAuth} from '../context/AuthContext';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';
import {pallette} from '../Constants/Constant';

const {height: h, width: w} = Dimensions.get('window');
const CELL_COUNT = 6;

const Otp: React.FC = () => {
  type CombinedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<MainStackParamList>
  >;
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

  const codeFieldRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Load phone number from storage
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      setPhoneNumber(storedNumber);
    };
    fetchPhoneNumber();
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    if (resendDisabled && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  const handleResend = useCallback(async () => {
    if (!phoneNumber || !resendDisabled) return;
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
    } catch (err) {
      ToastService.error('Error', 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, resendDisabled]);

  const loadDetails = useCallback(
    async (token: string) => {
      try {
        const regions = await getRegions();
        const location = await getCurrentCoordinates();
        if (!location) return;

        const nearestRegion = findNearestRegion(
          regions,
          location.latitude,
          location.longitude,
        );
        if (!nearestRegion) return;
        updateRegion(nearestRegion);

        const allBranches = await getBranches(nearestRegion.region_id);
        updateAllBranch(allBranches);

        const nearestBranch = findNearestBranch(
          allBranches,
          location.latitude,
          location.longitude,
        );
        if (nearestBranch) updateBranch(nearestBranch);
      } catch {}
    },
    [updateBranch, updateAllBranch, updateRegion],
  );

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

        if (response?.status !== 200) {
          ToastService.error(
            'Error',
            response?.data?.message || 'OTP verification failed',
          );
          return;
        }

        ToastService.success(
          'Success',
          response.data.message || 'OTP verified successfully',
        );

        const authResponse = await authenticateUser({MobileNo: phoneNumber});
        if (authResponse.status !== 200) {
          navigation.navigate('Registration');
          ToastService.error(
            'Error',
            authResponse?.error || 'Authentication failed',
          );
          return;
        }

        const token = response.data.token;
        if (!token) throw new Error('Token missing in response');

        await AsyncStorage.multiSet([
          ['accessToken', token],
          ['refreshToken', token],
          ['tokenExpiry', response.data.expiryTime],
        ]);

        await loadDetails(token);

        updateMrn(authResponse.data.LoginName);
        await AsyncStorage.setItem('mrn', authResponse.data.LoginName);

        const profileData = await getPatientProfile({
          mrn: authResponse.data.LoginName,
        });
        if (profileData.data?.[0]) {
          setLoggedIn(true);
          updateProfile(profileData.data[0]);
          navigation.navigate('Dashboard');
        }
      } catch (err) {
        ToastService.error('Error', 'Failed to verify OTP');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('otp', value);
  }, [value]);

  if (loading) return <Loader />;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.taglineWrapper}>
          <View style={styles.taglineBox}>
            <View style={styles.beforeDot} />
            <Text style={styles.taglineText}>
              Comprehensive Care for Women & Child
            </Text>
          </View>
        </View>

        <Image
          source={require('../../assets/images/otp-img.png')}
          style={styles.otpImg}
          resizeMode="cover"
        />

        <View style={styles.otpContainer}>
          <Text style={styles.title}>ENTER OTP</Text>
          <Text style={styles.label}>OTP Code sent on +91 {phoneNumber}</Text>

          <CodeField
            ref={codeFieldRef as React.RefObject<TextInput>}
            {...props}
            value={value}
            onChangeText={text => setValue(text.replace(/[^0-9]/g, ''))}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

          {formik.errors.otp && formik.touched.otp && (
            <Text style={styles.error}>{formik.errors.otp}</Text>
          )}

          <View style={styles.timeContainer}>
            {!resendDisabled && (
              <TouchableOpacity
                disabled={resendDisabled}
                onPress={handleResend}>
                <Text
                  style={[
                    styles.resendText,
                    resendDisabled && {color: pallette.light_grey},
                  ]}>
                  Resend
                </Text>
              </TouchableOpacity>
            )}
            {resendDisabled && (
              <Text style={styles.timer}>
                00:{timer < 10 ? `0${timer}` : timer}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => formik.handleSubmit()}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: h * 0.03,
  },
  logo: {
    width: '100%',
    height: h * 0.1,
    marginTop: '7%',
    marginBottom: '8%',
  },
  taglineWrapper: {
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
  },
  taglineBox: {
    width: '100%',
    padding: 15,
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    marginBottom: 20,
  },
  beforeDot: {
    position: 'absolute',
    bottom: -h * 0.02,
    left: '50%',
    width: 30,
    height: 30,
    backgroundColor: pallette.app_green,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: pallette.white,
  },
  taglineText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: 15,
  },
  otpImg: {
    width: '100%',
    height: h * 0.4,
    marginBottom: 20,
  },
  otpContainer: {
    paddingHorizontal: 20,
  },
  title: {
    color: pallette.app_green,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 13,
    color: pallette.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  codeFieldRoot: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cell: {
    width: '14%',
    height: h * 0.06,
    borderWidth: 1,
    borderColor: '#8a3ab9',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: pallette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: '#6200ee',
  },
  cellText: {
    fontSize: 20,
    textAlign: 'center',
    color: pallette.black,
  },
  error: {
    color: pallette.red,
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  resendText: {
    color: '#8a3ab9',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  timer: {
    textAlign: 'right',
    fontSize: 12,
    color: pallette.black,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#818385',
    padding: 10,
    borderRadius: 40,
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: pallette.white,
    fontSize: 14,
    textAlign: 'center',
  },
});

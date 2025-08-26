// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
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
import {CombinedNavigationProp} from '../../navigation/types';
import {h, pallette} from '../../constants/constants';
import {adjust, navigateTo} from '../../utils/common-functions';
import {routes} from '../../utils';

// ---------- STATIC DATA ----------
const CELL_COUNT = 6;

const images = {
  logo: require('../../../assets/images/logo.png'),
  otp: require('../../../assets/images/otp-img.png'),
};

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
  const codeFieldRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      setPhoneNumber(storedNumber);
    })();
  }, []);

  useEffect(() => {
    if (resendDisabled && timer > 0) {
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
          navigateTo(navigation, routes.Registration);
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

        await loadDetails();
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
      } catch (e) {
        console.log(e);
        ToastService.error('Error', 'Failed to verify OTP');
      } finally {
        setLoading(false);
      }
    },
  });

  // ---------- CALLBACKS ----------
  const loadDetails = useCallback(async () => {
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
  }, [updateBranch, updateAllBranch, updateRegion]);

  // ---------- LOADER ----------
  if (loading) return <Loader />;

  // ---------- RENDER ----------
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <ImageBackground
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Tagline */}
        <View style={styles.taglineWrapper}>
          <View style={styles.taglineBox}>
            <View style={styles.beforeDot} />
            <Text style={styles.taglineText}>
              Comprehensive Care for Women & Child
            </Text>
          </View>
        </View>
        {/* OTP Image */}
        <Image source={images.otp} style={styles.otpImg} resizeMode="cover" />
        {/* OTP Section */}
        <View style={styles.otpContainer}>
          <Text style={styles.title}>ENTER OTP</Text>
          <Text style={styles.label}>OTP Code sent on +91 {phoneNumber}</Text>
          {/* Code Input */}
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
          {/* Timer / Resend */}
          <View style={styles.timeContainer}>
            {!resendDisabled ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timer}>
                00:{timer < 10 ? `0${timer}` : timer}
              </Text>
            )}
          </View>
          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor:
                  formik.values.otp.length < 6
                    ? pallette.dark_grey
                    : pallette.dark_purple,
              },
            ]}
            onPress={() => formik.handleSubmit()}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Otp;

// ---------- STYLES ----------
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
    backgroundColor: pallette.dark_purple,
    borderRadius: 10,
    marginBottom: 20,
  },
  beforeDot: {
    position: 'absolute',
    bottom: -h * 0.02,
    left: '50%',
    width: 30,
    height: 30,
    backgroundColor: pallette.teal,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: pallette.white,
  },
  taglineText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: adjust(14),
  },
  otpImg: {
    width: '100%',
    height: h * 0.38,
    marginBottom: 20,
  },
  otpContainer: {
    paddingHorizontal: 20,
  },
  title: {
    color: pallette.teal,
    fontSize: adjust(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: adjust(14),
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
    borderColor: pallette.amethyst,
    borderRadius: 8,
    backgroundColor: pallette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: pallette.electric_indigo,
  },
  cellText: {
    fontSize: adjust(18),
    textAlign: 'center',
    color: pallette.black,
  },
  error: {
    color: pallette.red,
    fontSize: adjust(12),
    marginTop: 5,
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  resendText: {
    fontSize: adjust(12),
    color: pallette.amethyst,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  timer: {
    textAlign: 'right',
    fontSize: adjust(12),
    color: pallette.black,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: h * 0.015,
    borderRadius: h * 0.05,
    marginTop: h * 0.01,
  },
  primaryButtonText: {
    color: pallette.white,
    fontSize: adjust(14),
    textAlign: 'center',
  },
});

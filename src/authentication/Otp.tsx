import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Button, Text, Checkbox} from 'react-native-paper';
import {ref} from 'yup';
import {useApp} from '../context/AppContext';
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
import {fetchBranchesByRegionId} from '../services/Region/api';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList, MainStackParamList, useAuth} from '../../App';
import Loader from '../components/Loader';

const CELL_COUNT = 6;

const Otp: React.FC = () => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Dashboard'
  >;
  const navigation = useNavigation<AppNavigationProp>();
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const {updateMrn, updateProfile} = useApp();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const {updateBranch, updateAllBranch, updateRegion} = useApp();
  const [value, setValue] = useState('');
  const {setLoggedIn} = useAuth();
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      setPhoneNumber(storedNumber);
    };
    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    if (resendDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  const handleResend = async () => {
    if (resendDisabled) return;
    setLoading(true);
    try {
      setTimer(30);
      setResendDisabled(true);
      const response = await login({ number: phoneNumber });
      if (response.status == 200 && response.success == true) {
        setLoading(false);
        ToastService.success('Success', 'Otp sent successfully');
      }else{
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Resend error:', error);
      ToastService.error('Failed to resend OTP.');
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    formik.setFieldValue('otp', value);
    if (value.length === CELL_COUNT && !formik.isSubmitting) {
      //formik.handleSubmit();
    }
  }, [value]);

  const formik = useFormik({
    initialValues: {otp: ''},
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{6}$/, 'Enter a valid 6-digit OTP')
        .required('OTP is required'),
    }),
    onSubmit: async values => {
      setLoading(true);
      try {
        const payload = {
          number: phoneNumber,
          otp: value,
          fcmToken: (await AsyncStorage.getItem('FcmTtoken')) || 'adsdsad',
        };
        const response = await VerifyOTP(payload);
        console.log('Verify Response', response);
        const token = response?.data?.token;
        await AsyncStorage.setItem('accessToken', token);
        console.log('OTP verify response:', response);
        if (!token) {
          throw new Error('Token not found in response');
        }
        await loadDetails(token);
        if (response && response.status === 200) {
          ToastService.error('Success', response.data.message || 'OTP verified successfully');
          const authResponse = await authenticateUser({ MobileNo: phoneNumber });
          console.log("authResponse", authResponse);
          if (authResponse && authResponse.status == 200) {
            setLoading(false);
            updateMrn(authResponse.data.LoginName);
            await AsyncStorage.setItem('mrn', authResponse.data.LoginName);
            const data = await getPatientProfile({
              mrn: authResponse.data.LoginName,
            });
            console.log(data);
            if (data.data[0] && data.data[0].PatientID) {
              setLoggedIn(true);
              updateProfile(data.data[0]);
              navigation.navigate('Dashboard');
              // const storedMpin = await AsyncStorage.getItem('firstTimeLogin');
              // const { available } =
              // await new ReactNativeBiometrics().isSensorAvailable();
              // if (storedMpin || available) {
              //   navigation.replace('Dashboard');
              //   showSuccessToast(
              //     data.PatientName
              //       ? `Welcome back ${data.PatientName}!`
              //       : `${authResponse.message}`,
              //   );
              //   console.log(data);
              //   setProfile(data.data[0]);
              // } else {
              //   navigation.replace('Biometric');
              // }
            }
          } else if (authResponse.status == 500) {
            setLoading(false);
            ToastService.error('Error', authResponse.message);
          } else {
            setLoading(false);
            // /navigation.navigate('Otp');
            ToastService.error('Error', authResponse?.error);
          }
        } else {
          setLoading(false);
          ToastService.error('Error', response?.data.message || 'Error verifying OTP');
        }
      } catch (error) {
        setLoading(false);
        console.error('Verification failed:', error);
        ToastService.error('Error', 'Failed to verify OTP');
      } finally {
        setLoading(false);
      }
    },
  });

  const loadDetails = async (token: string) => {
    try {
      const regions = await getRegions();
      const location = await getCurrentCoordinates();
      if (!location) throw new Error('Location unavailable');
      const nearestRegion = findNearestRegion(
        regions,
        location.latitude,
        location.longitude,
      );
      if (!nearestRegion) throw new Error('No region found nearby');
      updateRegion(nearestRegion);
      const allBranches = await getBranches(nearestRegion.region_id);
      if (!allBranches.length) throw new Error('No branch data found');
      updateAllBranch(allBranches);
      const nearestBranch = findNearestBranch(
        allBranches,
        location.latitude,
        location.longitude,
      );
      if (!nearestBranch) throw new Error('No nearby branch found');
      updateBranch(nearestBranch);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
 if (loading) {
    return (
      <Loader />
    );
  }
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <View style={styles.imgTextGroup}>
        <View style={styles.imgTextBox}>
          <View style={styles.textbeforeDot}>
            <View style={styles.beforeDot} />
            <Text style={styles.imgTextTitle}>
              {' '}
              Comprehensive Care for Women & Child
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={require('../../assets/images/otp-img.png')}
        style={styles.otpImg}
        resizeMode="cover"
      />
      <View style={styles.otpContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          ENTER OTP
        </Text>
        <Text style={styles.labelText}>
          {' '}
          OTP Code sent on +91 {phoneNumber}
        </Text>
        <CodeField
          ref={ref as React.RefObject<TextInput>}
          InputComponent={TextInput}
          {...props}
          value={value}
          onChangeText={text => {
            const onlyNumbers = text.replace(/[^0-9]/g, '');
            setValue(onlyNumbers);
          }}
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
          <Text style={styles.errorMessage}>{formik.errors.otp}</Text>
        )}
        <View style={styles.timeContainer}>
          <TouchableOpacity disabled={resendDisabled} onPress={handleResend}>
            <Text
              style={[styles.resendText, resendDisabled && {color: '#aaa'}]}>
              Resend
            </Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>
            {resendDisabled ? `  00:${timer < 10 ? `0${timer}` : timer}` : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBt}
          onPress={() => formik.handleSubmit()}>
          <Text style={styles.primaryBtText}> Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 0,
  },
  logoImage: {
    marginHorizontal: 'auto',
    marginTop: '7%',
    marginBottom: '8%',
    width: '100%',
    height: Dimensions.get('window').height * 0.11,
    justifyContent: 'space-between',
  },

  title: {
    color: '#00B3AE',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -12,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 5,
    fontFamily: 'ProximaNovaA-Bold',
  },

  labelText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 10,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FFACAC',
    marginTop: 0,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: 400,
  },
  formViewGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  formInput: {
    height: 40,
    width: 40,
    fontSize: 16,
    paddingHorizontal: '7.6%',
    paddingVertical: 0,
    marginHorizontal: 4,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#A7AAAC',
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  primaryBt: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 40,
    backgroundColor: '#818385',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  primaryBtText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  imgTextGroup: {
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
  },

  imgTextBox: {
    width: '100%',
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 10,
    backgroundColor: '#3C2871',
    borderRadius: 10,
  },
  textbeforeDot: {position: 'relative'},
  imgTextTitle: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#fff',
    textAlign: 'center',
  },

  beforeDot: {
    position: 'absolute',
    bottom: -35,
    left: '42%',
    width: 30,
    height: 30,
    backgroundColor: '#00B3AE',
    borderRadius: 50,
    borderWidth: 7,
    borderColor: '#fff',
  },
  otpImg: {
    height: Dimensions.get('window').height * 0.4,
    width: '100%',
    marginTop: -20,
    marginBottom: 20,
  },

  otpContainer: {
    paddingHorizontal: 20,
  },

  timeContainer: {
    paddingHorizontal: 0,
    marginTop: 3,
    display: 'flex',
  },

  timeText: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
    paddingHorizontal: 0,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: '100%',
    //paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  cell: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#8a3ab9',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cellText: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#6200ee',
  },
  resendText: {
    color: '#8a3ab9',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

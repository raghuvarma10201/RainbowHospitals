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
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- OTHER IMPORTS ----------
import {login} from '../../services/auth';
import {ToastService} from '../../utils/service-handlers';
import {AuthStackParamList} from '../../types/navigation';
import {h, pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import {AuthCommonComponent} from '../../components/auth-common';

// ---------- STATIC DATA ----------
const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

const images = {
  logo: require('../../../assets/images/logo.png'),
  login: require('../../../assets/images/login-img.png'),
};

// ---------- FORMIC SCHEMA ----------
const LoginSchema = Yup.object({
  mobileNumber: Yup.string()
    .required('Please enter valid mobile number')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
});

// ---------- COMPONENT ----------
const Login: React.FC = () => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();
  const [country, setCountry] = useState('1');
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {mobileNumber: ''},
    validationSchema: LoginSchema,
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      setLoading(true);
      try {
        const response = await login({number: values.mobileNumber});
        if (response.status === 200 && response.success) {
          await AsyncStorage.setItem('mobileNumber', values.mobileNumber);
          ToastService.success('Success', 'OTP sent successfully');
          navigation.navigate('Otp');
        }
      } catch (e: any) {
        console.error('Login error:', e);
        ToastService.error('Invalid credentials', 'Please try again');
        setErrors({mobileNumber: 'Invalid credentials'});
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  // ---------- EVENT HANDLERS ----------
  const handleCountryChange = useCallback((e: any) => {
    setCountry(e.value);
  }, []);

  const handleNumberChange = useCallback(
    (text: string) => formik.handleChange('mobileNumber')(text),
    [formik],
  );

  const handleNumberBlur = useCallback(
    () => formik.handleBlur('mobileNumber'),
    [formik],
  );

  const handleSubmit = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    if (formik.values.mobileNumber.length === 10) {
      Keyboard.dismiss();
    }
  }, [formik.values.mobileNumber]);

  // ---------- RENDER ----------
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: h * 0.05,
          backgroundColor: pallette.white,
        }}
        keyboardShouldPersistTaps="handled">
        <AuthCommonComponent
          toEnter={'Your Mobile No'}
          subTxt={
            'Log in or sign up to book appointments,\nview records and more.'
          }
          input={'mobile'}
          btnTxt={'Request OTP'}
          handleNumberChange={handleNumberChange}
          handleNumberBlur={handleNumberBlur}
          value={formik.values.mobileNumber}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  taglineWrapper: {
    paddingLeft: w * 0.05,
  },
  taglineBox: {
    width: w * 0.45,
    padding: h * 0.012,
    backgroundColor: pallette.dark_purple,
    borderRadius: w * 0.025,
    marginBottom: h * 0.02,
  },
  beforeDot: {
    position: 'absolute',
    top: '40%',
    right: '-10%',
    width: w * 0.08,
    height: w * 0.08,
    backgroundColor: pallette.teal,
    borderRadius: w * 0.1,
    borderWidth: w * 0.02,
    borderColor: pallette.white,
  },
  tagline: {
    fontSize: adjust(18),
    color: pallette.white,
    paddingBottom: h * 0.025,
  },
  loginImg: {
    height: h * 0.43,
    width: '100%',
    marginTop: -h * 0.15,
    alignSelf: 'flex-end',
    right: '-15%',
  },
  formContainer: {
    paddingHorizontal: w * 0.05,
  },
  title: {
    color: pallette.teal,
    fontSize: adjust(18),
    textAlign: 'center',
    marginBottom: h * 0.01,
    fontFamily: 'ProximaNovaA-Bold',
  },
  label: {
    fontSize: adjust(16),
    color: pallette.black,
    marginBottom: h * 0.012,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h * 0.007,
    paddingHorizontal: w * 0.025,
    backgroundColor: pallette.light_grey,
    borderRadius: w * 0.02,
  },
  input: {
    flex: 1,
    fontSize: adjust(14),
    paddingHorizontal: w * 0.025,
  },
  dropdown: {
    height: h * 0.04,
    borderRightWidth: 2,
    borderRightColor: pallette.dark_grey,
    width: w * 0.2,
    marginRight: w * 0.02,
    paddingHorizontal: w * 0.025,
  },
  dropdownText: {
    fontSize: adjust(14),
    color: pallette.black,
  },
  error: {
    color: pallette.red,
    marginBottom: h * 0.007,
    fontSize: adjust(12),
  },
  button: {
    borderRadius: h * 0.05,
    paddingVertical: h * 0.015,
    width: w * 0.5,
    alignSelf: 'center',
    marginTop: h * 0.015,
  },
  buttonText: {
    color: pallette.white,
    fontSize: adjust(14),
    textAlign: 'center',
  },
});

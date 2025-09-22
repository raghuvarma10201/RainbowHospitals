// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
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
import {AuthCommonComponent} from '../../components/auth-common';
import {Loader} from '../../components';

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
        } else {
          ToastService.error('Failure', 'Failed To Send OTP.');
        }
      } catch (error: any) {
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
        setErrors({mobileNumber: 'Invalid credentials'});
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  // ---------- EVENT HANDLERS ----------
  const handleNumberChange = useCallback(
    (text: string) => formik.handleChange('mobileNumber')(text),
    [formik],
  );

  const handleNumberBlur = useCallback(
    () => formik.handleBlur('mobileNumber'),
    [formik],
  );

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    if (formik.values.mobileNumber.length === 10) {
      Keyboard.dismiss();
    }
  }, [formik.values.mobileNumber]);

  if (loading) {
    return <Loader />;
  }

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
          formik={formik}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

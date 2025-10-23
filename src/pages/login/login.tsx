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

import {login} from '../../services/auth';
import {ToastService} from '../../utils/service-handlers';
import {AuthStackParamList} from '../../types/navigation';
import {h, pallette} from '../../constants/constants';
import {Loader} from '../../components';
import {AuthCommonComponent} from '../../components/auth-common';

// ---------- VALIDATION SCHEMA ----------
const LoginSchema = Yup.object({
  mobileNumber: Yup.string()
    .required('Please enter valid mobile number')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
});

// ---------- COMPONENT ----------
const Login: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {mobileNumber: ''},
    validationSchema: LoginSchema,
    onSubmit: async ({mobileNumber}, {setSubmitting, setErrors}) => {
      setLoading(true);
      try {
        const fcmToken = await AsyncStorage.getItem('FcmTtoken');
        console.log(fcmToken);

        const response = await login({number: mobileNumber});
        if (response?.success && response?.status === 200) {
          await AsyncStorage.setItem('mobileNumber', mobileNumber);
          ToastService.success('Success', 'OTP sent successfully');
          navigation.navigate('Otp');
        } else {
          ToastService.error('Failure', 'Failed To Send OTP.');
        }
      } catch (err: any) {
        ToastService.error('Error', err?.message || 'Something went wrong');
        setErrors({mobileNumber: 'Invalid credentials'});
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const handleNumberChange = useCallback(
    (text: string) => formik.setFieldValue('mobileNumber', text),
    [formik],
  );

  useEffect(() => {
    if (formik.values.mobileNumber.length === 10) Keyboard.dismiss();
  }, [formik.values.mobileNumber]);

  if (loading) return <Loader />;

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
          toEnter="Your Mobile No"
          subTxt="Log in or sign up to book appointments, view records and more."
          input="mobile"
          btnTxt="Request OTP"
          handleNumberChange={handleNumberChange}
          handleNumberBlur={formik.handleBlur('mobileNumber')}
          formik={formik}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

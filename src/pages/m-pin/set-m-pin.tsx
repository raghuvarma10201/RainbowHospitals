// ---------- MODULE IMPORTS ----------
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastService} from '../../utils/service-handlers';
import {useNavigation} from '@react-navigation/native';
import {CombinedNavigationProp} from '../../types/navigation';
import {useAuth} from '../../context/auth-context';
import {postMpin} from '../../services/auth';
import {AuthCommonComponent} from '../../components/auth-common';
import {h, pallette} from '../../constants/constants';
import {useFormik} from 'formik';
import * as Yup from 'yup';

// ---------- COMPONENT ----------
const SetMpin: React.FC = () => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const navigation = useNavigation<CombinedNavigationProp>();
  const {setLoggedIn} = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    console.log('called');

    try {
      setLoading(true);
      const phoneNumber = await AsyncStorage.getItem('mobileNumber');
      const response = await postMpin({MobileNo: phoneNumber, mpin});
      if (response?.success && response?.status === 200) {
        ToastService.success('Success', 'mPIN set successfully');
        await AsyncStorage.setItem('mPin', mpin);
        setLoggedIn(true);
        navigation.navigate('Dashboard');
      } else {
        ToastService.error('Error', response?.message || 'Failed to set mPIN');
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
  };

  const formik = useFormik({
    initialValues: {mpin: '', confirmMpin: ''},
    validationSchema: Yup.object({
      mpin: Yup.string()
        .matches(/^\d{4}$/, 'Enter a valid 4-digit M-Pin')
        .required('M-Pin is required'),
      confirmMpin: Yup.string()
        .matches(/^\d{4}$/, 'Enter a valid 4-digit M-Pin')
        .oneOf([Yup.ref('mpin')], 'M-PINs must match')
        .required('Confirm M-Pin is required'),
    }),
    onSubmit: async () => {
      handleSubmit();
    },
  });

  const handleMpinChange = useCallback(
    (field: 'mpin' | 'confirmMpin', text: string) => {
      const cleanText = text.replace(/[^0-9]/g, '');
      if (field === 'mpin') {
        setMpin(cleanText);
      } else {
        setConfirmMpin(cleanText);
      }
      formik.setFieldValue(field, cleanText);
    },
    [formik],
  );

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
          toEnter={'M-Pin'}
          subTxt={`Set M-Pin`}
          input={'mpin'}
          btnTxt={'Confirm'}
          handleNumberChange={handleMpinChange}
          formik={formik}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 22, textAlign: 'center', marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SetMpin;

// ---------- MODULE IMPORTS ----------
import React, {useCallback, useEffect, useState} from 'react';
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
import {CommonActions, useNavigation} from '@react-navigation/native';
import {CombinedNavigationProp} from '../../types/navigation';
import {useAuth} from '../../context/auth-context';
import {postMpin, verifyMpin} from '../../services/auth';
import {AuthCommonComponent} from '../../components/auth-common';
import {h, pallette} from '../../constants/constants';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useApp} from '../../context/app-context';
import {routes} from '../../utils';

// ---------- COMPONENT ----------
const SetMpin: React.FC = () => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExistingMpin, setIsExistingMpin] = useState<boolean | null>(null); // null = loading
  const navigation = useNavigation<CombinedNavigationProp>();
  const {updateMpinEntered} = useApp(); // Add `setMpinEntered` in context

  // Check AsyncStorage for existing M-PIN on mount
  useEffect(() => {
    const checkMpin = async () => {
      const storedMpin = await AsyncStorage.getItem('mPin');
      if (storedMpin) setIsExistingMpin(true);
      else setIsExistingMpin(false);
    };
    checkMpin();
  }, [isExistingMpin]);

  const handleSubmit = async () => {
    const phoneNumber = await AsyncStorage.getItem('mobileNumber');
    setLoading(true);
    try {
      if (isExistingMpin) {
        // Enter M-PIN flow
        const response = await verifyMpin({MobileNo: phoneNumber, mpin});
        if (response?.success && response?.status === 200) {
          await AsyncStorage.setItem('mPin', mpin);
          updateMpinEntered(true); // Save in context
          const token = response.data.token;
          if (!token) ToastService.error('Error', 'Token Missing!');
          await AsyncStorage.multiSet([
            ['accessToken', token],
            ['refreshToken', token],
            ['tokenExpiry', response.data.expiryTime],
          ]);
          ToastService.success('Success', 'M-PIN verified successfully');
          // navigation.navigate('Category');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: routes.Category}],
            }),
          );
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Failed to verify M-PIN',
          );
          // formik.setFieldError('mpin', 'Invalid M-PIN');
        }
      } else {
        // Set M-PIN flow
        const response = await postMpin({MobileNo: phoneNumber, mpin});
        if (response?.success && response?.status === 200) {
          await AsyncStorage.setItem('mPin', mpin);
          updateMpinEntered(true); // Save in context
          ToastService.success('Success', 'M-PIN set successfully');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: routes.Category}],
            }),
          );
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Failed to set M-PIN',
          );
        }
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
    validationSchema: Yup.object(
      isExistingMpin
        ? {
            mpin: Yup.string()
              .matches(/^\d{4}$/, 'Enter a valid 4-digit M-PIN')
              .required('M-PIN is required'),
          }
        : {
            mpin: Yup.string()
              .matches(/^\d{4}$/, 'Enter a valid 4-digit M-PIN')
              .required('M-PIN is required'),
            confirmMpin: Yup.string()
              .matches(/^\d{4}$/, 'Enter a valid 4-digit M-PIN')
              .oneOf([Yup.ref('mpin')], 'M-PINs must match')
              .required('Confirm M-PIN is required'),
          },
    ),
    onSubmit: handleSubmit,
  });

  const handleMpinChange = useCallback(
    (field: 'mpin' | 'confirmMpin', text: string) => {
      const cleanText = text.replace(/[^0-9]/g, '');
      if (field === 'mpin') setMpin(cleanText);
      else setConfirmMpin(cleanText);
      formik.setFieldValue(field, cleanText);
    },
    [formik],
  );

  const handleReset = async () => {
    await AsyncStorage.removeItem('mPin');
    setIsExistingMpin(null);
  };

  // Show loader until AsyncStorage check is done
  if (isExistingMpin === null) return <Text>Loading...</Text>;

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
          toEnter={'M-PIN'}
          subTxt={``}
          input={'mpin'}
          btnTxt={'Confirm'}
          handleNumberChange={handleMpinChange}
          handleNumberBlur={handleReset}
          formik={formik}
          isSet={isExistingMpin}
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

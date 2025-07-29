import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthStackParamList, useAuth } from '../../App';
import { login } from '../services/auth'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastService } from '../utils/ToastService';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const local_data = [
  {
    value: '1',
    lable: '+91',

  },
  {
    value: '2',
    lable: '+92',

  },
];

const LoginSchema = Yup.object({
  mobileNumber: Yup.string().required('Please enter valid mobile number')
});
const Registration: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();
  const [value, setValue] = useState('');
  const [country, setCountry] = useState('1');
  const { setLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { mobileNumber: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors, setFieldError }) => {
      setLoading(true);
      try {
        setSubmitting(true);
        const response = await login({
          number: values.mobileNumber
        });
        if (response.status == 200 && response.success == true) {
          await AsyncStorage.multiSet([['mobileNumber', values.mobileNumber]]);
          ToastService.success('Success', 'Otp sent successfully');
          navigation.navigate('Otp');
        }
        // if backend succeeds, mark app as logged‑in
        //await AsyncStorage.multiSet([['mobileNumber', values.mobileNumber]]);
        //setLoggedIn(true);
      } catch (e: any) {
        console.error('Login failed', e);
        // Basic error surface – adapt as needed
        ToastService.error('Invalid credentials', 'Please try again');
        setErrors({ mobileNumber: 'Invalid credentials' });
      } finally {
        setSubmitting(false);
        setLoading(false);

      }
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View>
        <ImageBackground source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />




        <View style={styles.loginForm}>
          <Text variant="headlineMedium" style={styles.title}>SIGN IN</Text>
          <Text style={styles.labelText}>Mobile Number</Text>
          <View style={styles.formViewGroup}>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextContry}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={country}
              data={local_data}
              valueField="value"
              labelField="lable"
              placeholder="Select country"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => setCountry(e.value)}
            />

            <TextInput
              keyboardType="numeric"          // shows numeric keyboard
              maxLength={10}
              style={styles.formInput}
              placeholder="Enter Mobile Number"
              onChangeText={formik.handleChange('mobileNumber')}
              onBlur={formik.handleBlur('mobileNumber')}
              value={formik.values.mobileNumber}
            />
          </View>
          {formik.touched.mobileNumber && formik.errors.mobileNumber && <Text style={styles.errorMessage}>{formik.errors.mobileNumber}</Text>}
          <TouchableOpacity style={styles.primaryBt} onPress={() => formik.handleSubmit()}>
            <Text style={styles.primaryBtText}>Get OTP</Text>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>

  );
};

export default Registration;

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
    color: '#00B3AE', fontSize: 20, fontWeight: 'normal', marginTop: -12,
    textAlign: 'center', textTransform: 'uppercase', marginBottom: 5, fontFamily: 'ProximaNovaA-Bold'
  },

  labelText: {
    fontSize: 14, fontWeight: 'normal', color: '#000', marginBottom: 10, fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FFACAC',
    marginTop: 0,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: 400,
  },
  loginForm: {
    paddingHorizontal: 20

  },
  formViewGroup: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 0,
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: '#E6E7E8',
  },
  formInput: {
    height: 32,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginTop: 10,
    fontFamily:'ProximaNovaA-Regular',
  },
  primaryBt: {
    borderRadius: 40,
    backgroundColor: '#818385',
    marginBottom: 20,
    padding: 10,
    width: 200,
    alignSelf: 'center',
    marginTop:10,
  },
  primaryBtText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',

  },

  dropdownSelect: {
    height: 30,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRightWidth: 2,
    borderRightColor: '#6D6F71',
    width: 80,
  },

  placeholderCountry: {
    fontSize: 16,
    color: '#000',
    fontFamily:'ProximaNovaA-Regular',
  },
  selectedTextContry: {
    fontSize: 16,
    color: '#000',
    fontFamily:'ProximaNovaA-Regular',
  },

  dropdownList: {
    marginLeft: 0,
    marginRight: 10,
    padding: 0,
    textAlign: 'left',
    fontFamily:'ProximaNovaA-Regular',
  },

  imgTextGroup: {
    paddingLeft: 20,
  },
  imgTextBox: {
    width: '55%',
    paddingTop: 10,

    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    backgroundColor: '#3C2871',
    borderRadius: 10,
    marginTop: 0,


  },
  textbeforeDot: { position: 'relative' },
  imgTextTitle: {
    fontSize: Dimensions.get('window').height * 0.024,
    fontWeight: 'normal',
    color: '#fff',
    textAlign: 'left',
    paddingBottom: 20,
  },

  beforeDot: {
    position: 'absolute',
    top: '40%',
    right: '-20%',
    width: 30,
    height: 30,
    backgroundColor: '#00B3AE',
    borderRadius: 50,
    borderWidth: 7,
    borderColor: '#fff',
    marginRight: 6,

  },
  loginImg: {
    height: Dimensions.get('window').height * 0.43,
    width: '100%',
    marginTop: '-36%',
    position: 'relative',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    right: '-15%',
  }

});

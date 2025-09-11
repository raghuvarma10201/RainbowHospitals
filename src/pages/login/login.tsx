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

// ---------- STATIC DATA ----------
const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

const images = {
  logo: require('../../../assets/images/logo.png'),
  login: require('../../../assets/images/login-img.png'),
  loginRightArrow: require('../../../assets/images/login-right-arrow.png'),
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
        contentContainerStyle={{flexGrow: 1, paddingBottom: h * 0.05, backgroundColor:pallette.white}}
        keyboardShouldPersistTaps="handled">

      <View style={styles.container}>
              {/* LOGO */}
              <ImageBackground
                source={images.logo}
                style={styles.logo}
                resizeMode="contain"
              />

<Text style={styles.headingLightText}>India's no. 1</Text>
<Text style={styles.headingText}>Women and Children</Text>  
<Text style={styles.headingLightText}>Hospital Group</Text>
      </View>

      <Text style={styles.overFlowHeading}>Login / Register</Text>
      
          <View style={styles.container}>
              {/* FORM */}
              <View style={styles.formContainer}>
                <Text style={styles.title}>
                Enter Your Mobile No
                </Text>
                <Text style={styles.label}>Log in or sign up to book appointments, view records, and more.</Text>
                {/* INPUT GROUP */}
                <View style={styles.inputGroup}>
                  <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.dropdownText}
                    placeholderStyle={styles.dropdownText}
                    maxHeight={h * 0.25}
                    value={country}
                    data={local_data}
                    valueField="value"
                    labelField="lable"
                    placeholder="Select country"
                    onChange={handleCountryChange}
                  />
                  <TextInput
                    keyboardType="numeric"
                    maxLength={10}
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    onChangeText={handleNumberChange}
                    onBlur={handleNumberBlur}
                    value={formik.values.mobileNumber}
                  />
                </View>
                {/* ERROR */}
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                  <Text style={styles.error}>{formik.errors.mobileNumber}</Text>
                )}

                <Text style={[styles.label, {fontSize: adjust(13), marginTop: h * 0.01}]}>You will recive an OTP on this mobile number / or on your registered email id as well</Text>

                {/* SUBMIT BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    // {
                    //   backgroundColor:
                    //     formik.values.mobileNumber.length < 10 || loading
                    //       ? pallette.white
                    //       : pallette.dark_purple,
                    // },
                  ]}
                  onPress={handleSubmit}
                  disabled={formik.values.mobileNumber.length < 10 || loading}>
                  <Text style={styles.buttonText}>
                    {loading ? 'Sending...' : 'Request OTP'}
                  </Text> 
                  <View style={styles.buttonArrowContainer}>
                    <Image style={[styles.buttonArrow, {width: w * 0.05, height: h * 0.03}]} source={images.loginRightArrow} /></View>
                </TouchableOpacity>
              </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: w * 0.12,
  },

  logo: {
    marginBottom: h * 0.04,
    width: '100%',
    height: 'auto',
    aspectRatio: 16/9,
  },
  headingText: {
    fontSize: adjust(33),
    color: pallette.rainbow,
    fontFamily: 'ProximaNovaA-Bold',
    lineHeight: h * 0.04,
  },

  headingLightText: {
    fontSize: adjust(33),
    color: pallette.rainbow,
    fontFamily: 'ProximaNova-Light',
    lineHeight: h * 0.04,
  },



  overFlowHeading: {
    fontSize: adjust(18),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Bold',
    marginBottom: h * 0.02,
    backgroundColor: pallette.light_rainbow,
    width: w * 0.55,
    padding: h * 0.01,
    borderBottomRightRadius: h * 0.05,
    borderBottomLeftRadius: h * 0.05,
    textAlign: 'center',
    paddingLeft: w * 0.06,
    
  },

  formContainer: {

  },
  title: {
    color: pallette.black,
    fontSize: adjust(20),
    textAlign: 'left',
    marginBottom: h * 0.005,
    fontFamily: 'ProximaNovaA-Bold',
  },
  label: {
    fontSize: adjust(14),
    color: pallette.black,
    marginBottom: h * 0.017,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h * 0.007,
    paddingHorizontal: w * 0.025,
     borderWidth: 1,
     height: h * 0.055,
    borderColor: pallette.dark_grey,
    backgroundColor: pallette.white,
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
    width: 70,
    marginRight: 10,
    paddingHorizontal: 10,
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
    width: w * 0.55,
    height: h * 0.055,
    marginTop: h * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    color: pallette.black,
    borderColor: pallette. light_rainbow,
  },
  buttonText: {
    color: pallette.black,
    fontSize: adjust(15),
    textAlign: 'center',
    paddingRight: w * 0.04,
    fontFamily: 'ProximaNovaA-Bold',
    paddingLeft: w * 0.07,
    paddingVertical: h * 0.010,
  },

  buttonArrowContainer:{
    width: w * 0.11,
    backgroundColor: pallette.light_rainbow,
    height: h * 0.055,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

  },

  buttonArrow: {
    resizeMode: 'contain',
   
  },

});

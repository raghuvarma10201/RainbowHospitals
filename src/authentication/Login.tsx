import React, {useState} from 'react';
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
import {Text} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {login} from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastService} from '../utils/ToastService';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation/types';
import {pallette} from '../Constants/Constant';

// Device dimensions for responsive styling
const {height: h, width: w} = Dimensions.get('window');

// Static dropdown data for country codes
const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

// Yup schema for form validation
const LoginSchema = Yup.object({
  mobileNumber: Yup.string()
    .required('Please enter valid mobile number')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
});

const Login: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();

  const [country, setCountry] = useState('1');
  const [loading, setLoading] = useState(false);

  // Formik form setup
  const formik = useFormik({
    initialValues: {mobileNumber: ''},
    validationSchema: LoginSchema,
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      setLoading(true);
      try {
        const response = await login({number: values.mobileNumber});
        if (response.status === 200 && response.success) {
          await AsyncStorage.multiSet([['mobileNumber', values.mobileNumber]]);
          ToastService.success('Success', 'OTP sent successfully');
          navigation.navigate('Otp');
        }
      } catch (e) {
        console.log('Login failed', e);
        ToastService.error('Invalid credentials', 'Please try again');
        setErrors({mobileNumber: 'Invalid credentials'});
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // adjust if you have a header
    >
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: h * 0.05}}
        keyboardShouldPersistTaps="handled">
        {/* Logo Section */}
        <ImageBackground
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Image + Tagline Section */}
        <View style={styles.imgTextGroup}>
          <View style={styles.imgTextBox}>
            <View style={styles.textbeforeDot}>
              <View style={styles.beforeDot} />
              <Text style={styles.imgTextTitle}>
                Leading multi-specialty Hospital for pediatrics, obstetrics &
                gynecology
              </Text>
            </View>
          </View>
          <Image
            source={require('../../assets/images/login-img.png')}
            style={styles.loginImg}
            resizeMode="contain"
          />
        </View>

        {/* Login Form Section */}
        <View style={styles.loginForm}>
          <Text variant="headlineMedium" style={styles.title}>
            SIGN IN
          </Text>

          <Text style={styles.labelText}>Mobile Number</Text>

          {/* Country Dropdown + Mobile Input */}
          <View style={styles.formViewGroup}>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextContry}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={h * 0.25}
              value={country}
              data={local_data}
              valueField="value"
              labelField="lable"
              placeholder="Select country"
              containerStyle={styles.dropdownList}
              activeColor={pallette.white}
              onChange={e => setCountry(e.value)}
            />
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={styles.formInput}
              placeholder="Enter Mobile Number"
              onChangeText={formik.handleChange('mobileNumber')}
              onBlur={formik.handleBlur('mobileNumber')}
              value={formik.values.mobileNumber}
            />
          </View>

          {/* Error Message */}
          {formik.touched.mobileNumber && formik.errors.mobileNumber && (
            <Text style={styles.errorMessage}>
              {formik.errors.mobileNumber}
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.primaryBt}
            onPress={() => formik.handleSubmit()}
            disabled={loading}>
            <Text style={styles.primaryBtText}>
              {loading ? 'Sending...' : 'Get OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    paddingVertical: h * 0.03,
  },

  /* Logo Section */
  logoImage: {
    alignSelf: 'center',
    marginTop: h * 0.07,
    marginBottom: h * 0.08,
    width: w * 0.8,
    height: h * 0.11,
    justifyContent: 'space-between',
  },

  /* Title Text */
  title: {
    color: pallette.app_green,
    fontSize: h * 0.025,
    fontWeight: 'normal',
    marginTop: -h * 0.015,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: h * 0.005,
    fontFamily: 'ProximaNovaA-Bold',
  },

  labelText: {
    fontSize: h * 0.018,
    fontWeight: 'normal',
    color: pallette.black,
    marginBottom: h * 0.012,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },

  errorMessage: {
    color: pallette.red,
    marginBottom: h * 0.007,
    fontSize: h * 0.016,
    fontWeight: '400',
  },

  /* Login Form Container */
  loginForm: {
    paddingHorizontal: w * 0.05,
  },

  /* Input Group */
  formViewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h * 0.007,
    paddingHorizontal: w * 0.025,
    paddingVertical: h * 0.012,
    backgroundColor: pallette.light_grey,
  },
  formInput: {
    height: h * 0.045,
    fontSize: h * 0.018,
    paddingHorizontal: w * 0.025,
    flex: 1,
    fontFamily: 'ProximaNovaA-Regular',
  },

  /* Submit Button */
  primaryBt: {
    borderRadius: h * 0.05,
    backgroundColor: pallette.dark_grey,
    marginBottom: h * 0.025,
    paddingVertical: h * 0.015,
    paddingHorizontal: w * 0.05,
    width: w * 0.5,
    alignSelf: 'center',
    marginTop: h * 0.015,
  },
  primaryBtText: {
    color: pallette.white,
    fontSize: h * 0.018,
    textAlign: 'center',
  },

  /* Country Dropdown */
  dropdownSelect: {
    height: h * 0.04,
    paddingHorizontal: w * 0.025,
    borderRightWidth: 2,
    borderRightColor: pallette.dark_grey,
    width: w * 0.2,
    marginRight: w * 0.02,
  },
  placeholderCountry: {
    fontSize: h * 0.018,
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  selectedTextContry: {
    fontSize: h * 0.018,
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  dropdownList: {
    padding: 0,
    fontFamily: 'ProximaNovaA-Regular',
  },

  /* Tagline Section */
  imgTextGroup: {
    paddingLeft: w * 0.05,
  },
  imgTextBox: {
    width: w * 0.45,
    paddingVertical: h * 0.012,
    paddingHorizontal: w * 0.04,
    backgroundColor: pallette.app_purple,
    borderRadius: w * 0.025,
  },
  textbeforeDot: {position: 'relative'},
  imgTextTitle: {
    fontSize: h * 0.024,
    color: pallette.white,
    textAlign: 'left',
    paddingBottom: h * 0.025,
  },
  beforeDot: {
    position: 'absolute',
    top: '40%',
    right: '-20%',
    width: w * 0.08,
    height: w * 0.08,
    backgroundColor: pallette.app_green,
    borderRadius: w * 0.1,
    borderWidth: w * 0.02,
    borderColor: pallette.white,
  },
  loginImg: {
    height: h * 0.43,
    width: '100%',
    marginTop: -h * 0.18,
    alignSelf: 'flex-end',
    right: '-15%',
  },
});

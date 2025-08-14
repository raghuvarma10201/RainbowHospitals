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

const {height: h, width: w} = Dimensions.get('window');

const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: h * 0.05}}
        keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.taglineWrapper}>
          <View style={styles.taglineBox}>
            <View style={styles.beforeDot} />
            <Text style={styles.tagline}>
              Leading multi-specialty Hospital for pediatrics, obstetrics &
              gynecology
            </Text>
          </View>
          <Image
            source={require('../../assets/images/login-img.png')}
            style={styles.loginImg}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            SIGN IN
          </Text>
          <Text style={styles.label}>Mobile Number</Text>

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
              onChange={e => setCountry(e.value)}
            />
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              placeholder="Enter Mobile Number"
              onChangeText={formik.handleChange('mobileNumber')}
              onBlur={formik.handleBlur('mobileNumber')}
              value={formik.values.mobileNumber}
            />
          </View>

          {formik.touched.mobileNumber && formik.errors.mobileNumber && (
            <Text style={styles.error}>{formik.errors.mobileNumber}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => formik.handleSubmit()}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Get OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginVertical: h * 0.05,
    width: w * 0.8,
    height: h * 0.09,
  },
  taglineWrapper: {
    paddingLeft: w * 0.05,
  },
  taglineBox: {
    width: w * 0.45,
    padding: h * 0.012,
    backgroundColor: pallette.app_purple,
    borderRadius: w * 0.025,
    marginBottom: h * 0.02,
  },
  beforeDot: {
    position: 'absolute',
    top: '40%',
    right: '-10%',
    width: w * 0.08,
    height: w * 0.08,
    backgroundColor: pallette.app_green,
    borderRadius: w * 0.1,
    borderWidth: w * 0.02,
    borderColor: pallette.white,
  },
  tagline: {
    fontSize: h * 0.024,
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
    color: pallette.app_green,
    fontSize: h * 0.025,
    textAlign: 'center',
    marginBottom: h * 0.01,
    fontFamily: 'ProximaNovaA-Bold',
  },
  label: {
    fontSize: h * 0.018,
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
    fontSize: h * 0.018,
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
    fontSize: h * 0.018,
    color: pallette.black,
  },
  error: {
    color: pallette.red,
    marginBottom: h * 0.007,
    fontSize: h * 0.016,
  },
  button: {
    borderRadius: h * 0.05,
    backgroundColor: pallette.dark_grey,
    paddingVertical: h * 0.015,
    width: w * 0.5,
    alignSelf: 'center',
    marginTop: h * 0.015,
  },
  buttonText: {
    color: pallette.white,
    fontSize: h * 0.018,
    textAlign: 'center',
  },
});

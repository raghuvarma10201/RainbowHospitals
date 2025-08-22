import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {registerUser} from '../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastService} from '../utils/ToastService';
import Loader from '../components/loader';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';
import {useAuth} from '../context/auth-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {pallette} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

const gender_data = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
];

const bloodgroup_data = [
  {value: 'A', label: 'A'},
  {value: 'B', label: 'B'},
  {value: 'AB', label: 'AB'},
  {value: 'O', label: 'O'},
];

const rhfactor_data = [
  {label: 'Positive', value: 'positive'},
  {label: 'Negative', value: 'negative'},
];

const countries_data = [
  {label: 'India', value: 'IN'},
  {label: 'United States', value: 'US'},
  {label: 'United Kingdom', value: 'UK'},
  {label: 'Canada', value: 'CA'},
  {label: 'Australia', value: 'AU'},
];

const RegistrationSchema = Yup.object({
  // mobileNumber: Yup.string().required('Please enter valid mobile number'),

  foreName: Yup.string().required('Fore Name is required'),
  middleName: Yup.string().required('Middle Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  // email: Yup.string().required('Email is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  country: Yup.string().required('Country is required'),
  dob: Yup.string().required('Date of Birth is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  gender: Yup.string().required('Gender is required'),
  bloodgroup: Yup.string().required('Blood Group is required'),
  rhfactor: Yup.string().required('RHfactor is required'),
  // address: Yup.string().required('Address is required'),
  // pincode: Yup.string().required('Pincode is required'),
  checked: Yup.boolean().required(
    'Please agree to our Terms of Services and Privacy Policy',
  ),
});
const Registration: React.FC = () => {
  type CombinedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<MainStackParamList>
  >;
  const navigation = useNavigation<CombinedNavigationProp>();

  const [checked, setChecked] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('mobileNumber').then(mobileNumber => {
      if (mobileNumber) {
        setMobileNumber(mobileNumber);
      }
    });
  }, []);

  // DateTimePickerModal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  // DateTimePickerModal End

  const {setLoggedIn} = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      foreName: '',
      middleName: '',
      lastName: '',
      email: '',
      country: '',
      dob: '',
      phoneNumber: '',
      gender: '',
      bloodgroup: '',
      rhfactor: '',
      // address: '', pincode: '',
      checked: false,
    },

    validationSchema: RegistrationSchema,
    onSubmit: async (values, {setSubmitting, setErrors, setFieldError}) => {
      setLoading(true);
      try {
        setSubmitting(true);
        const response = await registerUser({
          //  ForeName: "Chandra",
          // MiddleName: "shekhar",
          // LastName: "A",
          // Gender: "Male",
          // dtBirthDttm: "2016-12-28T00:00:00.000Z",
          // PhoneNo: "12345678",
          // MobileNo: "8686865707",
          // EmailId: "test@gmail.com",
          // OrganisationUID: "8",
          // MotherName: "qwerty",
          // Country: "India",
          // Bloodgroup: "A",
          // RHfactor: "POSITIVE",
          // PatientID: "MAHTMP-169626",
          // relation:"father"

          ForeName: values.foreName,
          MiddleName: values.middleName,
          LastName: values.lastName,
          Gender: values.gender,
          dtBirthDttm: values.dob,
          EmailId: values.email,
          Country: values.country,
          PhoneNo: values.phoneNumber,
          Bloodgroup: values.bloodgroup,
          RHfactor: values.rhfactor,
          checked: checked,
          relation: 'self',
          OrganisationUID: '8',
          MobileNo: mobileNumber,
        });

        if (response.status == 200 && response.success == true) {
          await AsyncStorage.multiSet([
            ['foreName', values.foreName],
            ['middleName', values.middleName],
            ['lastName', values.lastName],
            ['email', values.email],
            ['country', values.country],
            ['dob', values.dob],
            ['phoneNumber', values.phoneNumber],
            ['gender', values.gender],
            ['bloodgroup', values.bloodgroup],
            ['rhfactor', values.rhfactor],
            ['checked', checked.toString()],
            ['mobileNumber', mobileNumber],
          ]);

          ToastService.success('Success', 'Registration sent successfully');
          setLoggedIn(true);
        }
      } catch (e: any) {
        console.error('Registration failed', e);
        // Basic error surface – adapt as needed
        ToastService.error('Invalid credentials', 'Please try again');
        // setErrors({ mobileNumber: 'Invalid credentials' });
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Registration
        </Text>
        <Text style={styles.labelText}>
          You need to register your account only once.
        </Text>

        <View style={styles.regForm}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Fore Name *</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="default" // shows numeric keyboard
              maxLength={10}
              placeholder="Enter Fore Name"
              onChangeText={formik.handleChange('foreName')}
              onBlur={formik.handleBlur('foreName')}
              value={formik.values.foreName}
            />
            {formik.touched.foreName && formik.errors.foreName && (
              <Text style={styles.errorMessage}>{formik.errors.foreName}</Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Middle Name *</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="default"
              placeholder="Enter Middle Name"
              placeholderTextColor="#000"
              onChangeText={formik.handleChange('middleName')}
              onBlur={formik.handleBlur('middleName')}
              value={formik.values.middleName}
            />
            {formik.touched.middleName && formik.errors.middleName && (
              <Text style={styles.errorMessage}>
                {formik.errors.middleName}
              </Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Last Name *</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="default"
              placeholder="Enter Last Name"
              placeholderTextColor="#000"
              onChangeText={formik.handleChange('lastName')}
              onBlur={formik.handleBlur('lastName')}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <Text style={styles.errorMessage}>{formik.errors.lastName}</Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#000"
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorMessage}>{formik.errors.email}</Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Country</Text>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextContry}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={formik.values.country}
              data={countries_data}
              valueField="value"
              labelField="label"
              placeholder="Select country"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => formik.setFieldValue('country', e.label)}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date of Birth</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.formInput}>
                {formik.values.dob
                  ? new Date(formik.values.dob).toDateString()
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue('dob', date.toISOString());
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Phone Number</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={styles.formInput}
              placeholder="Enter Phone Number"
              placeholderTextColor="#000"
              onChangeText={formik.handleChange('phoneNumber')}
              onBlur={formik.handleBlur('phoneNumber')}
              value={formik.values.phoneNumber}
              editable={false}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Text style={styles.errorMessage}>
                {formik.errors.phoneNumber}
              </Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Mobile Number</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={styles.formInput}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#000"
              onChangeText={formik.handleChange('mobileNumber')}
              onBlur={formik.handleBlur('mobileNumber')}
              value={mobileNumber}
              editable={false}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Text style={styles.errorMessage}>
                {formik.errors.phoneNumber}
              </Text>
            )}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Gender </Text>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextGender}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={formik.values.gender}
              data={gender_data}
              valueField="value"
              labelField="label"
              placeholder="Select Gender"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => formik.setFieldValue('gender', e.label)}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Blood Group </Text>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextGender}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={formik.values.bloodgroup}
              data={bloodgroup_data}
              valueField="value"
              labelField="label"
              placeholder="Select Blood Group"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => formik.setFieldValue('bloodgroup', e.value)}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>RH factor </Text>
            <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextGender}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={formik.values.rhfactor}
              data={rhfactor_data}
              valueField="value"
              labelField="label"
              placeholder="Select RH factor"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => formik.setFieldValue('rhfactor', e.value)}
            />
          </View>

          {/* 
        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Address</Text>
            <TextInput style={styles.formInput}
                  keyboardType="default"                  
                  placeholder="Enter Address"
                   placeholderTextColor="#000"
                  onChangeText={formik.handleChange('address')}
                  onBlur={formik.handleBlur('address')}
                   //  value={formik.values.email}
                  />
        </View> */}
          {/* <View style={styles.formRow}>
           <Text style={styles.formLabel}>Pincode</Text>
            <TextInput style={styles.formInput}
             keyboardType="default"                  
             placeholder="Enter Pincode"
              placeholderTextColor="#000"
             onChangeText={formik.handleChange('pincode')}
             onBlur={formik.handleBlur('pincode')}
              //  value={formik.values.email}
              />
        </View> */}
          <View style={styles.formRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setChecked(!checked)}>
              <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkBoxlabel}>
                Agree to our Terms of Services and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.formViewGroup}>
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
          </View> */}
          {/* {formik.touched.mobileNumber && formik.errors.mobileNumber && <Text style={styles.errorMessage}>{formik.errors.mobileNumber}</Text>} */}

          <TouchableOpacity
            style={styles.primaryBt}
            onPress={() => formik.handleSubmit()}>
            <Text style={styles.primaryBtText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 0,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 0,
  },
  title: {
    color: pallette.app_green,
    fontSize: adjust(18),
    fontWeight: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'ProximaNovaA-Bold',
    marginTop: 60,
  },

  labelText: {
    fontSize: adjust(12),
    fontWeight: 'normal',
    color: pallette.black,
    marginBottom: 10,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },

  primaryBt: {
    borderRadius: 40,
    backgroundColor: '#818385',
    marginBottom: 20,
    padding: 10,
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
  primaryBtText: {
    color: pallette.white,
    fontSize: adjust(12),
    fontWeight: 'normal',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FF0000',
    marginTop: 0,
    marginBottom: 5,
    fontSize: adjust(12),
    fontWeight: 400,
  },
  loginForm: {
    paddingHorizontal: 20,
  },
  formRow: {marginBottom: 12},
  formLabel: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 5,
  },
  formInput: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: pallette.app_light_green,
    borderRadius: 10,
    padding: 10,
    backgroundColor: pallette.app_light_green,
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.black,
  },
  formButton: {
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  formButtonText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },
  regForm: {marginTop: 10},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  checkBoxlabel: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    flexWrap: 'wrap',
    paddingRight: 20,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: pallette.app_purple,
    borderColor: pallette.app_purple,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: adjust(10),
  },
  dropdownSelect: {
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: pallette.app_light_green,
    borderRadius: 10,
    backgroundColor: pallette.app_light_green,
  },
  placeholderCountry: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  selectedTextContry: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  dropdownList: {
    marginLeft: 0,
    marginRight: 10,
    padding: 0,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.black,
  },
  selectedTextGender: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
});

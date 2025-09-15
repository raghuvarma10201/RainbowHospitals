import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, ImageBackground} from 'react-native';
import {Text} from 'react-native-paper';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {registerUser} from '../../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastService} from '../../utils/service-handlers';
import {useNavigation} from '@react-navigation/native';
import {CombinedNavigationProp} from '../../types/navigation';  
import {useAuth} from '../../context/auth-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {h, pallette} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import {FormInput, FormDropdown} from '.';

// ---------- Static Data ----------
const genderOptions = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
];

const bloodGroups = [
  {value: 'A', label: 'A'},
  {value: 'B', label: 'B'},
  {value: 'AB', label: 'AB'},
  {value: 'O', label: 'O'},
];

const rhFactors = [
  {value: 'positive', label: 'Positive'},
  {value: 'negative', label: 'Negative'},
];

const countries = [
  {value: 'IN', label: 'India'},
  {value: 'US', label: 'United States'},
  {value: 'UK', label: 'United Kingdom'},
  {value: 'CA', label: 'Canada'},
  {value: 'AU', label: 'Australia'},
];

// ---------- Validation ----------
const RegistrationSchema = Yup.object({
  foreName: Yup.string().required('Fore Name is required'),
  middleName: Yup.string().required('Middle Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  country: Yup.string().required('Country is required'),
  dob: Yup.string().required('Date of Birth is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  gender: Yup.string().required('Gender is required'),
  bloodgroup: Yup.string().required('Blood Group is required'),
  rhfactor: Yup.string().required('RH factor is required'),
  checked: Yup.boolean().oneOf(
    [true],
    'Please agree to Terms & Privacy Policy',
  ),
});

// ---------- Main Component ----------
const Registration: React.FC = () => {
  const navigation = useNavigation<CombinedNavigationProp>();
  const {setLoggedIn} = useAuth();

  const [mobileNumber, setMobileNumber] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      if (storedNumber) setMobileNumber(storedNumber);
    })();
  }, []);

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
      checked: false,
    },
    validationSchema: RegistrationSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        const response = await registerUser({
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
          checked: values.checked,
          relation: 'self',
          OrganisationUID: '8',
          MobileNo: mobileNumber,
        });

        if (response.status === 200 && response.success) {
          const entries: any = Object.entries({...values, mobileNumber}).map(
            ([k, v]) => [k, String(v)],
          );
          await AsyncStorage.multiSet(entries);

          ToastService.success('Success', 'Registration sent successfully');
          setLoggedIn(true);
        }
      } catch (e) {
        console.error('Registration failed', e);
        ToastService.error('Invalid credentials', 'Please try again');
      } finally {
        setLoading(false);
      }
    },
  });

  // ---------- Field Config Array ----------
  const fields = [
    {
      type: 'input',
      name: 'foreName',
      label: 'Fore Name *',
      placeholder: 'Enter Fore Name',
      keyboardType: 'default',
      maxLength: 30,
    },
    {
      type: 'input',
      name: 'middleName',
      label: 'Middle Name *',
      placeholder: 'Enter Middle Name',
      keyboardType: 'default',
      maxLength: 30,
    },
    {
      type: 'input',
      name: 'lastName',
      label: 'Last Name *',
      placeholder: 'Enter Last Name',
      keyboardType: 'default',
      maxLength: 30,
    },
    {
      type: 'input',
      name: 'email',
      label: 'Email *',
      placeholder: 'Enter Email',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      type: 'dropdown',
      name: 'country',
      label: 'Country *',
      data: countries,
      placeholder: 'Select Country',
    },
    {type: 'date', name: 'dob', label: 'Date of Birth *'},
    {
      type: 'input',
      name: 'phoneNumber',
      label: 'Phone Number *',
      placeholder: 'Enter Phone Number',
      keyboardType: 'numeric',
      maxLength: 10,
    },
    {
      type: 'dropdown',
      name: 'gender',
      label: 'Gender *',
      data: genderOptions,
      placeholder: 'Select Gender',
    },
    {
      type: 'dropdown',
      name: 'bloodgroup',
      label: 'Blood Group *',
      data: bloodGroups,
      placeholder: 'Select Blood Group',
    },
    {
      type: 'dropdown',
      name: 'rhfactor',
      label: 'RH Factor *',
      data: rhFactors,
      placeholder: 'Select RH Factor',
    },
    {
      type: 'checkbox',
      name: 'checked',
      label: 'Agree to Terms of Services and Privacy Policy',
    },
  ];

  return (
    <>
   
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <ImageBackground
          source={require('../../../assets/images/topbg.png')}
          style={{
            height: h * 0.2,
            width:'100%',
            position: 'absolute',
            top: -(h * 0.05),
            right: 0,
            left: 0,
          }}
          resizeMode="cover"
        />

        <ImageBackground
          source={require('../../../assets/images/bottombg.png')}
          style={{
            height: h * 0.4,
            width:'100%',
            position: 'absolute',
            bottom: -(h * 0.1),
            right: 0,
            left: 0,
          }}
          resizeMode="cover"
        />
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Registration
        </Text>
        <Text style={styles.labelText}>
          You need to register your account only once.
        </Text>

        {/* Render All Fields Dynamically */}
        {fields.map(field => {
          const value = formik.values[field.name as keyof typeof formik.values];
          const error =
            formik.touched[field.name as keyof typeof formik.touched] &&
            formik.errors[field.name as keyof typeof formik.errors];

          if (field.type === 'input') {
            return (
              <FormInput
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                keyboardType={field.keyboardType}
                maxLength={field.maxLength}
                autoCapitalize={field.autoCapitalize}
                value={String(value)}
                onChangeText={formik.handleChange(field.name)}
                onBlur={formik.handleBlur(field.name)}
                error={error}
                styles={styles}
              />
            );
          }

          if (field.type === 'dropdown') {
            return (
              <FormDropdown
                key={field.name}
                label={field.label}
                data={field.data}
                value={value}
                placeholder={field.placeholder}
                onChange={(val: string) =>
                  formik.setFieldValue(field.name, val)
                }
                error={error}
                styles={styles}
              />
            );
          }

          if (field.type === 'date') {
            return (
              <View key={field.name} style={styles.formRow}>
                <Text style={styles.formLabel}>{field.label}</Text>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                  <Text style={styles.formInput}>
                    {value
                      ? new Date(value as string).toDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={date => {
                    formik.setFieldValue(field.name, date.toISOString());
                    setDatePickerVisibility(false);
                  }}
                  onCancel={() => setDatePickerVisibility(false)}
                />
                {error && <Text style={styles.errorMessage}>{error}</Text>}
              </View>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <View key={field.name} style={styles.formRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => formik.setFieldValue(field.name, !value)}>
                  <View style={[styles.checkbox, value && styles.checked]}>
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkBoxlabel}>{field.label}</Text>
                </TouchableOpacity>
                {error && <Text style={styles.errorMessage}>{error}</Text>}
              </View>
            );
          }

          return null;
        })}

        {/* Submit */}
        <TouchableOpacity
          style={styles.primaryBt}
          onPress={formik.handleSubmit as any}
          disabled={loading}>
          <Text style={styles.primaryBtText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};

export default Registration;

// ---------- Styles ----------
const styles = StyleSheet.create({
  scrollContent: {paddingBottom: 20, backgroundColor:pallette.white},
  container: {flex: 1, paddingHorizontal: 15, paddingBottom: 10, backgroundColor:'transparent'},
  title: {
    color: pallette.teal,
    fontSize: adjust(18),
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'ProximaNovaA-Bold',
    marginTop:30,
  },
  labelText: {
    fontSize: adjust(12),
    color: pallette.black,
    marginBottom: 20,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },
  primaryBt: {
    borderRadius: 40,
    backgroundColor: '#818385',
    padding: 10,
    width: 200,
    alignSelf: 'center',
    marginTop: 20,
  },
  primaryBtText: {
    color: pallette.white,
    fontSize: adjust(12),
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FF0000',
    marginTop: 2,
    marginBottom: 5,
    fontSize: adjust(12),
  },
  formRow: {marginBottom: 12},
  formLabel: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 5,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderColor: pallette.pale_turquoise,
    borderRadius: 10,
    padding: 10,
    backgroundColor: pallette.pale_turquoise,
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.black,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkBoxlabel: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: pallette.dark_purple,
    borderColor: pallette.dark_purple,
  },
  checkmark: {color: 'white', fontWeight: 'bold', fontSize: adjust(10)},
  dropdownSelect: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: pallette.pale_turquoise,
    borderRadius: 10,
    backgroundColor: pallette.pale_turquoise,
    paddingHorizontal: 10,
  },
  placeholderText: {fontSize: adjust(12), color: pallette.dark_grey},
  selectedText: {fontSize: adjust(12), color: pallette.black},
  dropdownList: {
    fontSize: adjust(12),
    color: pallette.black,
    marginLeft: 0,
    marginRight: 10,
    padding: 0,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, TextInput, Image, TouchableOpacity,  Pressable, Platform } from 'react-native';
import { Button, Text, } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/auth'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastService } from '../utils/ToastService';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const gender_data = [
  {
    value: '1',
    label: 'male',

  },
  {
    value: '2',
    label: 'Female',

  },
];


const countries_data =[
  { label: 'India', value: 'IN' },
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
];

const LoginSchema = Yup.object({
  mobileNumber: Yup.string().required('Please enter valid mobile number'),
  dob: Yup.string().required('Date of Birth is required'),
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().required('Email is required'),
});
const Registration: React.FC = () => {
  const [checked, setChecked] = useState(false);

 // DateTimePickerModal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const showDatePicker = () => {setDatePickerVisibility(true);};
  const hideDatePicker = () => {setDatePickerVisibility(false);};
  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
 // DateTimePickerModal End

  type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const { setLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({

    initialValues: {
       mobileNumber: '', title:'', firstName:'', lastName:'', email:'',        
      },

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
        // setErrors({ mobileNumber: 'Invalid credentials' });
        setErrors({ title: 'Invalid credentials' });
        setErrors({ firstName: 'Invalid credentials' });
        setErrors({ lastName: 'Invalid credentials' });
        setErrors({ email: 'Invalid credentials' });
      } finally {
        setSubmitting(false);
        setLoading(false);

      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>

      <Text variant="headlineMedium" style={styles.title}>Registration</Text>
      <Text style={styles.labelText}>You need to register your account only once.</Text>
        
        <View style={styles.regForm}>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Title *</Text>
            <TextInput style={styles.formInput}
              keyboardType="default"          // shows numeric keyboard
              maxLength={10}                  
              placeholder="Enter Title"
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              value={formik.values.title}
            />   
              {formik.touched.title && formik.errors.title && <Text style={styles.errorMessage}>{formik.errors.title}</Text>}     
        </View>
    

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>First Name *</Text>
            <TextInput style={styles.formInput}
             keyboardType="default"                  
             placeholder="Enter First Name"
              placeholderTextColor="#000"
             onChangeText={formik.handleChange('firstName')}
             onBlur={formik.handleBlur('firstName')}
             value={formik.values.firstName}
             />
               {formik.touched.firstName && formik.errors.firstName && <Text style={styles.errorMessage}>{formik.errors.firstName}</Text>} 
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Last Name *</Text>
            <TextInput style={styles.formInput}
             keyboardType="default"                  
             placeholder="Enter Last Name"
              placeholderTextColor="#000"
             onChangeText={formik.handleChange('lastName')}
             onBlur={formik.handleBlur('lastName')}
             value={formik.values.lastName}
           />
             {formik.touched.lastName && formik.errors.lastName && <Text style={styles.errorMessage}>{formik.errors.lastName}</Text>} 
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Email *</Text>
            <TextInput style={styles.formInput}
             keyboardType="email-address"
             autoCapitalize="none"
             placeholder="Enter your email"
              placeholderTextColor="#000"
             onChangeText={formik.handleChange('email')}
             onBlur={formik.handleBlur('email')}
            value={formik.values.email}
             />
               {formik.touched.email && formik.errors.email && <Text style={styles.errorMessage}>{formik.errors.email}</Text>} 
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Country</Text>
           <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextContry}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={country}
              data={countries_data}
              valueField="value"
              labelField="label"
              placeholder="Select country"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => setCountry(e.value)}
            />       
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Date of Birth</Text>
              <TouchableOpacity onPress={showDatePicker}>
                <Text style={styles.formInput}>
                  {selectedDate ? selectedDate.toDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />    
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Gender </Text>
           <Dropdown
              style={styles.dropdownSelect}
              selectedTextStyle={styles.selectedTextGender}
              placeholderStyle={styles.placeholderCountry}
              maxHeight={200}
              value={gender}
              data={gender_data}
              valueField="value"
              labelField="label"
              placeholder="Select Gender"
              containerStyle={styles.dropdownList}
              activeColor="#fff"
              onChange={e => setGender(e.value)}
            />
        </View>
        

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
        </View>

        <View style={styles.formRow}>
           <Text style={styles.formLabel}>Pincode</Text>
            <TextInput style={styles.formInput}
             keyboardType="default"                  
             placeholder="Enter Pincode"
              placeholderTextColor="#000"
             onChangeText={formik.handleChange('pincode')}
             onBlur={formik.handleBlur('pincode')}
              //  value={formik.values.email}
              />
        </View>

        <View style={styles.formRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setChecked(!checked)}
          >
            <View style={[styles.checkbox, checked && styles.checked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkBoxlabel}>Agree to our Terms of Services and Privacy Policy</Text>
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
        
          <TouchableOpacity style={styles.primaryBt} onPress={() => formik.handleSubmit()}>
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
    paddingBottom:20,
  },

  container: {
    flex: 1,
    paddingHorizontal:15,
    paddingBottom: 10,
    paddingTop: 0,
  },

  title: {
    color: '#00B3AE', 
    fontSize: 20, 
    fontWeight: 'normal',   
    textAlign: 'center', 
    textTransform: 'uppercase', 
    fontFamily: 'ProximaNovaA-Bold',
    marginTop:60,
  },

  labelText: {
    fontSize: 14, 
    fontWeight: 'normal', 
    color: '#000', 
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
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',

  },

  errorMessage: {
    color: '#FF0000',
    marginTop: 0,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: 400,
  },
  loginForm: {
    paddingHorizontal: 20

  },







  formRow:{marginBottom:12,},
  formLabel:{fontSize:12, fontFamily:'ProximaNovaA-Regular', color:'#000', marginBottom:5,},
  formInput:{
    height:40,
    flex:1,
    borderWidth:1,
    borderColor:'#C7E8E7',
    borderRadius:10,
    padding:10,
    backgroundColor:'#C7E8E7',
    fontFamily:'ProximaNovaA-Regular',
    fontSize:14,
    color:'#000',
  },
  

  formButton:{
    backgroundColor:'#3C2871',
    borderRadius:10,
    padding:10,
    marginTop:10,
  },
  formButtonText:{
    color:'#fff',
    textAlign:'center',
    fontSize:14,
    fontFamily:'ProximaNovaA-Bold',
    fontWeight:'bold',
    padding:5,
    borderRadius:10, 
  },

  regForm:{marginTop:10,},

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  checkBoxlabel:{
    fontFamily:'ProximaNovaA-Regular',
    fontSize:13,
    flexWrap: 'wrap',
    paddingRight:20,
  
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
    backgroundColor: '#3C2871',
    borderColor: '#3C2871',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  //--
  
  dropdownSelect: {
    paddingHorizontal: 10, 
    width: '100%',
    height:40,
    flex:1,
    borderWidth:1,
    borderColor:'#C7E8E7',
    borderRadius:10,
    backgroundColor:'#C7E8E7',
  },

  placeholderCountry: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
  },
  selectedTextContry: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
  },

  dropdownList: {
    marginLeft: 0,
    marginRight: 10,
    padding: 0,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
   fontSize:14,
   color:'#000',
  },






  selectedTextGender: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
  },


});

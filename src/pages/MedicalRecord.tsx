import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Card, Searchbar , TextInput, Icon, Text, Banner,  Modal, Portal, } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {MainStackParamList} from '../../App';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const local_data = [
  {
    value: '1',
    lable: 'location',
  },
  {
    value: '2',
    lable: 'location2',
  },
];

const MedicalRecord: React.FC = () => {

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');

  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };


  return (
<View style={styles.mainContainer}>
<ScrollView contentContainerStyle={styles.scrollContent}>
<Header showLocation title={undefined} />
<View style={styles.container}>

<View style={styles.searchLocationWrapp}>
            <View style={styles.searchLocationBlock}>
              <View style={styles.searchBlock}>
                <TextInput
                  mode="flat"
                  style={[styles.searchFormInput, {color: 'white'}]}
                  placeholder=" Speciality  "
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#fff"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      background: 'transparent',
                    },
                  }}
                />
                <Image
                  source={require('../../assets/images/search-icon.png')}
                  style={styles.formInputIcon}
                />
              </View>

              <View style={styles.searchBlock}>
                <Dropdown
                  style={styles.dropdownSelect}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={country}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  placeholder="Select Location"
                  containerStyle={styles.dropdownList}
                  activeColor="#fff"
                  onChange={e => setCountry(e.value)}
                />
                <Image
                  source={require('../../assets/images/map-icon.png')}
                  style={styles.formInputIcon}
                />
              </View>
            </View>
</View>

   <View style={styles.titleFlex}>
   <Image source={require('../../assets/images/view-report.png')}
    style={styles.titleIcon} />
    <Text style={styles.title}>Medical Records</Text>
   </View>

   <View style={styles.medicalRecordWrapp}>
    <View style={styles.medicalRecordItem}>
      <Text>Medical Record 1</Text>
    </View>
   </View>

</View> 
</ScrollView>
<Footer />
</View>
   

  );
}

export default MedicalRecord

const styles = StyleSheet.create({
   
  mainContainer:{
    backgroundColor:'#fff',
    flex: 1,

},

scrollContent: {
    padding:0,
    paddingBottom: 100, 
  },

container:{
    flex:1,
    paddingBottom:10,
    paddingTop:0,
    paddingHorizontal:10,
  },

  // imgTextGroup
 
  searchLocationWrapp: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 20,
  },

  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBlock: {
    height: 44,
    backgroundColor: '#4CC2BF',
    borderRadius: 100,
    paddingRight: 10,
    marginTop: 0,
    fontSize: 15,
    fontWeight: 400,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',
  },

  searchFormInput: {
    height: 44,
    borderWidth: 0,
    borderRadius: 100,
    paddingRight: 20,
    paddingLeft: 15,
    marginTop: 0,
    fontSize: 13,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNovaA-Regular',
    width: Dimensions.get('window').width * 0.43,
  },

  formInputIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 14,
    left: 10,
    tintColor: '#fff',
  },
// ---

dropdownSelect: {
  height: 30,
  paddingHorizontal: 10,
  paddingLeft: 30,
  marginTop: 5,
  color: '#fff',
  width: Dimensions.get('window').width * 0.43,
},

placeholderCountry: {
  fontFamily: 'ProximaNovaA-Regular',
  fontSize: 13,
  color: '#fff',
},
selectedTextContry: {
  fontSize: 13,
  color: '#fff',
},

dropdownList: {
  fontFamily: 'ProximaNovaA-Regular',
  fontSize: 13,
  marginLeft: 0,
  marginRight: 5,
  padding: 0,
  textAlign: 'left',
},
//---
titleFlex: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
  justifyContent: 'center',
  alignSelf: 'center',
  width: '100%',
},
titleIcon: {
  width: 25,
  height: 25,
  marginRight: 10,
},
title: {
  fontSize: 18,
  fontFamily: 'ProximaNovaA-Bold',
  color: '#000',
  fontWeight: 'bold',
},

    //---

    medicalRecordWrapp: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    medicalRecordItem: {
      width: '48%',
      height: 100,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      marginBottom: 10,
    },
})    
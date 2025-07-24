import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Card, Searchbar , TextInput, Icon,  Banner,Text,  Modal, Portal, } from 'react-native-paper';
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
<Header showLocation title={undefined} />
<ScrollView contentContainerStyle={styles.scrollContent}>

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


   <View style={styles.selectUserBlock}>
      <Image source={require('../../assets/images/booked-for-icon.png')}
      style={styles.iconSelectUser} />

              <View style={styles.selectUser}>
  <Text style={styles.textselectUser}>Record of </Text>
                <Dropdown
                  style={styles.userDopdownSelect}
                  selectedTextStyle={styles.userSelectedText}
                  placeholderStyle={styles.userPlaceholder}
                  maxHeight={200}
                  value={country}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  placeholder="Select Location"
                  containerStyle={styles.userDropdownList}
                  activeColor="#E5F9F8"
                  onChange={e => setCountry(e.value)}
                />

              </View>

    </View>
 
<View style={[styles.dateFlex, {marginTop:10}]}>
<Text style={[styles.formLabel, {marginRight:10}]}>From</Text>
  <TextInput style={styles.formInput} />
  <Text style={[styles.formLabel, {marginLeft:10, marginRight:10}]}>To</Text>
  <TextInput style={styles.formInput} />
</View>

   <View style={{marginTop:20, }}>

      <Card.Content style={[styles.cardList, { elevation: 0, }]}>
      <Text style={{fontSize:14, fontFamily:'ProximaNovaA-Semibold', color:'#000', marginBottom:2}}>Dr. Ramesh Konanki</Text>
      <Text style={{fontSize:12, fontFamily:'ProximaNovaA-Semibold', color:'#000', marginBottom:5}}>Pediatric Neurologist</Text>

            <View style={styles.row}>
              <View style={styles.leftCardCont}>
                    <Text style={{fontSize:13, fontFamily:'ProximaNovaA-Regular', color:'#000',}}>15 July 2025</Text>
              </View>
              <View style={styles.rightCardCont}>           
                 <TouchableOpacity style={styles.textBtnBorder}><Text style={styles.textBtn}>View Report</Text></TouchableOpacity>
                 <TouchableOpacity><Text style={styles.textBtn}>Download</Text></TouchableOpacity>
              </View>
            </View>
      </Card.Content>

      <Card.Content style={[styles.cardList, { elevation: 0, }]}>
      <Text style={{fontSize:14, fontFamily:'ProximaNovaA-Semibold', color:'#000', marginBottom:2}}>Dr. Ramesh Konanki</Text>
      <Text style={{fontSize:12, fontFamily:'ProximaNovaA-Semibold', color:'#000', marginBottom:5}}>Pediatric Neurologist</Text>

            <View style={styles.row}>
              <View style={styles.leftCardCont}>
                    <Text style={{fontSize:13, fontFamily:'ProximaNovaA-Regular', color:'#000',}}>15 July 2025</Text>
              </View>
              <View style={styles.rightCardCont}>           
                 <TouchableOpacity style={styles.textBtnBorder}><Text style={styles.textBtn}>View Report</Text></TouchableOpacity>
                 <TouchableOpacity><Text style={styles.textBtn}>Download</Text></TouchableOpacity>
              </View>
            </View>
      </Card.Content>



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
  marginTop: 30,
  justifyContent: 'center',
  alignSelf: 'center',
  width: '100%',
  marginBottom: 30,
},
titleIcon: {
  width: 40,
  height:40,
  marginRight: 10,
},
title: {
  fontSize:22,
  fontFamily: 'ProximaNovaA-Semibold',
  color: '#000',

},

    //---

selectUserBlock:{ flexDirection: 'row',},
iconSelectUser:{
  width: 35,
  height:35,
  marginRight: 10,},

  selectUser:{

  },
  textselectUser:{
    fontFamily: 'ProximaNovaA-Regular',
    fontSize:14,
    marginBottom:5,
    
  },

userDopdownSelect:{
backgroundColor:'#B7E1E0',
paddingHorizontal:15,
paddingVertical:7,
width:200,
borderRadius:2,
  } ,

  userPlaceholder: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
  
  },
  userSelectedText: {
    fontSize: 13,
  
  },

  userDropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'left',
  },


  //---
  dateFlex:{
    flexDirection:'row',
    alignItems:'center',

  },
  formLabel:{
    fontSize:12,
    fontFamily:'ProximaNovaA-Regular',
    color:'#000',
    marginBottom:5,
  },

  formInput:{
    height:40,
    width:120, 
    borderWidth:0,
    borderColor:'transparent',
    borderRadius:2,   
    backgroundColor:'#C7E8E7',
  },

//---
  cardList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical:12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3D4',

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },

  leftCardCont:{},
  rightCardCont:{
    flexDirection: 'row',
  },

  textBtn:{
    fontFamily:'ProximaNovaA-Regular',
    fontSize:11,
    color:'#000',
    
  },
  textBtnBorder:{
    borderRightWidth:1,
    borderColor:'#000',
    paddingRight:6,
    marginRight:6,
  }

})    
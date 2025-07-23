import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Card, Searchbar , TextInput, Icon, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';



const AppointmentConfirmed: React.FC = () => {
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('1');
  return (
    <View style={styles.mainContainer}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <Text style={styles.acTitle}>Appointment Confirmed</Text>
      <Text style={styles.acSubTitle}>Thank you for booking your appointment. W e appreciate your trust and look forward to serving you.</Text>
    
  <View style={styles.imgTextGroup}>
      <View style={styles.imgTextBox}>
        <View style={styles.textbeforeDot}>
            <View style={styles.beforeDot} />
                <Text style={styles.imgTextTitle}>To support you on your health journey, we invite you to explore our Health Library for Mothers and Children.</Text>
            </View>
        </View>
  </View>

  <View>
    <TouchableOpacity style={styles.subscribeBlock}>         
        <Image source={require('../../assets/images/subscribe.png')} style={styles.subscribeImg} />
    </TouchableOpacity>
  </View>
  


     


</View> 
</ScrollView>
</View>
   

  );
}

export default AppointmentConfirmed

const styles = StyleSheet.create({
   
  mainContainer:{
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
  
imgTextGroup:{ 
  paddingHorizontal:10,  
  position:'relative',
  zIndex:1,
  
 },

imgTextBox:{
 width:'99%',
 marginTop:5,
 paddingTop:15,
 paddingBottom:40,
 paddingLeft:20,
 paddingRight:25,
 backgroundColor:'#3C2871',
 borderRadius:30,

 },
 textbeforeDot:{position:'relative'},
 imgTextTitle:{
   fontSize:12,
   lineHeight:18,
   fontWeight:'normal',
   color:'#fff',
   textAlign:'center', 
 },

 beforeDot: {
   position:'absolute',
   top:'27%',   
   right:-38,
   width: 30,
   height:30,
   backgroundColor: '#00B3AE',
   borderRadius: 50,
   borderWidth:7,
   borderColor:'#fff',
 },

 subscribeBlock:{
  width:250,
  display:'flex',
  justifyContent:'space-evenly',
  alignItems:'center',
  backgroundColor:'#fff',
  borderRadius:10,
  marginTop:-20,
  position:'relative',
  zIndex:1,
padding:10,
paddingBottom:0,
margin:'auto',

 },
 subscribeImg:{
  backgroundColor:'transparent',
  width:'100%',
  height:85,
  resizeMode:'contain',




 },

 acTitle:{
  fontSize:20,
  fontWeight:'bold',
  color:'#000',
 },
 acSubTitle:{
  fontSize:16,
  color:'#000',
 },
})
import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Card, Searchbar , TextInput, Icon, Text, Banner,  Modal, Portal, } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banners from '../components/Slider';



const Home: React.FC = () => {

  return (
<View style={styles.mainContainer}>
<ScrollView contentContainerStyle={styles.scrollContent}>
<Header showLocation title={undefined} />
<View style={styles.container}>

      <Text style={styles.acTitle}>Home</Text>
   
    
</View> 
</ScrollView>
<Footer />
</View>
   

  );
}

export default Home

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
  textAlign:'center',
  marginTop:'10%',
  marginBottom:'10%',
 },
 acSubTitle:{
  fontSize:13,
  color:'#000',
  textAlign:'center',
  marginTop:0,
  marginBottom:'10%',
  width:'80%',
  margin:'auto',
 },

 sliderBlock:{
  marginTop:'10%',
 },
 modalImageWrapp:{
  width:'90%',
  padding:10,
  backgroundColor: '#00B3AE',
  marginHorizontal: 0,
  borderRadius: 20,
  position: 'absolute',
  left: '5%',
  right: '5%',


 },

 modalImage:{
  resizeMode:'contain',
  width:'100%',
  height:Dimensions.get('window').height * 0.63,
 },

 closeModal:{
  position:'absolute',
  top:20,
  right:20,
  zIndex:1,
  backgroundColor:'#fff',
  borderRadius:50,
  padding:5,
 },
 closeModalIcon:{
  width:17,
  height:17,
  resizeMode:'contain',
 },


})    
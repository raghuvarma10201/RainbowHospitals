import { Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Text,  } from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';




const Home: React.FC = () => {

  return (
<View style={styles.mainContainer}>
<ScrollView contentContainerStyle={styles.scrollContent}>
<Header showLocation title={undefined} />
<View style={styles.container}>
    <View style={styles.homeBlock}>
      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>My Appointments</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>My Medical Record</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>


      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>My Family</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>My Pregnancy Journey</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>My Baby Journey </Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Calculator </Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Mom & Baby Products </Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Notification </Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Terms & Conditions</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Help</Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
             <Image source={require('../../assets/images/call-icon.png')} style={styles.homeBlockIcon} />
            </View>
          <Text style={styles.homeBlockTitle}>Logout </Text>
        </View>
          <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
      </TouchableOpacity>
    

    </View> 
    
   
    
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

  //--
  homeBlock:{
    backgroundColor:'#BFE2E0',
    padding:20,
    marginBottom:10,
    borderRadius:30,
    
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'#fff',
  paddingVertical:15,
   
    paddingHorizontal:10,

  },
  leftHomeBlock:{
    flexDirection:'row',
    alignItems:'center',
  },

  iconLeft:{
    backgroundColor:'#00B3AE',  
    borderRadius:50,
    width:35,
    height:35,
    marginRight:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  
 
  },
  homeBlockIcon:{
    width:18,
    height:18,
  

  },
  homeBlockTitle:{
    fontSize:14,
    fontWeight:'bold',
  },
  rightArrow:{
    width:20,
    height:20,
    resizeMode:'contain',
  },
})    
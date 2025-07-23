import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground,ScrollView,} from 'react-native';
import {  Text,} from 'react-native-paper';

const Splash: React.FC = () => {

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ImageBackground source={require('../../assets/images/loginbottom-img.png')} style={styles.loginBottomImg} />
      <ScrollView style={styles.container}>   

        {/* Main form */}
        <View style={styles.innerContainer}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={styles.logoImage} />
            <View style={styles.splashText}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.title}>Selfcare Mobile App</Text>
            </View>
        </View>

      </ScrollView>

    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginTop: 30,
    paddingHorizontal:20,
  },

  logoImage: {
    marginHorizontal: 'auto',
    marginTop:'10%',
    width: 280,
    height: 70,
    justifyContent: 'space-between',

  },

  innerContainer: {
    position: 'relative',
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:20,
    paddingBottom: 20,
  },

  splashText:{
    marginTop:'40%',
  },

  title: {
    fontSize:20,
    textAlign: 'left',
    marginTop: 0,
    marginBottom:0,
    color: '#fff',
    paddingLeft: 10,
    fontFamily:'Poppins-Bold',
  },

  loginBottomImg: {
    position: 'absolute',
    width: '100%',
    height: 170,
    bottom: 0,
    resizeMode: 'cover',

  },






});

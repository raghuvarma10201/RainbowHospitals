import React, {useCallback, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,

  ScrollView,
} from 'react-native';import {Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const images = {
    childCare: require('../../../assets/images/birth-icon.png'),
    // womenCare: require('../../../assets/images/women-care-icon.png'),
    // fertility: require('../../../assets/images/fertility-icon.png'),
    arrowRightLight: require('../../../assets/images/arrow-right-light-icon.png'),

  };

// ---------- OTHER IMPORTS ----------

import {h, pallette, w} from '../../constants/constants';
import {MainStackParamList} from '../../types/navigation';
import {adjust} from '../../utils/common-functions';


// ---------- COMPONENT ----------
const Category: React.FC = () => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.headingLightText}>Hello,</Text>
                <Text style={styles.headingText}>Amberwati</Text>  
                <Text style={styles.headingLightText}>How can we</Text>
                <Text style={styles.headingLightText}>help you today?</Text>
                <Text style={styles.tagline}>Please choose your primary care need.</Text>
            </View>

            <View style={styles.categoryBtContainer}>
                <TouchableOpacity style={styles.categoryButton}>
                    <View style={styles.imageCategoryView}>
                        <Image source={images.childCare} style={styles.imageCategoryImage} />
                    </View>
                    <Text style={styles.categoryText}>Child Care</Text>
                    <Image source={images.arrowRightLight} style={styles.arrowRightLight} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryButton}>
                <View style={styles.imageCategoryView}>
                        <Image source={images.childCare} style={styles.imageCategoryImage} />
                    </View>
                    <Text style={styles.categoryText}>Women Care</Text>
                    <Image source={images.arrowRightLight} style={styles.arrowRightLight} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryButton}>
                     <View style={styles.imageCategoryView}>
                        <Image source={images.childCare} style={styles.imageCategoryImage} />                        
                    </View>
                    <Text style={styles.categoryText}>Fertility</Text>
                    <Image source={images.arrowRightLight} style={styles.arrowRightLight} />
                </TouchableOpacity>
            </View>


        </View>
      </ScrollView>
    </View>
  );
};

export default Category;


// ---------- STYLES ----------
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: pallette.white,
        flex: 1,
      },
  
      container: {
       flexDirection: 'column',
        paddingHorizontal: w * 0.20,
        paddingVertical: h * 0.14,
        justifyContent: 'center',
        alignItems: 'center',
      },

      headingContainer:{marginBottom: h * 0.03},
      headingText: {
        fontSize: adjust(30),
        color: pallette.rainbow,
        fontFamily: 'ProximaNovaA-Bold',
        lineHeight: h * 0.04,
      },
    
      headingLightText: {
        fontSize: adjust(28),
        color: pallette.rainbow,
        fontFamily: 'ProximaNova-Regular',
        lineHeight: h * 0.04,
      },

      tagline:{
        fontSize: adjust(16),
        marginTop: h * 0.01,
      },

      categoryBtContainer:{
        flexDirection: 'column',
        justifyContent: 'flex-start',     
        width: '100%',
        paddingLeft: w * 0.03,        
      },
  

      categoryButton:{
        borderWidth:1.3,
        borderColor: pallette.light_rainbow,
        backgroundColor:'#E1F1F2',
        borderRadius:30,
        borderBottomRightRadius:0,
      
      
        marginTop: h * 0.01,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: h * 0.02,
        width: '85%',
        position:'relative',
      },

      categoryText:{
        fontSize: adjust(19),
        fontFamily: 'ProximaNovaA-Bold',
        color: pallette.rainbow,    
        paddingVertical:h * 0.03,  
        paddingHorizontal: w * 0.05, 
      },

      categoryImage:{
        width: w * 0.05,
        backgroundColor: 'red',
        height: h * 0.05,
        borderRadius: 10,
        marginBottom: h * 0.01,
        },

imageCategoryView:{
    position:'absolute',
    top:h * 0.021,
    bottom: 0,
    left: -15,
    right: 0,
   backgroundColor:pallette.light_rainbow,
    width: 32,
    height: 32,
    borderRadius: 100,  
    alignItems: 'center',
    justifyContent: 'center',
},
imageCategoryImage:{
    width: w * 0.08,
    height: h * 0.08,
    resizeMode: 'contain',
},

arrowRightLight:{
    width: w * 0.03,
    height: h * 0.03,
    resizeMode: 'contain',
    position:'absolute',
    right: w * 0.03,
    bottom: h * 0,
},
    
});

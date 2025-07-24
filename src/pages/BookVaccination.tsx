import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Text, Banner,  Modal, Portal, } from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';

const BookVaccination: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const navigateTo = (path: keyof MainStackParamList) => {
    navigation.navigate(path);
};

  return (
  <View style={styles.mainContainer}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <Header showLocation title={undefined} />
    <View style={styles.container}>
  
<View>
<Image source={require('../../assets/images/vaccine-img.jpg')} style={styles.vaccinationImg} />
</View>
  
<View style={styles.vaccinationActions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('VaccinesAdult')}>
              <View style={styles.activeActionItemIcon}>
                <Image
                  source={require('../../assets/images/adult-vaccination-icon.png')}
                  style={styles.iconAction}
                />
              </View>
              <Text style={styles.actionText}> Adult Vaccination</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('VaccinesPediatric')}>
              <View style={styles.actionItemIcon}>
                <Image
                  source={require('../../assets/images/pediatric-vaccination-icon.png')}
                  style={styles.iconAction}
                />
              </View>
              <Text style={styles.actionText}>Pediatric Vaccination</Text>
            </TouchableOpacity>
</View>

</View> 
</ScrollView>
<Footer />
</View>
   

  );
}

export default BookVaccination

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
  
    paddingTop:0,
   
  },

 
  vaccinationImg:{
    width:'100%',
    height:Dimensions.get('window').height * 0.6,
    resizeMode:'cover',
  
    marginLeft:'auto',
    marginRight:'auto',
  },




  vaccinationActions:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -40,
    alignSelf: 'center',
  },

  
  actionItem: {
    alignItems: 'center',
    width: 100,
    marginBottom: 5,
    marginHorizontal:'5%',
  },

  actionItemIcon: {
    backgroundColor: '#939598',
    borderRadius:20,
    padding:10,   
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    borderWidth:4,
    borderColor:'#fff',
  },

  activeActionItemIcon: {
    backgroundColor: '#3C2871',
    borderRadius:20,
    padding:10,   
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    borderWidth:4,
    borderColor:'#fff',
  },

  iconAction: {
    width:80,
    height:80,
    resizeMode:'contain',
  },

  actionText: {
    fontSize:13,
    textAlign: 'center',
    marginTop: 4,
    fontFamily:'ProximaNovaA-Regular',
    color:'#000',
    width:'100%',
    paddingVertical:5,
  },

})    
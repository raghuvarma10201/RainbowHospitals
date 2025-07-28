import {Dimensions,  Image,  ScrollView,  StyleSheet,  View,} from 'react-native';
import React, {useEffect, useState} from 'react';
import {  Text,} from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyAppointmentDetails: React.FC = () => {
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  return (
<View style={styles.mainContainer}>
<Header showLocation title={undefined} />
<ScrollView contentContainerStyle={styles.scrollContent}>     
<View style={styles.container}>   
  
    <View style={styles.doctorDetailsContainer}>
          <View style={styles.doctorImgContainer}>
            <Image
              source={require('../../assets/images/doc-img.png')}
              style={styles.docImg}
            />
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={[styles.docName, {fontSize: 16, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Semibold'}]}>
            Dr. Ramesh Konanki
            </Text>
            <Text style={[styles.docName, {fontSize: 12, marginTop: 3,}]}>
            Senior Consultant -  Pediatric Neurologist
            </Text>
           
         

            <View style={styles.location}>             
                <Image source={require('../../assets/images/map-icon.png')} style={{width:15, height:15}} />
                <Text style={styles.locationText}>Road No. 2, Banjara Hills, Hyderabad </Text>              
            </View>

          </View>
    </View>

    <View style={styles.patientInfo}>
    <Text style={styles.patientInfoHeaderText}>Patient Info</Text>
    {/* <View style={styles.patientInfoItem}>
      <Text style={styles.patientInfoItemValue}>John Doe</Text>
    </View> */}
     
    </View>



</View>
</ScrollView>
<Footer />
</View>
   

  );
}

export default MyAppointmentDetails

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 100,
  },

  container: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 0,
  },

//---
doctorDetailsContainer: {
  backgroundColor: '#3C2871',

  paddingHorizontal: 15,
  alignSelf: 'center',
  marginTop: h * 0.12,
  borderTopLeftRadius: w * 0.1,
  borderTopRightRadius: w * 0.1,
  width:'90%',
},
doctorImgContainer: {
width:100,
height:100,
  backgroundColor: '#fff', 
  borderRadius: h * 0.1,
  marginHorizontal:'auto',
  borderWidth: 0.3,
  borderColor: 'grey',
  padding: 5,
  marginTop:-50,
  position:'relative',
  marginBottom:10,

},
docImg: {
width:100,
height:100,
  borderRadius: h * 0.1,
  resizeMode: 'cover',
},
dotContainer: {
width:20,
height:20,
  borderRadius:100,
  backgroundColor: '#fff',
  position: 'absolute',
  right:0,
  bottom:0,
  justifyContent: 'center',
  alignItems: 'center',
},
dot: {
  height:13,
  width: 13,
  borderRadius: 100,
  backgroundColor: '#4CC2BF',
},
doctorDetails: {
  padding: 8,
  backgroundColor: '#3C2871',
  width: '100%',
},
docName: {
  fontSize: 20,
  color: '#fff',
  fontFamily: 'ProximaNovaA-Regular',
  textAlign:'center',
},
//--
patientInfo: {
  backgroundColor: '#F5F5FF',
  paddingHorizontal: 15,
  paddingVertical:10,
  marginHorizontal: 10,
  width:'90%',
  alignSelf:'center',
},


  patientInfoHeaderText:{
    fontSize:16,
    marginTop:10,
    fontFamily:'ProximaNovaA-Bold',
    color:'#3C2871',
    textAlign:'left',
  },

  location:{
    flexDirection:'row',
    alignItems:'flex-start',
    gap:5, 
    justifyContent:'center',
    marginTop:13,
    marginBottom:10,
  },
  locationText:{
    fontSize:13,
    fontFamily:'ProximaNovaA-Regular',
    color:'#fff',
    textAlign:'left',
  }

}); 
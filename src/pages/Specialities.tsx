import { Dimensions, Image, ScrollView, StyleSheet,TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react';
import {Card, Searchbar , TextInput, Icon, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

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

const Specialities: React.FC = () => {
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('1');
  return (
    <View style={styles.mainContainer}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      
    <View style={styles.header}>
        <View style={{ flexDirection:'row', alignItems:'center',}}>
            <View style={styles.profileIconBlock}>
          
            <Image source={require('../../assets/images/profile-icon.png')} style={{width:30, height:30,}} resizeMode="contain" />
            </View>
                <View style={{marginLeft:6}}>
                    <Text style={{fontSize:14,color:'#fff', fontFamily:'ProximaNovaA-Regular',}}> Amberwati</Text>
                       <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center', }}>
                        <Image source={require('../../assets/images/map-icon.png')} style={{width:12,height:12,marginRight:3,  marginTop:0, }} />
                        <Text style={{fontSize:11,color:'#fff',fontWeight:'normal', marginTop:-2, fontFamily:'ProximaNovaA-Regular'}}>
                        Hyderabad</Text>
                    </View>
                </View>
        </View> 
        <View style={styles.headerRight}>
            <Image source={require('../../assets/images/services-icon.png')} style={{width:30,height:30,marginRight:10,}} resizeMode="contain" />
            <Image source={require('../../assets/images/wallet-icon.png')} style={{width:30,height:30,marginRight:10,}} resizeMode="contain" />
            <Image source={require('../../assets/images/filter-icon.png')} style={{width:30,height:30,}} resizeMode="contain" />
        </View>
    </View>

    <View style={styles.container}>

                <View style={styles.helloCard}>
                    <View style={styles.searchLocationBlock}>
                        <View style={styles.searchBlock}>
                            <TextInput
                             mode="flat"
                                style={[styles.searchFormInput, { color: 'white',}]}
                                placeholder='search'
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor='#fff'                                                                            
                              underlineColor="transparent" 
                            activeUnderlineColor="transparent"
                            theme={{ colors: { text: 'white', placeholder: 'white', background: 'transparent' } }}
                            />
                            <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
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
                            <Image source={require('../../assets/images/map-icon.png')} style={styles.formInputIcon} />
                        </View>
                    </View>
                </View>

     

  


        <View style={styles.quickActions}>
            <View style={styles.actionItem}>
              <View style={styles.actionItemIcon}>
                <Image source={require('../../assets/images/neonatal-intensive-care-unit-icon.png')} style={styles.iconAction} />
              </View>
                <Text style={styles.actionText}> Neonatal Intensive Care Unit</Text>
            </View>

            <View style={styles.actionItem}>
              <View style={styles.actionItemIcon}>
                <Image source={require('../../assets/images/neonatal-intensive-care-unit-icon.png')} style={styles.iconAction} />
              </View>
                <Text style={styles.actionText}>Pediatric Intensive Care Unit</Text>
            </View>

            <View style={styles.actionItem}>
              <View style={styles.actionItemIcon}>
                <Image source={require('../../assets/images/neonatal-intensive-care-unit-icon.png')} style={styles.iconAction} />
              </View>
                <Text style={styles.actionText}> Pediatric Cardiology & Cardiothoracic Surgery</Text>
            </View>

            <View style={styles.actionItem}>
              <View style={styles.actionItemIcon}>
                <Image source={require('../../assets/images/neonatal-intensive-care-unit-icon.png')} style={styles.iconAction} />
              </View>
                <Text style={styles.actionText}> Pediatric Gastroenterology </Text>
            </View>

          

          
        </View>


    </View>
    

    </ScrollView>

    <View style={styles.footer}>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.footerButton}>        
          <Image source={require('../../assets/images/footer-home-icon.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>         
        <Image source={require('../../assets/images/footer-calendar-icon.png')} style={styles.activeFooterButtonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>      
        <Image source={require('../../assets/images/footer-call-icon.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>      
        <Image source={require('../../assets/images/footer-reports-icon.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>
      </View>
    </View>
</View>
   

  );
}

export default Specialities

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

      //Header
      header:{
        backgroundColor:'#3C2871',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:10,
      },


      profileIconBlock:{
        width:40,
        height:40,
        backgroundColor:'#fff',
        borderRadius:100,
        borderWidth:3,
        borderColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
      
      }, 
  
      headerText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'bold',
      },
  
      headerRight:{
        flexDirection:'row',
        alignItems:'center',
      },
    //Header End


    helloCard:{
        backgroundColor:'#ffffff',
        borderRadius:10,
        paddingVertical:0,
     paddingHorizontal:0,
   marginTop:20,
       
    },

    searchLocationBlock:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    searchBlock: {
        height: 44,
        backgroundColor:'#4CC2BF',
        borderRadius: 100,   
        paddingRight: 10,
        marginTop: 0,
        fontSize: 15,
        fontWeight: 400,
        color: '#fff',
        fontFamily:'ProximaNovaA-Regular',

    },

    searchFormInput: {
        height: 44,
        borderWidth:0,
        borderRadius: 100,
        paddingRight: 20,
        paddingLeft: 15,
        marginTop: 0,
        fontSize: 13,
        fontWeight: 400,
        color: '#fff',
        backgroundColor:'transparent',
        fontFamily:'ProximaNovaA-Regular',
        width:Dimensions.get('window').width * 0.43,

    },

    formInputIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 14,
        left:10,
        tintColor:'#fff',
      },

      //
      
  dropdownSelect:{
    height:30,
    paddingHorizontal: 10,
    paddingLeft:30,
    marginTop: 5,
    color:'#fff',
    width:Dimensions.get('window').width * 0.43,
   
  },

  placeholderCountry: {
    fontFamily:'ProximaNovaA-Regular',
    fontSize: 13,
    color:'#fff',
  },
  selectedTextContry: {
    fontSize: 13,
    color:'#fff',
     
  },

  dropdownList: {
    fontFamily:'ProximaNovaA-Regular',
    fontSize:13,
    marginLeft: 0,
    marginRight: 5,    
    padding:0,
    textAlign:'left',
  },

  textHelloCard:{
    marginTop:15,
    paddingHorizontal:20,
  },




  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop:30,
  
  },

  actionItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom:5,

  },
  actionItemIcon:{
    backgroundColor:'#3C2871',
    borderRadius:10,
    padding:15,
    paddingTop:15,
    justifyContent:'center',
    alignItems:'center',
    marginVertical: 0,
  },




  iconAction:{
    width:35,
    height:35,
  },


  actionText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  activeActionItem: {
    backgroundColor:'#3C2871',
    borderRadius:10,
    padding:10,
    paddingTop:15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },

  activeActionText:{
    color:'#fff',
    fontSize:11,
    textAlign:'center',
    marginTop:4,
  },
  activeIconAction:{
    width:40,
    height:40,
    tintColor:'#fff',
  },

//   footer
footer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,

  flexDirection: 'row',
  justifyContent: 'space-around',



},

footerButtonContainer:{
  paddingVertical: 10,
  backgroundColor: '#00B3AE',
  flexDirection:'row',
  justifyContent:'space-around',
  alignItems:'center',
  width:'78%',
  paddingHorizontal:10,
  borderTopLeftRadius:10,
  borderTopRightRadius:10,
},

footerButton: {
  alignItems: 'center',
},

footerButtonIcon:{
  width:28,
  height:28,
  tintColor:'#fff',
},

activeFooterButtonIcon:{
  alignItems: 'center',
  width:28,
  height:28,
},

})
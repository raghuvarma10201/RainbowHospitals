import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Searchbar, TextInput, Icon, Text } from 'react-native-paper';
import { MainStackParamList, useAuth } from '../../App';
import { Dropdown } from 'react-native-element-dropdown';
import { useApp } from '../context/AppContext';
import { Dimensions, View, Image, StyleSheet } from 'react-native';

interface FooterProps {
    locations?: string;
}
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
const GlobalSearch: React.FC<FooterProps> = ({ locations }) => {
    type AppNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;
    const navigation = useNavigation<AppNavigationProp>();
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('1');
    const [loading, setLoading] = useState(false);
    const { branch } = useApp();
    const { setLoggedIn } = useAuth();

    const w = Dimensions.get('window').width;
    const h = Dimensions.get('window').height;

    return (
        <View style={styles.helloCard}>
            <View style={styles.searchLocationBlock}>
              <View style={styles.searchBlock}>
                <TextInput
                  mode="flat"
                  style={[styles.searchFormInput, { color: 'white' }]}
                  placeholder="search"
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
    );
};

const styles = StyleSheet.create({
    
      helloCard: {
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
      
        textHelloCard: {
          marginTop: 15,
          paddingHorizontal: 20,
        },
      
});

export default GlobalSearch;

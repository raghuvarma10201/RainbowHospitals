import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';

import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';
import {useAuth} from '../context/AuthContext';
import {pallette} from '../Constants/Constant';

const Home: React.FC = () => {
  type CombinedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<MainStackParamList>
  >;
  const navigation = useNavigation<CombinedNavigationProp>();

  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };
  const {setLoggedIn} = useAuth();

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'tokenExpiry',
    ]);
    setLoggedIn(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.homeBlock}>
            <View style={styles.hProw}>
              <View style={styles.leftHProfile}>
                <View style={styles.iconHPLeft}>
                  <Image
                    source={require('../../assets/images/profile-icon.png')}
                    style={styles.homeHpIcon}
                  />
                </View>
                <View>
                  <Text style={styles.homeHpTitle}>Amberwati</Text>
                  <Text style={styles.homeHpsubTitle}> UID-MBDTMP17052</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('MyAppointments')}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-appointments.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>My Appointments</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-medical-record.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>My Medical Record</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-family.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>My Family</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-pregnancy.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>My Pregnancy Journey</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-baby.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>My Baby Journey </Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-calculator.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Calculator </Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-products.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Mom & Baby Products </Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-notification.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Notification </Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-terms.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Terms & Conditions</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-help.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Help</Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => logout()}>
              <View style={styles.leftHomeBlock}>
                <View style={styles.iconLeft}>
                  <Image
                    source={require('../../assets/images/home-logout.png')}
                    style={styles.homeBlockIcon}
                  />
                </View>
                <Text style={styles.homeBlockTitle}>Logout </Text>
              </View>
              <Image
                source={require('../../assets/images/right-arrow.png')}
                style={styles.rightArrow}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
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
    paddingHorizontal: 10,
  },

  //--
  homeBlock: {
    backgroundColor: '#BFE2E0',
    padding: 20,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
    paddingVertical: 10,

    paddingHorizontal: 10,
  },
  leftHomeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconLeft: {
    backgroundColor: pallette.app_green,
    borderRadius: 50,
    width: 30,
    height: 30,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBlockIcon: {
    width: 15,
    height: 15,
  },
  homeBlockTitle: {
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Semibold',
  },

  rightArrow: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  //--

  hProw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  leftHProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconHPLeft: {
    backgroundColor: pallette.white,
    borderRadius: 50,
    width: 50,
    height: 50,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeHpIcon: {
    width: 35,
    height: 35,
  },

  homeHpTitle: {
    fontSize: 16,
    fontFamily: 'ProximaNovaA-Bold',
    marginBottom: 2,
  },

  homeHpsubTitle: {
    fontSize: 12,
    fontFamily: 'ProximaNovaA-Regular',
  },
});

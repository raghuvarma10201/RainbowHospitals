import React from 'react';
import {Image, ScrollView, StyleSheet, View, Text} from 'react-native';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';
import {useAuth} from '../context/AuthContext';
import {pallette} from '../Constants/Constant';
import {useApp} from '../context/AppContext';
import {MenuItems} from '../components/HomeMenu';

const Home: React.FC = () => {
  type CombinedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList>,
    NativeStackNavigationProp<MainStackParamList>
  >;
  const navigation = useNavigation<CombinedNavigationProp>();
  const {setLoggedIn} = useAuth();
  const {profile} = useApp();

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
                  <Text style={styles.homeHpTitle}>{profile?.PatientName}</Text>
                  <Text style={styles.homeHpsubTitle}>
                    {profile?.PatientUID}
                  </Text>
                </View>
              </View>
            </View>
            <MenuItems navigation={navigation} logout={logout} />
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
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  homeBlock: {
    backgroundColor: '#BFE2E0',
    padding: 20,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 20,
  },
  hProw: {
    flexDirection: 'row',
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

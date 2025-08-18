import React, {useCallback} from 'react';
import {Image, ScrollView, StyleSheet, View, Text} from 'react-native';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';
import {useAuth} from '../context/AuthContext';
import {useApp} from '../context/AppContext';
import {MenuItems} from '../components/HomeMenu';
import {h, pallette, w} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

//
// ---------- Navigation Type ----------
// Combines AuthStack and MainStack for better typing with useNavigation
//
type CombinedNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

//
// ---------- Home Screen Component ----------
//
const Home: React.FC = () => {
  const navigation = useNavigation<CombinedNavigationProp>();
  const {setLoggedIn} = useAuth();
  const {profile} = useApp();

  // Logout handler: clears AsyncStorage tokens and redirects to Login
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'tokenExpiry',
      ]);
      setLoggedIn(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigation, setLoggedIn]);

  return (
    <View style={styles.mainContainer}>
      {/* App Header with location support */}
      <Header title={'menu'} showLocation />

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Profile + Menu block */}
          <View style={styles.homeBlock}>
            {/* Profile Row */}
            <View style={styles.hProw}>
              <View style={styles.leftHProfile}>
                {/* Profile Icon */}
                <View style={styles.iconHPLeft}>
                  <Image
                    source={require('../../assets/images/profile-icon.png')}
                    style={styles.homeHpIcon}
                  />
                </View>

                {/* Profile Info */}
                <View>
                  <Text style={styles.homeHpTitle}>{profile?.PatientName}</Text>
                  <Text style={styles.homeHpsubTitle}>
                    {profile?.PatientUID}
                  </Text>
                </View>
              </View>
            </View>

            {/* Dynamic Menu Items */}
            <MenuItems navigation={navigation} logout={logout} />
          </View>
        </View>
      </ScrollView>

      {/* App Footer */}
      <Footer />
    </View>
  );
};

export default Home;

//
// ---------- Styles ----------
//
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: pallette.white, // Sets background for whole screen
  },
  scrollContent: {
    paddingBottom: h * 0.07, // Ensures footer doesn’t overlap content
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  homeBlock: {
    marginVertical: h * 0.02,
    padding: 20,
    borderRadius: 30,
    backgroundColor: pallette.app_light_green, // Highlight block background
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
    width: w * 0.12,
    height: w * 0.12,
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: pallette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeHpIcon: {
    width: w * 0.09,
    height: w * 0.09,
  },
  homeHpTitle: {
    fontSize: adjust(14),
    marginBottom: 2,
    fontFamily: 'ProximaNovaA-Bold',
  },
  homeHpsubTitle: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
  },
});

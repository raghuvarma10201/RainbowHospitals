// ---------- MODULE IMPORTS ----------
import React, {useCallback, memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------- COMPONENT IMPORTS ----------
import {ProfileItem, MenuItems} from '.';
import {Header, Footer} from '../../components';

// ---------- OTHER IMPORTS ----------
import {CombinedNavigationProp} from '../../types/navigation';
import {useAuth} from '../../context/auth-context';
import {useApp} from '../../context/app-context';
import {h, pallette} from '../../constants/constants';
import {routes, ToastService} from '../../utils';

// ---------- COMPONENT ----------
const Home: React.FC = () => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation = useNavigation<CombinedNavigationProp>();
  const {setLoggedIn} = useAuth();
  const {profile} = useApp();

  // ---------- CALLBACK FUNCTIONS ----------
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'tokenExpiry',
      ]);
      // setLoggedIn(false);
      // navigation.navigate('Login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: routes.SetMpin}],
        }),
      );
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    }
  }, [navigation, setLoggedIn]);

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header title="menu" showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.homeBlock}>
            {/* PROFILE ITEM */}
            <ProfileItem
              name={profile?.PatientName}
              uid={profile?.PatientUID}
            />
            {/* OTHER MENU ITEMS */}
            <MenuItems
              navigation={navigation}
              logout={logout}
              uid={profile?.PatientUID}
            />
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default memo(Home);

// ---------- Styles ----------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: pallette.white,
  },
  scrollContent: {
    paddingBottom: h * 0.1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  homeBlock: {
    marginVertical: h * 0.02,
    padding: 20,
    borderRadius: 30,
    backgroundColor: pallette.pale_turquoise,
  },
});

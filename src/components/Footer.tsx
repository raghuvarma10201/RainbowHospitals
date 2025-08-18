import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {MainStackParamList} from '../navigation/types';
import {pallette} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

interface FooterProps {
  activeIcon?: string;
}

const Footer: React.FC<FooterProps> = ({activeIcon}) => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Dashboard'
  >;
  const navigation = useNavigation<AppNavigationProp>();

  const getIconStyle = (iconName: string) => {
    return activeIcon === iconName
      ? styles.activeFooterButtonIcon
      : styles.footerButtonIcon;
  };

  const getTintColor = (iconName: string) => {
    return activeIcon === iconName ? pallette.app_purple : pallette.white; // optional: adjust if active has a different color
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Dashboard')}>
          <Image
            source={require('../../assets/images/footer-home-icon.png')}
            style={[getIconStyle('home'), {tintColor: getTintColor('home')}]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() =>
            navigation.navigate('Specialities', {appointmentType: 'Physical'})
          }>
          <Image
            source={require('../../assets/images/footer-calendar-icon.png')}
            style={[
              getIconStyle('calendar'),
              {tintColor: getTintColor('calendar')},
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-call-icon.png')}
            style={[getIconStyle('call'), {tintColor: getTintColor('call')}]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-reports-icon.png')}
            style={[
              getIconStyle('reports'),
              {tintColor: getTintColor('reports')},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  actionItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 5,
  },
  actionItemIcon: {
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    padding: 15,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },

  iconAction: {
    width: 35,
    height: 35,
  },

  actionText: {
    fontSize: adjust(11),
    textAlign: 'center',
    marginTop: 4,
  },

  activeActionItem: {
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },

  activeActionText: {
    color: pallette.white,
    fontSize: adjust(11),
    textAlign: 'center',
    marginTop: 4,
  },
  activeIconAction: {
    width: 40,
    height: 40,
    tintColor: pallette.white,
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

  footerButtonContainer: {
    paddingVertical: 10,
    backgroundColor: pallette.app_green,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '78%',
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  footerButton: {
    alignItems: 'center',
  },

  footerButtonIcon: {
    width: 28,
    height: 28,
    tintColor: pallette.white,
  },

  activeFooterButtonIcon: {
    alignItems: 'center',
    width: 28,
    height: 28,
  },
});

export default Footer;

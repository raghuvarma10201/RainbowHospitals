// ---------- MODULE IMPORTS ----------
import React, {FC} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// ---------- TYPE IMPORTS ----------
import {FooterButtonProps, FooterProps, NavProp} from '../types/components';
import {MainStackParamList} from '../types/navigation';

// ---------- VALUE IMPORTS ----------
import {h, pallette, w} from '../constants/constants';
import {navigateTo, routes} from '../utils';
import {useApp} from '../context/app-context';

// ---------- COMPONENT ----------
const Footer: FC<FooterProps> = ({activeIcon}) => {
  const navigation = useNavigation<NavProp>();
  const {profile} = useApp();

  const buttons: FooterButtonProps[] = [
    {
      icon: 'home',
      onPress: () =>
        navigateTo(navigation, routes.Dashboard as keyof MainStackParamList),
      source: require('../../assets/images/footer-home-icon.png'),
    },
    {
      icon: 'calendar',
      onPress: () =>
        navigateTo(
          navigation,
          routes.Specialities as keyof MainStackParamList,
          {appointmentType: 'Physical'},
        ),
      source: require('../../assets/images/footer-calendar-icon.png'),
    },
    {
      icon: 'call',
      source: require('../../assets/images/footer-call-icon.png'),
      onPress: () => Linking.openURL(`tel:${9090909090}`),
    },
    {
      icon: 'reports',
      source: require('../../assets/images/footer-reports-icon.png'),
      onPress: () =>
        navigateTo(navigation, 'Records', {mrn: profile?.PatientUID}),
    },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.footerButtonContainer}>
        {buttons.map(({icon, onPress, source}) => (
          <TouchableOpacity
            key={icon}
            style={styles.footerButton}
            onPress={onPress}>
            <Image
              source={source}
              style={{
                width: w * 0.08,
                height: w * 0.08,
                tintColor:
                  activeIcon === icon ? pallette.dark_purple : pallette.white,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButtonContainer: {
    paddingVertical: h * 0.012,
    backgroundColor: pallette.dark_purple,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '78%',
    paddingHorizontal: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default Footer;

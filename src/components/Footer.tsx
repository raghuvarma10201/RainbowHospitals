// ---------- MODULE IMPORTS ----------
import React, {FC} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// ---------- TYPE IMPORTS ----------
import {FooterButtonProps, FooterProps, NavProp} from './types';
import {MainStackParamList} from '../navigation/types';

// ---------- VALUE IMPORTS ----------
import {h, pallette} from '../constants/constants';
import {navigateTo, routes} from '../utils';

// ---------- COMPONENT ----------
const Footer: FC<FooterProps> = ({activeIcon}) => {
  const navigation = useNavigation<NavProp>();

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
    },
    {
      icon: 'reports',
      source: require('../../assets/images/footer-reports-icon.png'),
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
                width: 28,
                height: 28,
                tintColor:
                  activeIcon === icon ? pallette.app_purple : pallette.white,
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
    paddingVertical: 10,
    paddingBottom: h * 0.025,
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
});

export default Footer;

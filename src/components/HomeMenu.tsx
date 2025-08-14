import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import {navigateTo} from '../utils/commonFunctions';
import {pallette, w} from '../Constants/Constant';

interface HomeMenuItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

interface MenuItemsProps {
  navigation: any;
  logout: any;
}

const HomeMenuItem: React.FC<HomeMenuItemProps> = ({title, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.leftHomeBlock}>
        <View style={styles.iconLeft}>
          <Image source={icon} style={styles.homeBlockIcon} />
        </View>
        <Text style={styles.homeBlockTitle}>{title}</Text>
      </View>
      <Image
        source={require('../../assets/images/right-arrow.png')}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
  );
};

export const MenuItems: React.FC<MenuItemsProps> = ({navigation, logout}) => {
  const menuItems = [
    {
      title: 'My Appointments',
      icon: require('../../assets/images/home-appointments.png'),
      onPress: () => navigateTo(navigation, 'MyAppointments'),
    },
    {
      title: 'My Medical Record',
      icon: require('../../assets/images/home-medical-record.png'),
    },
    {
      title: 'My Family',
      icon: require('../../assets/images/home-family.png'),
    },
    {
      title: 'My Pregnancy Journey',
      icon: require('../../assets/images/home-pregnancy.png'),
    },
    {
      title: 'My Baby Journey',
      icon: require('../../assets/images/home-baby.png'),
    },
    {
      title: 'Calculator',
      icon: require('../../assets/images/home-calculator.png'),
    },
    {
      title: 'Mom & Baby Products',
      icon: require('../../assets/images/home-products.png'),
    },
    {
      title: 'Notification',
      icon: require('../../assets/images/home-notification.png'),
    },
    {
      title: 'Terms & Conditions',
      icon: require('../../assets/images/home-terms.png'),
    },
    {
      title: 'Help',
      icon: require('../../assets/images/home-help.png'),
    },
    {
      title: 'Logout',
      icon: require('../../assets/images/home-logout.png'),
      onPress: () => logout(),
    },
  ];
  return (
    <>
      {menuItems.map((item, index) => (
        <HomeMenuItem
          key={index}
          title={item.title}
          icon={item.icon}
          onPress={item.onPress}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
  },
  leftHomeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    backgroundColor: pallette.app_green,
    borderRadius: w * 0.1,
    width: w * 0.08,
    height: w * 0.08,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBlockIcon: {
    width: w * 0.04,
    height: w * 0.04,
  },
  homeBlockTitle: {
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  rightArrow: {
    width: w * 0.03,
    height: w * 0.03,
    resizeMode: 'contain',
  },
});

export default HomeMenuItem;

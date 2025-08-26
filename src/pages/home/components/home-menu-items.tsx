import React, {memo} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';

//
// ---------- Types ----------
//
interface HomeMenuItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

interface MenuItemsProps {
  navigation: any; // You can strongly type this with React Navigation if desired
  logout: () => void;
}

//
// ---------- Reusable Menu Item Component ----------
//
const HomeMenuItem: React.FC<HomeMenuItemProps> = memo(
  ({title, icon, onPress}) => {
    return (
      <TouchableOpacity style={styles.row} onPress={onPress}>
        {/* Left block with icon + title */}
        <View style={styles.leftHomeBlock}>
          <View style={styles.iconLeft}>
            <Image source={icon} style={styles.homeBlockIcon} />
          </View>
          <Text style={styles.homeBlockTitle}>{title}</Text>
        </View>

        {/* Right arrow indicator */}
        <Image
          source={require('../../../../assets/images/right-arrow.png')}
          style={styles.rightArrow}
        />
      </TouchableOpacity>
    );
  },
);

HomeMenuItem.displayName = 'HomeMenuItem';

//
// ---------- Menu List Component ----------
//
const MenuItems: React.FC<MenuItemsProps> = ({navigation, logout}) => {
  // Define all available menu items in one place
  const menuItems: HomeMenuItemProps[] = [
    {
      title: 'My Appointments',
      icon: require('../../../../assets/images/home-appointments.png'),
      onPress: () => navigateTo(navigation, 'MyAppointments'),
    },
    {
      title: 'My Medical Record',
      icon: require('../../../../assets/images/home-medical-record.png'),
    },
    {
      title: 'My Family',
      icon: require('../../../../assets/images/home-family.png'),
    },
    {
      title: 'My Pregnancy Journey',
      icon: require('../../../../assets/images/home-pregnancy.png'),
    },
    {
      title: 'My Baby Journey',
      icon: require('../../../../assets/images/home-baby.png'),
    },
    {
      title: 'Calculator',
      icon: require('../../../../assets/images/home-calculator.png'),
    },
    {
      title: 'Mom & Baby Products',
      icon: require('../../../../assets/images/home-products.png'),
    },
    {
      title: 'Notification',
      icon: require('../../../../assets/images/home-notification.png'),
    },
    {
      title: 'Terms & Conditions',
      icon: require('../../../../assets/images/home-terms.png'),
    },
    {
      title: 'Help',
      icon: require('../../../../assets/images/home-help.png'),
    },
    {
      title: 'Logout',
      icon: require('../../../../assets/images/home-logout.png'),
      onPress: logout,
    },
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <HomeMenuItem
          key={index.toString()}
          title={item.title}
          icon={item.icon}
          onPress={item.onPress}
        />
      ))}
    </>
  );
};

export default MenuItems;

//
// ---------- Styles ----------
//
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: h * 0.015,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
  },
  leftHomeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    width: w * 0.08,
    height: w * 0.08,
    marginRight: 10,
    borderRadius: w * 0.1,
    backgroundColor: pallette.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBlockIcon: {
    width: w * 0.04,
    height: w * 0.04,
    resizeMode: 'contain',
  },
  homeBlockTitle: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Semibold',
  },
  rightArrow: {
    width: w * 0.03,
    height: w * 0.03,
    resizeMode: 'contain',
  },
});

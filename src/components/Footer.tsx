import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-home-icon.png')}
            style={styles.footerButtonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-calendar-icon.png')}
            style={styles.activeFooterButtonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-call-icon.png')}
            style={styles.footerButtonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('../../assets/images/footer-reports-icon.png')}
            style={styles.footerButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

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
    backgroundColor: '#00B3AE',
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
    tintColor: '#fff',
  },

  activeFooterButtonIcon: {
    alignItems: 'center',
    width: 28,
    height: 28,
  },
});

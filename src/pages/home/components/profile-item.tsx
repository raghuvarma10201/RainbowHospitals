import {memo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {pallette, w} from '../../../constants/constants';
import {adjust} from '../../../utils/common-functions';

const ProfileItem = memo(({name, uid}: {name?: string; uid?: string}) => (
  <View style={styles.hProw}>
    <View style={styles.leftHProfile}>
      <View style={styles.iconHPLeft}>
        <Image
          source={require('../../../../assets/images/profile-icon.png')}
          style={styles.homeHpIcon}
        />
      </View>
      <View>
        <Text style={styles.homeHpTitle}>{name}</Text>
        <Text style={styles.homeHpsubTitle}>{uid}</Text>
      </View>
    </View>
  </View>
));

export default ProfileItem;

const styles = StyleSheet.create({
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
    resizeMode: 'contain',
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

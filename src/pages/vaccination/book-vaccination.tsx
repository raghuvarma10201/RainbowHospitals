import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';

import Header from '../../components/header';
import Footer from '../../components/footer';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types/navigation';
import {pallette} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';

const BookVaccination: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <Image
              source={require('../../../assets/images/vaccine-img.jpg')}
              style={styles.vaccinationImg}
            />
          </View>
          <View style={styles.vaccinationActions}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigateTo('VaccinesAdult', undefined)}>
              <View style={styles.activeActionItemIcon}>
                <Image
                  source={require('../../../assets/images/adult-vaccination-icon.png')}
                  style={styles.iconAction}
                />
              </View>
              <Text style={styles.actionText}> Adult Vaccination</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigateTo('VaccinesAdult', undefined)}>
              <View style={styles.actionItemIcon}>
                <Image
                  source={require('../../../assets/images/pediatric-vaccination-icon.png')}
                  style={styles.iconAction}
                />
              </View>
              <Text style={styles.actionText}>Pediatric Vaccination</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default BookVaccination;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
  vaccinationImg: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
    resizeMode: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  vaccinationActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -40,
    alignSelf: 'center',
  },
  actionItem: {
    alignItems: 'center',
    width: 100,
    marginBottom: 5,
    marginHorizontal: '5%',
  },
  actionItemIcon: {
    backgroundColor: pallette.dark_purple,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    borderWidth: 4,
    borderColor: pallette.white,
  },
  activeActionItemIcon: {
    backgroundColor: pallette.dark_purple,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    borderWidth: 4,
    borderColor: pallette.white,
  },
  iconAction: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  actionText: {
    fontSize: adjust(12),
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '100%',
    paddingVertical: 5,
  },
});

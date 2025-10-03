import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {fetchFamilyMembers} from '../../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {adjust, routes, ToastService} from '../../utils';
import {h, pallette, w} from '../../constants/constants';
import Header from '../../components/header';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PatientFamily: FC = ({navigation}: any) => {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  useFocusEffect(
    useCallback(() => {
      getFamilyMembers();
    }, []),
  );

  const getFamilyMembers = useCallback(async () => {
    try {
      const response = await fetchFamilyMembers({
        MobileNo: await AsyncStorage.getItem('mobileNumber'),
      });
      if (response?.status === 200) {
        setFamilyMembers(response.data);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Unable to fetch patients',
        );
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
    }
  }, []);

  const handleAddFamilyMember = () => {
    // Navigate or open modal here
    ToastService.success('Add', 'Add family member clicked');
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingBottom: h * 0.1}}>
        <Header title="menu" showLocation />
        {familyMembers.map(familyMember => (
          <View key={familyMember.region_id}>
            <View style={[styles.locationOption]}>
              <Text style={[styles.locationOptionText]}>
                {familyMember.PatientName}
              </Text>
              <View>
                <View
                  style={[styles.rowItems, {justifyContent: 'space-between'}]}>
                  <View style={styles.rowItems}>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.acSubTitle}>Relation :</Text>
                    </View>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.subTitle}>
                        {familyMember?.relation || 'Not-Mentioned'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowItems}>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.acSubTitle}>Mobile :</Text>
                    </View>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.subTitle}>
                        +91 {familyMember?.PhoneNumber}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.rowItems, {justifyContent: 'space-between'}]}>
                  <View style={styles.rowItems}>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.acSubTitle}>Patient Id :</Text>
                    </View>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.subTitle}>
                        {familyMember?.PatientID}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowItems}>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.acSubTitle}>Gender :</Text>
                    </View>
                    <View style={[styles.rowItem]}>
                      <Text style={styles.subTitle}>{familyMember?.Sex}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rowItems}>
                  <View style={[styles.rowItem]}>
                    <Text style={styles.acSubTitle}>DOB :</Text>
                  </View>
                  <View style={[styles.rowItem]}>
                    <Text style={styles.subTitle}>
                      {moment(familyMember?.DateOfBirth).format('DD MMM YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPressIn={() => navigation.navigate(routes.AddFamily)}
        style={styles.fab}
        activeOpacity={0.7}>
        <Icon name="add" size={28} color={pallette.white} />
      </TouchableOpacity>
    </View>
  );
};

export default PatientFamily;

const styles = StyleSheet.create({
  locationOption: {
    padding: w * 0.02,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.7,
    borderColor: '#00000020',
    marginVertical: h * 0.01,
    borderRadius: w * 0.03,
  },
  locationOptionText: {
    fontSize: adjust(14),
    color: pallette.black,
  },
  rowItems: {
    flexDirection: 'row',
  },
  rowItem: {
    padding: w * 0.02,
    borderColor: pallette.black,
    width: w * 0.22,
  },
  acSubTitle: {
    fontSize: adjust(12),
    color: pallette.black,
    textTransform: 'capitalize',
  },
  subTitle: {
    fontSize: adjust(10),
    color: pallette.black,
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    bottom: h * 0.03,
    right: w * 0.05,
    backgroundColor: pallette.dark_purple,
    width: w * 0.15,
    height: w * 0.15,
    borderRadius: w * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

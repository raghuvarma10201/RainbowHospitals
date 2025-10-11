import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {fetchFamilyMembers, updateRelationship} from '../../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {adjust, routes, ToastService} from '../../utils';
import {h, pallette, w} from '../../constants/constants';
import Header from '../../components/header';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';

const relations = [
  {value: 'Self', label: 'Self'},
  {value: 'Mother', label: 'Mother'},
  {value: 'Father', label: 'Father'},
  {value: 'Spouse', label: 'Spouse'},
  {value: 'Son', label: 'Son'},
  {value: 'Daughter', label: 'Daughter'},
];

const PatientFamily: FC = ({navigation}: any) => {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [editable, setEditable] = useState<number>();
  const [relation, setRelation] = useState<string>('');
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

  const handleAddFamilyMemberEdit = async (member: any) => {
    try {
      const response = await updateRelationship({
        PatientID: member?.PatientID,
        relation: relation,
      });
      if (response?.status === 200) {
        ToastService.success(
          'Success',
          response?.message || 'Updated Successfully',
        );
        setEditable(0);
        setRelation('');
        getFamilyMembers();
      } else {
        ToastService.error('Error', response?.message || 'Unable to update');
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
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingBottom: h * 0.1}}>
        <Header title="menu" showLocation />
        {familyMembers.map((familyMember, index) => (
          <View key={familyMember.region_id}>
            <View style={[styles.locationOption]}>
              <View style={[styles.rowItem]}>
                <Text style={[styles.locationOptionText]}>
                  {familyMember.PatientName}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    editable == index + 1
                      ? handleAddFamilyMemberEdit(familyMember)
                      : (setEditable(index + 1),
                        setRelation(familyMember?.relation || ''))
                  }
                  style={{
                    borderWidth: 0.7,
                    paddingHorizontal: w * 0.02,
                    borderRadius: w * 0.02,
                    borderColor: pallette.teal,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[styles.locationOptionText, {color: pallette.teal}]}>
                    {editable == index + 1
                      ? 'Update Relation'
                      : 'Edit Relation'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>Relation :</Text>
                {editable == index + 1 ? (
                  <Dropdown
                    style={styles.dropdownSelect}
                    selectedTextStyle={styles.selectedText}
                    placeholderStyle={styles.placeholderText}
                    maxHeight={200}
                    value={relation}
                    data={relations}
                    valueField="value"
                    labelField="label"
                    placeholder={'Select Relation'}
                    containerStyle={styles.dropdownList}
                    itemTextStyle={styles.dropdownList}
                    onChange={item => setRelation(item.value)}
                  />
                ) : (
                  <Text style={styles.subTitle}>
                    {familyMember?.relation || 'Not-Mentioned'}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>Mobile :</Text>
                <Text style={styles.subTitle}>
                  +91 {familyMember?.PhoneNumber}
                </Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>Patient Id :</Text>
                <Text style={[styles.subTitle, {textTransform: 'uppercase'}]}>
                  {familyMember?.PatientID}
                </Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>Gender :</Text>
                <Text style={styles.subTitle}>{familyMember?.Sex}</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>DOB :</Text>
                <Text style={styles.subTitle}>
                  {moment(familyMember?.DateOfBirth).format('DD MMM YYYY')}
                </Text>
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
    borderColor: '#00000080',
    marginVertical: h * 0.01,
    borderRadius: w * 0.03,
  },
  locationOptionText: {
    fontSize: adjust(14),
    color: pallette.black,
    marginVertical: h * 0.01,
  },
  rowItem: {
    padding: w * 0.02,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#00000080',
  },
  acSubTitle: {
    fontSize: adjust(14),
    color: pallette.black,
    textTransform: 'capitalize',
  },
  subTitle: {
    fontSize: adjust(14),
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
  dropdownSelect: {
    width: w * 0.3,
    padding: w * 0.01,
    borderWidth: 0.5,
    borderColor: '#00000020',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  placeholderText: {fontSize: adjust(12), color: pallette.dark_grey},
  selectedText: {fontSize: adjust(12), color: pallette.black},
  dropdownList: {
    fontSize: adjust(12),
    color: pallette.black,
    marginLeft: 0,
    marginRight: 10,
    padding: 0,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
  },
});

import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';

import Header from '../../components/header';
import Footer from '../../components/footer';
import {h, pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import {fetchFamilyMembers, getBranches} from '../../services/common';
import {Branch, FamilyMember} from '../../utils/types';
import {ToastService} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';

const VaccinesAdult: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [hospitals, setHospitals] = useState<Branch[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    '',
  );
  const [selectedHospital, setSelectedHospital] = useState<string | undefined>(
    '',
  );
  const getFamilyMembers = useCallback(async (mobile: string) => {
    try {
      const response = await fetchFamilyMembers({MobileNo: mobile});

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
    }
  }, []);

  const fetchBranches = async () => {
    try {
      const allBranches = await getBranches();
      console.log(allBranches);

      setHospitals(allBranches);
    } catch (error) {
      ToastService.error('Error', 'Unable to fetch branches');
      setHospitals([]);
    }
  };

  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      if (storedNumber) {
        await getFamilyMembers(storedNumber);
        fetchBranches();
      }
    })();
  }, [getFamilyMembers]);
  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <View
              style={{
                padding: w * 0.03,
                backgroundColor: '#81388B20',
                width: w * 0.9,
                alignSelf: 'center',
                borderRadius: w * 0.02,
                marginVertical: h * 0.02,
              }}>
              <Text
                style={{
                  fontSize: adjust(12),
                  textAlign: 'center',
                  fontFamily: 'ProximaNovaA-Regular',
                  color: pallette.black,
                }}>
                {' '}
                For any general information (Vaccine availability, cost, etc)
                about Vaccination, please contact:
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${18002122}`)}
                style={{
                  padding: w * 0.02,
                  backgroundColor: pallette.white,
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: w * 0.5,
                  alignSelf: 'center',
                  marginVertical: h * 0.01,
                  gap: w * 0.02,
                }}>
                <Image
                  source={require('../../../assets/images/footer-call-icon.png')}
                  style={{
                    width: w * 0.06,
                    height: w * 0.06,
                    tintColor: pallette.black,
                  }}
                />
                <Text
                  style={{
                    fontSize: adjust(12),
                    textAlign: 'center',
                    fontFamily: 'ProximaNovaA-Regular',
                    color: pallette.black,
                  }}>
                  1800 2122
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subTitle}>
              {' '}
              Vaccines for women are vital for protecting health at every stage
              of life
            </Text>

            {/* <View style={styles.quickActions}>
              <View style={styles.actionItem}>
                <View style={styles.activeActionItemIcon}>
                  <Image
                    source={require('../../../assets/images/tetanus-diphtheria-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Tetanus & Diphtheria</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Hepatitis B</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Influenza (Flu)</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>
                  HPV (Human Papilloma Virus)
                </Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Shingles (Herpes Zoster)</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Pneumococcal</Text>
              </View>
            </View> */}

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Book Vaccine </Text>

              <View>
                <Text style={styles.formLabel}>Patient</Text>
                <Dropdown
                  style={styles.dropdownSelect}
                  iconColor={pallette.black}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={selectedPatient}
                  data={familyMembers}
                  valueField="PatientID"
                  labelField="PatientName"
                  placeholder="Select Patient"
                  containerStyle={styles.dropdownList}
                  itemTextStyle={styles.selectedTextContry}
                  activeColor={pallette.pale_turquoise}
                  onChange={(item: FamilyMember) => {
                    setSelectedPatient(item.PatientID);
                  }}
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Email*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Mobile Number*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View>
                <Text style={styles.formLabel}>Hospital</Text>
                <Dropdown
                  style={styles.dropdownSelect}
                  iconColor={pallette.black}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={selectedHospital}
                  data={hospitals}
                  valueField="branch_id"
                  labelField="name"
                  placeholder="Select Hospital"
                  containerStyle={styles.dropdownList}
                  itemTextStyle={styles.selectedTextContry}
                  activeColor={pallette.pale_turquoise}
                  onChange={(item: Branch) => {
                    setSelectedHospital(item.branch_id);
                  }}
                />
              </View>

              <View style={styles.formRow}>
                <TouchableOpacity style={styles.formButton}>
                  <Text style={styles.formButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default VaccinesAdult;

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
    paddingBottom: 10,
    paddingTop: 0,
    paddingHorizontal: 10,
  },

  subTitle: {
    fontSize: adjust(12),
    textAlign: 'center',
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    alignSelf: 'center',
  },

  actionItem: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 12,
  },
  actionItemIcon: {
    backgroundColor: pallette.dark_purple,
    borderRadius: 10,
    padding: 15,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },

  activeActionItemIcon: {
    backgroundColor: pallette.teal,
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
    fontSize: adjust(10),
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '100%',
    paddingVertical: 5,
  },

  formTitle: {
    fontSize: adjust(16),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 10,
  },

  formContainer: {
    backgroundColor: pallette.white,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  formRow: {
    marginBottom: 12,
  },

  formLabel: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 5,
  },

  formInput: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: pallette.pale_turquoise,
    borderRadius: 10,
    padding: 10,
    backgroundColor: pallette.pale_turquoise,
  },

  formButton: {
    backgroundColor: pallette.dark_purple,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  formButtonText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },

  vaccinesDescription: {
    backgroundColor: pallette.white,
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  vaccinesDesTitle: {
    fontSize: adjust(14),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 6,
  },

  vaccinesDesText: {
    fontSize: adjust(10),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 10,
  },
  dropdownSelect: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: pallette.pale_turquoise,
    borderRadius: 10,
    padding: 10,
    backgroundColor: pallette.pale_turquoise,
    marginBottom: h * 0.01,
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.black,
  },
  selectedTextContry: {
    fontSize: adjust(12),
    color: pallette.black,
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    backgroundColor: pallette.white,
  },
});

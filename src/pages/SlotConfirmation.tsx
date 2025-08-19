import React, {useEffect, useState, useCallback} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';

import CommonHeader from '../components/Header';
import Footer from '../components/Footer';
import TimerBanner from '../components/TimmerBanner';
import Loader from '../components/Loader';
import DoctorDetailsCard from '../components/DoctorDetailsCard';

import {useApp} from '../context/AppContext';
import {fetchConsultationFee, fetchFamilyMembers} from '../services/common';
import {ToastService} from '../utils/ToastService';
import {FamilyMember} from '../utils/types';
import {MainStackParamList} from '../navigation/types';
import {pallette} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

// Navigation & Route types
type SlotConfirmationNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'SlotConfirmation'
>;

type SlotConfirmationRouteProp = RouteProp<
  MainStackParamList,
  'SlotConfirmation'
>;

type Props = {
  route: SlotConfirmationRouteProp;
};

const {height: h, width: w} = Dimensions.get('window');

const SlotConfirmation: React.FC<Props> = ({route}) => {
  const navigation = useNavigation<SlotConfirmationNavigationProp>();
  const {doctor, doctorSpecialitites} = route.params;

  const {branch, appointment, updateAppointment} = useApp();

  // ---------- State ----------
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    '',
  );
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------- Fetch Patient (Family Members) ----------
  const getFamilyMembers = useCallback(async (mobile: string) => {
    try {
      setLoading(true);
      const response = await fetchFamilyMembers({MobileNo: mobile});

      if (response?.status === 200) {
        setFamilyMembers(response.data);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Unable to fetch patients',
        );
      }
    } catch (error) {
      console.error('Failed to load Family Members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Fetch Consultation Fee ----------
  const getConsultationFee = useCallback(
    async (mrn: string | undefined) => {
      if (!branch || !appointment) return;

      try {
        setLoading(true);
        const payload = {
          orgcode: branch.organisation?.code || '11MN',
          OrganisationUID: branch?.UID?.toString() || '',
          Uhid: mrn || 'MAHTMP-182297',
          Departmentcode: '11MNPAGP',
          VisitDate: appointment.date,
          DoctorId: doctor.new_doctor_UID ?? '',
        };

        const response = await fetchConsultationFee(payload);
        if (response?.status === 200) {
          const fee =
            response.data.ConsultationFee || response.data.RegistrationFee || 0;

          setConsultationFee(fee);

          updateAppointment({
            ...appointment,
            mrn: mrn || '',
            Visittype: 'First Visit',
            careprovider_code: doctor.new_doctor_UID,
            price: fee,
            status: appointment.status ?? 'BOOKING',
            comment: appointment.comment ?? null,
          });
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Unable to fetch fee',
          );
        }
      } catch (error) {
        console.error('Failed to load Consultation Fee:', error);
      } finally {
        setLoading(false);
      }
    },
    [branch, doctor, appointment, updateAppointment],
  );

  // ---------- Online Payment Navigation ----------
  const navigateToOnlinePayment = useCallback(() => {
    if (!appointment) return;

    const txnid = `TXN_${Date.now()}`;

    navigation.navigate('PayUWebView', {
      finalPayload: appointment,
      txnId: txnid,
      amount: consultationFee.toFixed(2),
      payuUrl: 'https://test.payu.in/_payment', // TODO: Replace with Production URL
    });
  }, [appointment, consultationFee, navigation]);

  // ---------- Load on Mount ----------
  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      if (storedNumber) {
        setPhoneNumber(storedNumber);
        await getFamilyMembers(storedNumber);
      }
    })();
  }, [getFamilyMembers]);

  // ---------- Render ----------
  return (
    <View style={styles.mainContainer}>
      <CommonHeader showLocation title={undefined} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Doctor Details */}
        <DoctorDetailsCard
          doctorDetail={doctor}
          doctorSpecialitites={doctorSpecialitites}
        />

        <View style={styles.calenderContainer}>
          {/* Location Info */}
          <View style={styles.flex}>
            <Image
              source={require('../../assets/images/map-icon.png')}
              style={styles.flexImg}
            />
            <View>
              <Text
                style={[
                  styles.flexHead,
                  {fontFamily: 'ProximaNovaA-Semibold'},
                ]}>
                Location
              </Text>
              <Text style={[styles.flexHead, {fontSize: adjust(12)}]}>
                {branch?.name}
              </Text>
            </View>
          </View>

          {/* Patient Selection */}
          <View style={styles.flex}>
            <Image
              source={require('../../assets/images/booked-for-icon.png')}
              style={styles.flexImg}
            />
            <View>
              <Text
                style={[
                  styles.flexHead,
                  {fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2},
                ]}>
                Booked for
              </Text>
              <Dropdown
                style={styles.dropdownSelect}
                selectedTextStyle={styles.selectedTextContry}
                placeholderStyle={styles.placeholderCountry}
                maxHeight={200}
                value={selectedPatient}
                data={familyMembers}
                valueField="PatientID"
                labelField="PatientName"
                placeholder="Select Patient"
                containerStyle={styles.dropdownList}
                activeColor="#fff"
                onChange={(item: FamilyMember) => {
                  setSelectedPatient(item.PatientID);
                  getConsultationFee(item.PatientID);
                }}
              />
            </View>
          </View>

          {/* Payment Summary */}
          {selectedPatient && (
            <>
              <View>
                <View
                  style={[styles.paymentBlock, {backgroundColor: '#4CC2BF'}]}>
                  <Text style={[styles.paymentTxt, {color: pallette.white}]}>
                    Total Charges
                  </Text>
                </View>
                <View
                  style={[styles.paymentBlock, {backgroundColor: '#b1e2e1ff'}]}>
                  <Text
                    style={[
                      styles.paymentTxt,
                      {
                        color: pallette.black,
                        fontFamily: 'ProximaNovaA-Semibold',
                      },
                    ]}>
                    Consultation Fee
                  </Text>
                  <Text
                    style={[
                      styles.paymentTxt,
                      {
                        color: pallette.black,
                        fontFamily: 'ProximaNovaA-Semibold',
                      },
                    ]}>
                    ₹ {consultationFee}
                  </Text>
                </View>
              </View>

              {/* Payment Options */}
              <View style={styles.payBtnsContainer}>
                <TouchableOpacity
                  onPress={navigateToOnlinePayment}
                  style={[
                    styles.payBtn,
                    {backgroundColor: pallette.app_purple},
                  ]}>
                  <Text style={styles.payBtnTxt}>Pay Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.payBtn, {backgroundColor: 'grey'}]}>
                  <Text style={styles.payBtnTxt}>Pay At Hospital</Text>
                </TouchableOpacity>
              </View>

              {/* Disclaimer */}
              <Text style={[styles.flexHead, {fontSize: adjust(10)}]}>
                Disclaimer: Please note that waiting times may vary depending on
                the doctor's schedule and unforeseen circumstances. We
                appreciate your patience and understanding.
              </Text>
            </>
          )}
        </View>

        {/* <TimerBanner /> */}
      </ScrollView>

      <Footer />

      {loading && <Loader />}
    </View>
  );
};

export default SlotConfirmation;

// ---------- Styles ----------
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    minHeight: h,
  },
  calenderContainer: {
    backgroundColor: pallette.white,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: h * 0.03,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w * 0.02,
    marginVertical: h * 0.01,
    paddingHorizontal: w * 0.02,
  },
  flexImg: {
    height: h * 0.05,
    width: w * 0.1,
    resizeMode: 'contain',
  },
  flexHead: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  paymentBlock: {
    paddingVertical: h * 0.01,
    paddingStart: w * 0.1,
    paddingEnd: w * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTxt: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h * 0.02,
  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    borderRadius: w * 0.04,
  },
  payBtnTxt: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  dropdownSelect: {
    backgroundColor: '#b1e2e1ff',
    height: 30,
    marginTop: 5,
    width: w * 0.6,
    paddingHorizontal: 10,
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
    backgroundColor: '#E5F9F8',
  },
});

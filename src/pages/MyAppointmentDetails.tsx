import { Dimensions, Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Modal, Portal, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { formatAppointmentDate, formatAppointmentTime } from '../utils/dateTime';

const MyAppointmentDetails: React.FC<any> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { appointmentData } = route.params;
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          <View style={styles.doctorDetailsContainer}>
            <View style={styles.doctorImgContainer}>
              <Image
                source={
                    appointmentData.image
                      ? { uri: `${appointmentData.image}` }
                      : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                      }
                  }
                style={styles.docImg}
              />
              <View style={styles.dotContainer}>
                <View style={styles.dot} />
              </View>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={[styles.docName, { fontSize: 16, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Semibold' }]}>
                 {appointmentData?.CareProviderName ?? 'Doctor Name'}
              </Text>
              <Text style={[styles.docName, { fontSize: 12, marginTop: 3, }]}>
                 {appointmentData?.SpecialtyName ?? 'Specialization'}
              </Text>



              <View style={styles.location}>
                <Image source={require('../../assets/images/map-icon.png')} style={{ width: 15, height: 15 }} />
                <Text style={styles.locationText}>{appointmentData?.OrganisationName ?? ''}</Text>
              </View>

            </View>
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientInfoHeaderText}>Patient Info</Text>
            <View>
              <View style={styles.patientItem}>
                <Image source={require('../../assets/images/doc-img.png')} style={styles.patientImg}
                />
                <View>
                  <Text style={{ fontSize: 13, color: '#6651AF', fontFamily: 'ProximaNovaA-Bold', marginBottom: 2 }}>#{appointmentData?.BookingUID ?? ''}</Text>
                  <Text style={{ fontSize: 15, color: '#6651AF', fontFamily: 'ProximaNovaA-Semibold', marginBottom: 6 }}>{appointmentData?.PatientName ?? ''}</Text>
                  <View style={styles.patientReports}>
                    <Text style={styles.reports}>MRI Report</Text>
                    <Text style={styles.reports}>Blood Reports</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.patientInfo, { marginTop: 15, borderRadius: 10, }]}>
            <Text style={styles.patientInfoHeaderText}>Time Date</Text>
            <View style={styles.timeDateItem}>
              <View style={styles.timeFlexRow}>
                <Image source={require('../../assets/images/footer-calendar-icon.png')} style={styles.timeIcon}
                />
                <Text style={{ fontSize: 14, color: '#6651AF', fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }}>
                  {formatAppointmentDate(appointmentData?.SlotStartDttm)}</Text>
              </View>
              <View>
                <View style={styles.timeFlexRow}>
                  <Image source={require('../../assets/images/time-icon.png')} style={styles.timeIcon}
                  />
                  <Text style={{ fontSize: 14, color: '#6651AF', fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }}>{formatAppointmentTime(appointmentData?.SlotStartDttm)}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.payBtnsContainer}>
            <TouchableOpacity onPress={() => showModal()}
              style={[styles.payBtn, { backgroundColor: 'grey' }]}>
              <Text style={styles.payBtnTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: '#3C2871' }]}>
              <Text style={styles.payBtnTxt}>Reschedule</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.chatBtn}>
            <Image source={require('../../assets/images/chat-icon.png')} style={styles.chatIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalWrapp}>
          <Text style={styles.formTitle}>Cancel Appointment</Text>
          <Text style={styles.formSubTitle}>Need Bank Details to refund the amount</Text>

          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Bank Name</Text>
              <TextInput mode="flat" underlineColor="transparent" style={[styles.formInput]} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Account Number</Text>
              <TextInput mode="flat" underlineColor="transparent" style={styles.formInput} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>IFSC Code</Text>
              <TextInput mode="flat" underlineColor="transparent" style={styles.formInput} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Account Holder Name</Text>
              <TextInput mode="flat" underlineColor="transparent" style={styles.formInput} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Branch Name </Text>
              <TextInput mode="flat" underlineColor="transparent" style={styles.formInput} />
            </View>
            <View style={styles.formRowBtn}>
              <TouchableOpacity style={[styles.formButton, { backgroundColor: 'grey' }]}>
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.formButton}>
                <Text style={styles.formButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

export default MyAppointmentDetails

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 0,
  },

  container: {
    flex: 1,
    paddingBottom: 50,
    paddingTop: 0,
    position: 'relative',
  },

  //---
  doctorDetailsContainer: {
    backgroundColor: '#3C2871',

    paddingHorizontal: 15,
    alignSelf: 'center',
    marginTop: h * 0.12,
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
    width: '90%',
  },
  doctorImgContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: h * 0.1,
    marginHorizontal: 'auto',
    borderWidth: 0.3,
    borderColor: 'grey',
    padding: 5,
    marginTop: -50,
    position: 'relative',
    marginBottom: 10,

  },
  docImg: {
    width: 100,
    height: 100,
    borderRadius: h * 0.1,
    resizeMode: 'cover',
  },
  dotContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#fff',
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 13,
    width: 13,
    borderRadius: 100,
    backgroundColor: '#4CC2BF',
  },
  doctorDetails: {
    padding: 8,
    backgroundColor: '#3C2871',
    width: '100%',
  },
  docName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },
  //--
  patientInfo: {
    backgroundColor: '#F5F5FF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },


  patientInfoHeaderText: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'ProximaNovaA-Bold',
    color: '#3C2871',
    textAlign: 'left',
  },

  location: {
    borderTopWidth: 1,
    borderTopColor: '#5B52A3',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 10,
    paddingTop: 10,
  },
  locationText: {

    fontSize: 13,
    fontFamily: 'ProximaNovaA-Semibold',
    color: '#fff',
    textAlign: 'left',
  },


  patientItem: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',

  },

  patientImg: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    borderRadius: w,
    borderWidth: 1,
    borderColor: '#E2EDEC',
    marginRight: 10,
  },

  patientReports: {
    marginTop: 5,
    flexDirection: 'row',
    gap: 10,

  },
  reports: {
    backgroundColor: '#E2EDEC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    fontSize: 11,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: 10,
  },
  timeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 5,
  },

  timeDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
    marginTop: 10,
    marginBottom: 10,
  },

  timeFlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },


  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,

  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    borderRadius: 100,
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnTxt: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Semibold',
  },


  //--
  modalWrapp: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',

    justifyContent: 'flex-start',
  },

  //---

  formTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  formSubTitle: {
    fontSize: 13,
    fontFamily: 'ProximaNovaA-Regular',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  formRow: {
    marginBottom: 15,
  },

  formLabel: {
    fontSize: 13,
    fontFamily: 'ProximaNovaA-Regular',
    color: '#000',
    marginBottom: 5,
  },

  formInput: {
    height: 36,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 6,
    backgroundColor: '#C7E8E7',
  },

  formRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  formButton: {
    backgroundColor: '#3C2871',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '45%',
  },
  formButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },

  chatBtn: {
    backgroundColor: '#00B3AE',
    borderRadius: 100,
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -40,
    right: 18,
    zIndex: 2,
    borderWidth: 3,
    borderColor: '#00A69E',

  },

  chatIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

}); 
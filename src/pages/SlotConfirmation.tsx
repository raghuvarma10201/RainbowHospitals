import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonHeader from '../components/Header';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { useApp } from '../context/AppContext';
import { fetchConsultationFee, generateHash } from '../services/common';
import { ToastService } from '../utils/ToastService';
import { doctorData } from '../Constants/data';

const SlotConfirmation: React.FC = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { doctor } = route.params;
  const { branch, appointment, updateAppointment } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConsultationFee();
  }, []);

  const getConsultationFee = async () => {
    try {
      setLoading(true);
      const payload = {
        orgcode: branch?.organisation.code ? String(branch.organisation.code) : '11MN',
        OrganisationUID: branch?.UID ? String(branch.UID) : '',
        Uhid: selectedPatient ? selectedPatient : 'MAHTMP-182297',
        Departmentcode: '11MNPAGP',
        VisitDate: appointment?.date,
        DoctorId: doctor.new_doctor_UID ?? '',
      }
      const response = await fetchConsultationFee(payload);
      console.log(response);
      if (response && response.status == 200) {
        setConsultationFee(response.data.ConsultationFee);
        if (appointment) {
          updateAppointment({
            ...appointment,
            mrn : 'MAHTMP-182297',
            Visittype : 'First Visit',
            careprovider_code : doctor.new_doctor_UID,
            price: response.data.ConsultationFee,
            status: appointment.status ?? 'BOOKING', // Replace 'PENDING' with a valid BookingStatus default if needed
            comment: appointment.comment ?? null // Ensure comment is string or null
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to load Sessions:', error);
    } finally {
      setLoading(false);
    }
  };
  const navigateToOnlinePayment = async () => {
    try {
      setLoading(true);
      const txnid = `TXNN_${Date.now()}`;
      console.log("TransactionId--------------------",txnid);
      // 2. Push PayUWebView
      navigation.navigate('PayUWebView', {
        finalPayload: appointment,
        txnId: txnid,
        amount: consultationFee.toFixed(2) || '0.00',
        payuUrl: 'https://test.payu.in/_payment', // For Production
      });
    } catch (e) {
      console.log(e);
      ToastService.error('Could not start payment, please try again.');
    } finally {
      setLoading(false); // End loader
    }
  };
  return (
    <View style={styles.mainContainer}>
      <CommonHeader showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.doctorDetailsContainer}>
          <View style={styles.doctorImgContainer}>
            <Image
              source={require('../../assets/images/doc-img.png')}
              style={styles.docImg}
            />
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={[styles.docName, { fontSize: 16, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Semibold' }]}>
              {doctor?.name}
            </Text>
            <Text style={[styles.docName, { fontSize: 12, marginTop: 3, }]}>
              {doctor?.designation}
            </Text>
            <Text style={[styles.docName, { fontSize: 12 }]}>
              {doctor?.specialities}
            </Text>
            <Text style={[styles.docName, { fontSize: 13, color: '#4CC2BF', marginTop: 3, marginBottom: 10 }]}>
              {`Experience 15 Years`}
            </Text>
            <View style={styles.consultBtnsContainer}>
              <TouchableOpacity style={styles.consultBtn}>
                <Text
                  style={styles.consultBtnTxt}>{`Physical Consultation`}</Text>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../assets/images/physical-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.consultBtn}>
                <Text style={styles.consultBtnTxt}>{`Video Consultation`}</Text>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../assets/images/video-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.calenderContainer}>
          <View style={styles.flex}>
            <Image
              source={require('../../assets/images/map-icon.png')}
              style={styles.flexImg}
            />
            <View>
              <Text style={[styles.flexHead, { fontFamily: 'ProximaNovaA-Semibold' }]}>Location</Text>
              <Text style={[styles.flexHead, { fontSize: 13 }]}>
                {branch?.name}
              </Text>
            </View>
          </View>
          <View style={styles.flex}>
            <Image
              source={require('../../assets/images/booked-for-icon.png')}
              style={styles.flexImg}
            />
            <View>
              <Text style={[styles.flexHead, { fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }]}>Booked for</Text>
              <Text style={styles.flexSub}>Ambervati ▼</Text>
            </View>
          </View>
          <View>
            <View style={[styles.paymentBlock, { backgroundColor: '#4CC2BF' }]}>
              <Text style={[styles.paymentTxt, { color: '#fff' }]}>
                Total Charges
              </Text>
            </View>
            <View style={[styles.paymentBlock, { backgroundColor: '#b1e2e1ff' }]}>
              <Text style={[styles.paymentTxt, { color: '#000', fontFamily: 'ProximaNovaA-Semibold' }]}>
                Consultation Fee
              </Text>
              <Text style={[styles.paymentTxt, { color: '#000', fontFamily: 'ProximaNovaA-Semibold' }]}>₹ {consultationFee}</Text>
            </View>
          </View>
          <View style={styles.payBtnsContainer}>
            <TouchableOpacity  onPress={() => navigateToOnlinePayment()}
              style={[styles.payBtn, { backgroundColor: '#3C2871' }]}>
              <Text style={styles.payBtnTxt}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: 'grey' }]}>
              <Text style={styles.payBtnTxt}>Pay At Hospital</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.flexHead, { fontSize: 12 }]}>
            Disclaimer: Please note that waiting times may vary depending on the
            doctor's schedule and unforeseen circumstances. We appreciate your
            patience and understanding
          </Text>
        </View>

      </ScrollView>
      <Footer />
    </View>
  );
};

export default SlotConfirmation;

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 100,
    minHeight: h,
  },
  doctorDetailsContainer: {
    backgroundColor: '#3C2871',
    paddingTop: h * 0.1,
    paddingHorizontal: w * 0.02,
    width: '90%',
    alignSelf: 'center',
    marginTop: h * 0.12,
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
  },
  doctorImgContainer: {
    height: h * 0.2,
    width: h * 0.2,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: h * 0.1,
    top: -(h * 0.1),
    left: w * 0.2,
    borderWidth: 0.3,
    borderColor: 'grey',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docImg: {
    height: h * 0.17,
    width: h * 0.17,
    borderRadius: h * 0.1,
    resizeMode: 'cover',
  },
  dotContainer: {
    height: w * 0.05,
    width: w * 0.05,
    borderRadius: w * 0.1,
    backgroundColor: '#fff',
    position: 'absolute',
    right: w * 0.02,
    top: h * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: w * 0.035,
    width: w * 0.035,
    borderRadius: w * 0.1,
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
  },
  consultBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: h * 0.01,
    marginBottom: 15,
  },
  consultBtn: {
    paddingVertical: w * 0.03,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
    backgroundColor: '#b6e7e6ff',
    width: '48%',
  },
  consultBtnTxt: {
    fontSize: 11,
    color: '#000',
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
    paddingLeft: 32,
  },
  iconContainer: {
    height: Dimensions.get('window').height * 0.08,
    width: 30,
    position: 'absolute',
    backgroundColor: '#4CC2BF',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultBtnImg: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#b6e7e6ff',
  },
  calenderContainer: {
    backgroundColor: '#fff',
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
    fontSize: 14,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
  },
  flexSub: {
    fontSize: 12,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#b1e2e1ff',
    paddingVertical: 5,
    borderRadius: 3,
    marginBottom: 5,
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
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginVertical: h * 0.02,
  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    borderRadius: w * 0.04,
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnTxt: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Semibold',
  },
});

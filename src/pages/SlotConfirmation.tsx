import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CommonHeader from '../components/Header';
import Footer from '../components/Footer';

const SlotConfirmation: React.FC = ({route}: any) => {
  const doctor = route?.params;
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CommonHeader showLocation title={undefined} />
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
            <Text style={[styles.docName, {color: '#4CC2BF'}]}>
              {doctor?.name}
            </Text>
            <Text style={[styles.docName, {fontSize: 12}]}>
              {doctor?.designation}
            </Text>
            <Text style={[styles.docName, {fontSize: 12}]}>
              {doctor?.speciality}
            </Text>
            <Text style={[styles.docName, {fontSize: 14, color: '#4CC2BF'}]}>
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
              <Text style={styles.flexHead}>Location</Text>
              <Text style={[styles.flexHead, {fontSize: 12}]}>
                Road No. 2, Banjara Hills
              </Text>
            </View>
          </View>
          <View style={styles.flex}>
            <Image
              source={require('../../assets/images/booked-for-icon.png')}
              style={styles.flexImg}
            />
            <View>
              <Text style={styles.flexHead}>Booked for</Text>
              <Text style={styles.flexSub}>Ambervati ▼</Text>
            </View>
          </View>
          <View>
            <View style={[styles.paymentBlock, {backgroundColor: '#4CC2BF'}]}>
              <Text style={[styles.paymentTxt, {color: '#fff'}]}>
                Total Charges
              </Text>
            </View>
            <View style={[styles.paymentBlock, {backgroundColor: '#b1e2e1ff'}]}>
              <Text style={[styles.paymentTxt, {color: '#000'}]}>
                Consultation Fee
              </Text>
              <Text style={[styles.paymentTxt, {color: '#000'}]}>₹ 900</Text>
            </View>
          </View>
          <View style={styles.payBtnsContainer}>
            <TouchableOpacity
              style={[styles.payBtn, {backgroundColor: '#3C2871'}]}>
              <Text style={styles.payBtnTxt}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, {backgroundColor: 'grey'}]}>
              <Text style={styles.payBtnTxt}>Pay At Hospital</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.flexHead, {fontSize: 12}]}>
            Disclaimer: Please note that waiting times may vary depending on the
            doctor's schedule and unforeseen circumstances. We appreciate your
            patience and understanding
          </Text>
        </View>
        <Footer />
      </ScrollView>
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
    width: w * 0.8,
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
    height: h * 0.19,
    width: h * 0.19,
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
  },
  consultBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: h * 0.01,
  },
  consultBtn: {
    paddingVertical: w * 0.03,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
    backgroundColor: '#b6e7e6ff',
    width: '48%',
  },
  consultBtnTxt: {
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
  },
  iconContainer: {
    height: '300%',
    width: '30%',
    position: 'absolute',
    backgroundColor: '#4CC2BF',
    left: w * 0.01,
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
    width: w * 0.8,
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
  },
  flexSub: {
    fontSize: 14,
    color: '#000',
    backgroundColor: '#4CC2BF',
    paddingHorizontal: w * 0.01,
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
  },
  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: w * 0.05,
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
    fontSize: 12,
    color: '#fff',
  },
});

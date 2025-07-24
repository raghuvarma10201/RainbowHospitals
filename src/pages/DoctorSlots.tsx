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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Footer from '../components/Footer';
import DynamicWeekWithMonth from '../components/WeeklyCalender';

const DoctorSlots: React.FC = ({route}: any) => {
  const doctor = route?.params;
  console.log(doctor);
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
                <View style={styles.iconContainer}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.consultBtn}>
                <Text style={styles.consultBtnTxt}>{`Video Consultation`}</Text>
                <View style={styles.iconContainer}></View>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text
              style={[
                styles.docName,
                {fontSize: 16, color: '#4CC2BF'},
              ]}>{`About`}</Text>
            <Text
              style={[
                styles.docName,
                {fontSize: 12},
              ]}>{`${doctor?.name} is a top specialist in ${doctor?.speciality} in Secunderabad, Hyderabad. He has graduated MBBS from the...Read More`}</Text>
          </View>
        </View>
        <View style={styles.calenderContainer}>
          <DynamicWeekWithMonth />
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default DoctorSlots;

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
  calenderContainer: {
    height: h * 0.2,
    backgroundColor: '#ac9fcfff',
    width: w * 0.8,
    alignSelf: 'center',
    borderBottomLeftRadius: w * 0.1,
    borderBottomRightRadius: w * 0.1,
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
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#b6e7e6ff',
  },
});

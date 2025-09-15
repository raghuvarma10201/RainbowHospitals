import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {h, pallette, w} from '../../../constants/constants';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../types/navigation';
import {memo} from 'react';
import {routes} from '../../../utils/enums';
import FastImage from 'react-native-fast-image';
import {IMG_BASE_URL} from '../../../utils/enums';

interface DoctorSpeciality {
  speciality: {name: string};
}

interface Doctor {
  id: string;
  name: string;
  designation: string;
  small_image?: string;
  experience?: string | number;
  doctor_specialities: DoctorSpeciality[];
}
const DoctorRow: React.FC<{
  doctor: Doctor;
  appointmentType: string;
  branchId?: string;
  navigation: NativeStackNavigationProp<MainStackParamList>;
}> = memo(({doctor, appointmentType, branchId, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigateTo(navigation, routes.DoctorSlots as keyof MainStackParamList, {
          doctorId: doctor.id,
          appointmentType,
          OrganisationID: branchId,
        })
      }>
      <View style={styles.doctorContainer}>
        {/* Doctor Image */}
        <FastImage
          source={
            doctor.small_image
              ? {uri: `${IMG_BASE_URL}${doctor.small_image}`}
              : {
                  uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                }
          }
          style={styles.doctorImg}
        />

        {/* Doctor Details */}
        <View style={styles.doctorCardDetails}>
          <Text style={[styles.docName, styles.docNameHighlight]}>
            {doctor.name}
          </Text>
          <Text style={styles.docDesignation}>{doctor.designation}</Text>
          {/* <Text
            style={styles.docSpeciality}
            numberOfLines={2}
            ellipsizeMode="tail">
            {doctor.doctor_specialities?.[0]?.speciality?.name ?? '—'}
          </Text> */}
          {/* <Text style={styles.docExperience}>
            {`Experience ${doctor.experience ?? '0'} Years`}
          </Text> */}

          {/* Appointment Button */}
          {/* <TouchableOpacity
            style={[styles.payBtn, {backgroundColor: pallette.dark_purple}]}>
            <Text style={styles.payBtnTxt}>Book Appointment</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DoctorRow;

const styles = StyleSheet.create({
  doctorContainer: {
    width:w * 0.29,
    height:h * 0.25,
    paddingVertical: h * 0.005,
    paddingHorizontal:w * 0.01, 
    flexDirection: 'column',
    alignItems: 'flex-start', 
    backgroundColor:'#43316D',
    borderRadius: w * 0.03,
    gap:w*0.01,
  },


  doctorImg: {
    height: h * 0.12,
    borderRadius: w * 0.03,
    width: '100%',
    resizeMode: 'contain',
    borderColor: pallette.light_grey,
  },

  doctorCardDetails:{
    width: '100%',
    paddingHorizontal:w * 0.01, 
    paddingTop:h*0.005,
    paddingBottom:h*0.005,
  },
  docName: {
    fontSize: adjust(9),
    color: pallette.white,
  },
  docNameHighlight: {
    fontFamily: 'ProximaNovaA-Semibold',
    marginBottom: 2,
    color: pallette.white,
  },
  docDesignation: {
    fontSize: adjust(9),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.white,
  },
  docSpeciality: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.white,
  },
  docExperience: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
    marginTop: 2,
    color: pallette.white,
  },
  payBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    maxWidth: w * 0.4,
    marginTop: 10,
  },
  payBtnTxt: {
    fontSize: adjust(10),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
});

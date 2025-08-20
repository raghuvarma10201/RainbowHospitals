import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {h, pallette, w} from '../../Constants/Constant';
import {adjust, navigateTo} from '../../utils/commonFunctions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../navigation/types';
import {memo} from 'react';
import {routes} from '../../utils/enums';
import FastImage from 'react-native-fast-image';
import {IMG_BASE_URL} from '../../utils/environment';

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
        <View>
          <Text style={[styles.docName, styles.docNameHighlight]}>
            {doctor.name}
          </Text>
          <Text style={styles.docDesignation}>{doctor.designation}</Text>
          <Text
            style={styles.docSpeciality}
            numberOfLines={2}
            ellipsizeMode="tail">
            {doctor.doctor_specialities?.[0]?.speciality?.name ?? '—'}
          </Text>
          <Text style={styles.docExperience}>
            {`Experience ${doctor.experience ?? '0'} Years`}
          </Text>

          {/* Appointment Button */}
          <TouchableOpacity
            style={[styles.payBtn, {backgroundColor: pallette.app_purple}]}>
            <Text style={styles.payBtnTxt}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DoctorRow;

const styles = StyleSheet.create({
  doctorContainer: {
    width: '100%',
    paddingVertical: h * 0.01,
    marginTop: h * 0.01,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: w * 0.05,
    alignSelf: 'center',
    borderBottomWidth: 0.7,
    borderColor: pallette.light_grey,
  },
  doctorImg: {
    height: h * 0.12,
    width: h * 0.12,
    resizeMode: 'cover',
    borderRadius: w,
    borderWidth: 1,
    borderColor: pallette.light_grey,
  },
  docName: {
    fontSize: adjust(10),
    color: pallette.black,
  },
  docNameHighlight: {
    color: pallette.app_medium_green,
    fontFamily: 'ProximaNovaA-Semibold',
    marginBottom: 2,
  },
  docDesignation: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
  },
  docSpeciality: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
  },
  docExperience: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.app_medium_green,
    marginTop: 2,
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

import React, {useEffect, useState, memo, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchLocationBlock from '../components/SearchLocationBlock';

import {getDoctors} from '../services/common';
import {ToastService} from '../utils/ToastService';
import {IMG_BASE_URL} from '../utils/environment';
import {useApp} from '../context/AppContext';
import {MainStackParamList} from '../navigation/types';
import {h, pallette, w} from '../Constants/Constant';
import {adjust, navigateTo} from '../utils/commonFunctions';
import {routes} from '../utils/enums';

// ---------- TYPES ----------
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

interface DoctorsListProps {
  route: {
    params: {
      specialityId: number;
      appointmentType: string;
    };
  };
}

// ---------- DOCTOR ROW COMPONENT (memoized for perf) ----------
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

// ---------- MAIN COMPONENT ----------
const DoctorsList: React.FC<DoctorsListProps> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {specialityId, appointmentType} = route.params;

  const {branch} = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  // Load doctors from API
  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDoctors(
        '',
        specialityId,
        '',
        '',
        appointmentType,
        1,
        10,
      );

      if (response?.status === 200) {
        setDoctors(response.data.doctors ?? []);
      } else {
        ToastService.error(
          'Error',
          response?.message ?? 'Failed to fetch doctors',
        );
      }
    } catch (error) {
      console.error('Failed to load Doctors:', error);
      ToastService.error('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [specialityId, appointmentType]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return (
    <View style={styles.mainContainer}>
      <Header showLocation />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Banner Image */}
          <Image
            source={require('../../assets/images/doctors-list-img.png')}
            style={styles.banner}
          />

          {/* Search Location Block */}
          <SearchLocationBlock style={styles.searchLocationBlock} />

          {/* Doctors List */}
          <View style={styles.doctorsListContainer}>
            {doctors.map(doctor => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                appointmentType={appointmentType}
                branchId={branch?.id}
                navigation={navigation}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default DoctorsList;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  banner: {
    height: h * 0.29,
    width: '100%',
    resizeMode: 'contain',
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    top: h * 0.2,
  },
  doctorsListContainer: {
    paddingHorizontal: 15,
  },
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

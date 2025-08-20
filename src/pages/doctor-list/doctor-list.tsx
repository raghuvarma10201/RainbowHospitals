// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, memo, useCallback} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {DoctorRow} from '.';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchLocationBlock from '../../components/SearchLocationBlock';

// ---------- OTHER IMPORTS ----------
import {getDoctors} from '../../services/common';
import {ToastService} from '../../utils/ToastService';
import {useApp} from '../../context/AppContext';
import {MainStackParamList} from '../../navigation/types';
import {h, pallette} from '../../Constants/Constant';

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

// ---------- COMPONENT ----------
const DoctorsList: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {specialityId, appointmentType} = route.params;
  const {branch} = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- CALLBACK FUNCTIONS ----------
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

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Banner Image */}
          <Image
            source={require('../../../assets/images/doctors-list-img.png')}
            style={styles.banner}
          />
          {/* Search Location Block */}
          <SearchLocationBlock style={styles.searchLocationBlock} />
          {/* Doctor List */}
          <View style={styles.doctorsListContainer}>
            {doctors.map(doctor => (
              // ---------- DOCTOR ROW COMPONENT ----------
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
      {/* COMMON FOOTER */}
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
});

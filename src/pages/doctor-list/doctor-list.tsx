// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {DoctorRow} from '.';
import {Footer, Header, SearchLocationBlock} from '../../components';

// ---------- OTHER IMPORTS ----------
import {getDoctors} from '../../services/common';
import {ToastService} from '../../utils/service-handlers';
import {useApp} from '../../context/app-context';
import {MainStackParamList} from '../../types/navigation';
import {h, pallette} from '../../constants/constants';
import NotFound from '../../components/empty-text';

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
        branch?.id.toString(),
        // '',
        '',
        appointmentType,
        1,
        10,
      );
      console.log(response.data.doctors);

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
            {doctors.length > 0 ? (
              doctors.map(doctor => (
                // ---------- DOCTOR ROW COMPONENT ----------
                <DoctorRow
                  key={doctor.id}
                  doctor={doctor}
                  appointmentType={appointmentType}
                  branchId={branch?.organisation?.organisationid}
                  navigation={navigation}
                />
              ))
            ) : (
              <NotFound
                text={`No doctors found in ${branch?.name ?? 'this branch'} for ${appointmentType?.toLowerCase() ?? 'the selected'} appointment.`}
                margin={h * 0.15}
              />
            )}
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

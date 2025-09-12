// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
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
import {h, pallette, w} from '../../constants/constants';
import NotFound from '../../components/empty-text';
import CategorySelection from '../../components/category-selection';
import {LinearGradient} from 'react-native-linear-gradient';
import {adjust} from '../../utils';

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
  const headerRef = useRef<any>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {specialityId, specialityName, appointmentType} = route.params;
  const {branch} = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [changeLocation, setChangeLocation] = useState<boolean>(false);
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
  }, [specialityId, appointmentType, branch]);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation ref={headerRef} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SearchLocationBlock style={styles.searchLocationBlock} />
          <CategorySelection />
          <View style={styles.specialtyRibbonContainer}>
            <LinearGradient
              colors={[pallette.white, pallette.light_amethyst]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.gradient}
            />
            <View style={styles.specialtyContainer}>
              <Text style={styles.specialtyName}>{specialityName}</Text>
            </View>
            <LinearGradient
              colors={[pallette.light_amethyst, pallette.white]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.gradient}
            />
          </View>
          <View style={styles.doctorsListContainer}>
            {doctors.length > 0 ? (
              doctors.map(doctor => (
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
                text={`No doctors found in ${
                  branch?.name ?? 'this branch'
                } for ${
                  appointmentType?.toLowerCase() ?? 'the selected'
                } appointment.`}
                margin={h * 0.15}
                change={() => headerRef.current?.openModal()}
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
    paddingHorizontal: w * 0.02,
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h * 0.02,
    width: w * 0.8,
    alignSelf: 'center',
  },
  specialtyRibbonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: h * 0.04,
  },
  gradient: {
    width: w * 0.15,
    backgroundColor: 'red',
    height: h * 0.04,
  },
  specialtyContainer: {
    width: w * 0.6,
    backgroundColor: pallette.amethyst,
    height: h * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyName: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  doctorsListContainer: {
    paddingHorizontal: 15,
  },
});

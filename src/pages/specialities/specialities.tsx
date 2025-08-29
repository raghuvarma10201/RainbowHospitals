// ---------- MODULE IMPORTS ----------
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {DoctorCarousal, SpecialityGrid, SpecialtyCarousal} from '.';
import {Header, Footer, Loader, NotFound} from '../../components';

// ---------- OTHER IMPORTS ----------
import {ToastService} from '../../utils/service-handlers';
import {getDoctors, getSpecialities} from '../../services/common';
import {MainStackParamList} from '../../types/navigation';
import {h, pallette} from '../../constants/constants';
import {useApp} from '../../context/app-context';

// ---------- COMPONENT ----------
const Specialities: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {appointmentType} = route.params;
  const {branch} = useApp();
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadSpecialities();
  }, []);

  // ---------- CALLBACK FUNCTIONS ----------
  const loadSpecialities = async () => {
    await fetchData(
      getSpecialities,
      data => {
        setSpecialities(data);
        loadDoctors(data[0]?.speciality_id, appointmentType);
      },
      'specialities',
    );
  };

  const loadDoctors = async (specialityId: any, appointmentType: any) => {
    await fetchData(
      () =>
        getDoctors(
          '',
          specialityId,
          branch?.id.toString(),
          // '',
          '',
          appointmentType,
          1,
          10,
        ),
      data => {
        setDoctors(data.doctors);
      },
      'doctors',
    );
  };

  const fetchData = async (
    apiCall: () => Promise<any>,
    onSuccess: (data: any) => void,
    label: string,
  ) => {
    try {
      setLoading(true);
      const res = await apiCall();
      res?.status === 200
        ? onSuccess(res.data)
        : ToastService.error(
            'Error',
            res?.message || `Failed to fetch ${label}`,
          );
    } catch (e) {
      console.error(`Failed to load ${label}:`, e);
      ToastService.error('Error', `Unable to fetch ${label}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------- EVENT HANDLERS ----------
  const handleLeft = () => {
    setActiveSpecialtyIndex(prev =>
      prev === 0 ? specialities.length - 1 : prev - 1,
    );
    setActiveDocIndex(0);
  };

  const handleRight = () => {
    setActiveSpecialtyIndex(prev =>
      prev === specialities.length - 1 ? 0 : prev + 1,
    );
    setActiveDocIndex(0);
  };

  // ---------- LOADER ----------
  if (loading) return <Loader />;

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.quickActions}>
            <SpecialityGrid items={specialities} type={appointmentType} />
          </View>
        </View>
        {specialities.length > 0 && (
          <>
            <SpecialtyCarousal
              specialties={specialities}
              activeIndex={activeSpecialtyIndex}
              onLeftPress={handleLeft}
              onRightPress={handleRight}
              onTabPress={(index, specialityId) => {
                setActiveSpecialtyIndex(index);
                setActiveDocIndex(0);
                loadDoctors(specialityId, appointmentType);
              }}
            />
            {doctors.length > 0 ? (
              <DoctorCarousal
                doctors={doctors}
                activeindex={activeDocIndex}
                setActiveindex={setActiveDocIndex}
                height={h * 0.175}
                autoScrollEnabled={false}
                type={appointmentType}
                organizationId={branch?.organisation?.organisationid}
                nav={navigation}
              />
            ) : (
              <NotFound
                text={
                  'No doctors found in the branch with the selected specialty.'
                }
                margin={h * 0.05}
              />
            )}
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default Specialities;

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
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
});

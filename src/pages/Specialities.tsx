import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Highlight from '../components/HighlightingSlider';
import SpecialtySlider from '../components/SpecialitySlider';
import PaginatedGrid from '../components/GridComponent';
import {ToastService} from '../utils/ToastService';
import {getDoctors, getSpecialities} from '../services/common';
import Loader from '../components/Loader';
import {MainStackParamList} from '../navigation/types';
import {h, pallette} from '../Constants/Constant';
import {useApp} from '../context/AppContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Specialities: React.FC = ({route}: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {appointmentType} = route.params;
  const {branch} = useApp();
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };

  useEffect(() => {
    loadSpecialities();
  }, []);

  const loadSpecialities = async () => {
    await fetchData(
      getSpecialities,
      data => {
        setSpecialities(data);
        loadDoctors('', appointmentType);
      },
      'specialities',
    );
  };

  const loadDoctors = async (specialityId: any, appointmentType: any) => {
    await fetchData(
      () => getDoctors('', specialityId, '', '', appointmentType, 1, 10),
      data => setDoctors(data.doctors),
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

  if (loading) return <Loader />;

  return (
    <View style={styles.mainContainer}>
      <Header showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.quickActions}>
            <PaginatedGrid items={specialities} />
          </View>
        </View>
        {specialities.length > 0 && (
          <>
            <SpecialtySlider
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
            <Highlight
              doctors={doctors}
              activeindex={activeDocIndex}
              setActiveindex={setActiveDocIndex}
              height={h * 0.175}
              autoScrollEnabled={false}
              type={appointmentType}
              organizationId={branch?.id}
              nav={navigation}
            />
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

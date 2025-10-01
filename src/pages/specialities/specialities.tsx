// ---------- MODULE IMPORTS ----------
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {DoctorCarousal, SpecialityGrid, SpecialtyCarousal} from '.';
import {Header, Footer, Loader, NotFound} from '../../components';

// ---------- OTHER IMPORTS ----------
import {ToastService} from '../../utils/service-handlers';
import {getDoctors, getSpecialities} from '../../services/common';
import {MainStackParamList} from '../../types/navigation';
import {h, pallette, w} from '../../constants/constants';
import {useApp} from '../../context/app-context';
import SearchLocationBlock from '../../components/search-location-block';
import CategorySelection from '../../components/category-selection';
import {TextInput} from 'react-native-paper';
import {adjust} from '../../utils';

// ---------- COMPONENT ----------
const Specialities: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const headerRef = useRef<any>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [search, setSearch] = useState('');
  const {appointmentType} = route.params;
  const {branch, category} = useApp();
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [selectedSpecialityId, setSelectedSpecialityId] = useState<string>('');
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadSpecialities();
  }, [branch, category]);

  // ---------- CALLBACK FUNCTIONS ----------
  const loadSpecialities = async (filter?: string) => {
    await fetchData(
      () => getSpecialities(category.coe_id.toString()),
      data => {
        if (filter) {
          setSpecialities(
            data.filter((items: any) =>
              items.name.toLowerCase().includes(filter.toLowerCase()),
            ),
          );
        } else {
          setSpecialities(data);
        }
        // loadDoctors(
        //   selectedSpecialityId || data[0]?.speciality_id,
        //   appointmentType,
        // );
      },
      'specialities',
    );
  };

  const loadDoctors = async (specialityId: any, appointmentType: any) => {
    setSelectedSpecialityId(specialityId);
    await fetchData(
      () =>
        getDoctors(
          '',
          specialityId,
          branch?.id.toString(),
          // '',
          '',
          // appointmentType,
          '',
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
      // setLoading(true);
      const res = await apiCall();
      res?.status === 200
        ? onSuccess(res.data)
        : ToastService.error(
            'Error',
            res?.message || `Failed to fetch ${label}`,
          );
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      // setLoading(false);
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

  useEffect(() => {
    loadSpecialities(search);
  }, [search]);

  // ---------- LOADER ----------
  if (loading) return <Loader />;

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation ref={headerRef} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require('../../../assets/images/bottombg.png')}
          style={{
            height: h * 0.4,
            width: '100%',
            position: 'absolute',
            bottom: -(h * 0.1),
            right: 0,
            left: 0,
          }}
          resizeMode="cover"
        />
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../../assets/images/search-icon.png')}
                style={styles.icon}
              />
            </View>
            <TextInput
              mode="flat"
              style={styles.input}
              placeholder="Specialty"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={pallette.light_grey}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              theme={{
                colors: {
                  text: pallette.white,
                  placeholder: pallette.white,
                  background: 'transparent',
                },
              }}
            />
          </View>
          {/* <SearchLocationBlock style={styles.searchLocationBlock} /> */}
          <CategorySelection />

          <View style={styles.quickActions}>
            <SpecialityGrid items={specialities} type={appointmentType} />
          </View>
        </View>
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
    paddingHorizontal: w * 0.02,
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h * 0.02,
    width: w * 0.9,
    alignSelf: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
  searchContainer: {
    backgroundColor: pallette.white,
    flexDirection: 'row',
    borderRadius: w * 0.1,
    borderWidth: 0.3,
    borderColor: pallette.light_grey,
    paddingRight: w * 0.03,
    marginTop: h * 0.02,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: pallette.white,
    width: w * 0.1,
    height: h * 0.03,
    borderRadius: w * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '60%',
    width: '50%',
    resizeMode: 'contain',
    tintColor: pallette.medium_turquoise,
  },
  input: {
    height: h * 0.04,
    width: w * 0.8,
    color: pallette.black,
    backgroundColor: pallette.white,
    borderRadius: w * 0.1,
    fontSize: adjust(10),
    marginVertical: h * 0.002,
    fontFamily: 'ProximaNovaA-Regular',
  },
});

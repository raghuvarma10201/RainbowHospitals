import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Highlight from '../components/HighlightingSlider';
import SpecialtySlider from '../components/SpecialitySlider';
import {doctorData} from '../Constants/data';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PaginatedGrid from '../components/GridComponent';
import {ToastService} from '../utils/ToastService';
import {getDoctors, getSpecialities} from '../services/common';
import Loader from '../components/Loader';
import {MainStackParamList} from '../navigation/types';

const Specialities: React.FC = () => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Dashboard'
  >;
  const navigation = useNavigation<AppNavigationProp>();
  const [specialities, setSpecialities] = useState<any>([]);
  const specialties = Object.keys(doctorData) as Array<keyof typeof doctorData>;
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(1);
  const [activeDocIndex, setActiveDocIndex] = useState(2);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpecialities();
  }, []);

  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };

  const loadSpecialities = async () => {
    try {
      setLoading(true);
      const response = await getSpecialities();
      if (response && response.status == 200) {
        setLoading(false);
        setSpecialities(response.data);
        loadDoctors('', 'video');
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to load regions:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadDoctors = async (specialityId: any, appointmentType: any) => {
    try {
      setLoading(true);
      const response = await getDoctors(
        '',
        specialityId,
        '', //branch?.branch_id,
        '',
        appointmentType,
        1,
        10,
      );
      if (response && response.status == 200) {
        setLoading(false);
        setDoctors(response.data.doctors);
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to load Doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLeft = () => {
    setActiveSpecialtyIndex(prev =>
      prev === 0 ? specialties.length - 1 : prev - 1,
    );
    setActiveDocIndex(0);
  };

  const handleRight = () => {
    setActiveSpecialtyIndex(prev =>
      prev === specialties.length - 1 ? 0 : prev + 1,
    );
    setActiveDocIndex(0);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.quickActions}>
            <PaginatedGrid items={specialities} />
          </View>
        </View>
        {specialities?.length > 0 && (
          <>
            <SpecialtySlider
              specialties={specialities}
              activeIndex={activeSpecialtyIndex}
              onLeftPress={handleLeft}
              onRightPress={handleRight}
              onTabPress={(index, specialityId) => {
                setActiveSpecialtyIndex(index);
                setActiveDocIndex(0);
                loadDoctors(specialityId, 'video');
              }}
            />
            <Highlight
              doctors={doctors}
              activeindex={activeDocIndex}
              setActiveindex={setActiveDocIndex}
              height={h * 0.175}
              autoScrollEnabled={false}
              nav={navigateTo}
            />
          </>
        )}
      </ScrollView>
      {loading && <Loader />}
      <Footer />
    </View>
  );
};

export default Specialities;

const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 100,
  },

  container: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 0,
    paddingHorizontal: 10,
  },

  //Header
  header: {
    backgroundColor: '#3C2871',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  profileIconBlock: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //Header End

  helloCard: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 20,
  },

  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBlock: {
    height: 44,
    backgroundColor: '#4CC2BF',
    borderRadius: 100,
    paddingRight: 10,
    marginTop: 0,
    fontSize: 15,
    fontWeight: 400,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',
  },

  searchFormInput: {
    height: 44,
    borderWidth: 0,
    borderRadius: 100,
    paddingRight: 20,
    paddingLeft: 15,
    marginTop: 0,
    fontSize: 13,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNovaA-Regular',
    width: Dimensions.get('window').width * 0.43,
  },

  formInputIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 14,
    left: 10,
    tintColor: '#fff',
  },

  //

  dropdownSelect: {
    height: 30,
    paddingHorizontal: 10,
    paddingLeft: 30,
    marginTop: 5,
    color: '#fff',
    width: Dimensions.get('window').width * 0.43,
  },

  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    color: '#fff',
  },
  selectedTextContry: {
    fontSize: 13,
    color: '#fff',
  },

  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'left',
  },

  textHelloCard: {
    marginTop: 15,
    paddingHorizontal: 20,
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },

  actionItem: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 5,
  },
  actionItemIcon: {
    backgroundColor: '#3C2871',
    borderRadius: 10,
    padding: 15,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },

  iconAction: {
    width: 35,
    height: 35,
  },

  actionText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  activeActionItem: {
    backgroundColor: '#3C2871',
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },

  activeActionText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  activeIconAction: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
});

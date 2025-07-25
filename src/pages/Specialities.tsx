import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, Searchbar, TextInput, Icon, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banners from '../components/Slider';
import Highlight from '../components/HighlightingSlider';
import SpecialtyTabs from '../components/SpecialitySlider';
import SpecialtySlider from '../components/SpecialitySlider';
import { doctorData } from '../Constants/data';
import { MainStackParamList, useAuth } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PaginatedGrid from '../components/GridComponent';
import { ToastService } from '../utils/ToastService';
import { useApp } from '../context/AppContext';
import { getDoctors, getSpecialities } from '../services/common';
import Loader from '../components/Loader';

const local_data = [
  {
    value: '1',
    lable: 'location',
  },
  {
    value: '2',
    lable: 'location2',
  },
];

const Specialities: React.FC = () => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'Dashboard'
  >;
  const navigation = useNavigation<AppNavigationProp>();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');
  const [specialities, setSpecialities] = useState<any>([]);
  const specialties = Object.keys(doctorData) as Array<keyof typeof doctorData>;
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(1); // Default: Neurology
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const currentSpecialty = specialties[activeSpecialtyIndex];
  const currentDoctors = doctorData[currentSpecialty];
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateBranch, updateAllBranch, updateRegion } = useApp();
  const { setLoggedIn } = useAuth();

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
        loadDoctors('','video');
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
    const loadDoctors = async (specialityId : any, appointmentType : any) => {
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

  const [activeindex, setActiveindex] = useState(0);
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <View style={styles.mainContainer}>
          <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
    
        <View style={styles.container}>
          <View style={styles.helloCard}>
            <View style={styles.searchLocationBlock}>
              <View style={styles.searchBlock}>
                <TextInput
                  mode="flat"
                  style={[styles.searchFormInput, { color: 'white' }]}
                  placeholder="search"
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#fff"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      background: 'transparent',
                    },
                  }}
                />
                <Image
                  source={require('../../assets/images/search-icon.png')}
                  style={styles.formInputIcon}
                />
              </View>

              <View style={styles.searchBlock}>
                <Dropdown
                  style={styles.dropdownSelect}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={country}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  placeholder="Select Location"
                  containerStyle={styles.dropdownList}
                  activeColor="#fff"
                  onChange={e => setCountry(e.value)}
                />
                <Image
                  source={require('../../assets/images/map-icon.png')}
                  style={styles.formInputIcon}
                />
              </View>
            </View>
          </View>

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
              onTabPress={(index,specialityId) => {
                setActiveSpecialtyIndex(index);
                setActiveDocIndex(0);
                loadDoctors(specialityId,"video");

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

      <Footer />
    </View>
  );
};

export default Specialities;

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

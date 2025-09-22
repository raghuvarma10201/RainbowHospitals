// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {TextInput} from 'react-native-paper';

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
  const {branch, updateCategory} = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [changeLocation, setChangeLocation] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // ---------- CALLBACK FUNCTIONS ----------
  const loadDoctors = useCallback(
    async (filter?: string) => {
      try {
        setLoading(true);
        const response = await getDoctors(
          '',
          specialityId,
          branch?.id,
          // '',
          '',
          // appointmentType,
          '',
          1,
          10,
        );
        if (response?.status === 200) {
          if (filter) {
            setDoctors(
              response.data.doctors.filter((items: any) =>
                items.name.toLowerCase().includes(filter.toLowerCase()),
              ),
            );
          } else {
            setDoctors(response.data.doctors);
          }
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
    },
    [specialityId, appointmentType, branch],
  );

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const changeCategory = (cat: any) => {
    updateCategory(cat);
    navigation.goBack();
  };

  useEffect(() => {
    loadDoctors(search);
  }, [search]);

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
          <SearchLocationBlock style={styles.searchLocationBlock} />
          <CategorySelection
            screen={'docList'}
            changeCategory={changeCategory}
          />
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
              placeholder="Doctors"
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
          <View style={styles.specialtyRibbonContainer}>
            <LinearGradient
              colors={[pallette.white, pallette.black]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.gradient}
            />
            <View style={styles.specialtyContainer}>
              <Text style={styles.specialtyName}>{specialityName}</Text>
            </View>
            <LinearGradient
              colors={[pallette.black, pallette.white]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.gradient}
            />
          </View>
          <View style={[styles.doctorsListContainer]}>
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
    width: w * 0.9,
    alignSelf: 'center',
  },
  specialtyRibbonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: h * 0.04,
  },
  gradient: {
    width: w * 0.08,
    height: h * 0.045,
    opacity: 0.1,
  },
  specialtyContainer: {
    width: w * 0.75,
    backgroundColor: pallette.medium_turquoise,
    height: h * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: w * 0.01,
  },
  specialtyName: {
    fontSize: adjust(13),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Bold',
  },
  doctorsListContainer: {
    marginVertical: h * 0.04,
    paddingHorizontal: w * 0.01,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: w * 0.02,
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

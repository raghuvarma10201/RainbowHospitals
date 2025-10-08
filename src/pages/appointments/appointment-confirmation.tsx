import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Text, Modal, Portal} from 'react-native-paper';
import {Header, Footer, Banners} from '../../components';
import {pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types/navigation';
import {routes} from '../../utils/enums';
import {useApp} from '../../context/app-context';
import {getAppointments} from '../../services/common';
import {ToastService} from '../../utils';
import moment from 'moment';

const AppointmentConfirmed: React.FC = ({route}: any) => {
  const [activeindex, setActiveindex] = useState(0);
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {appointment, mrn} = route.params;
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredappointment, setFilteredappointment] = useState<any>({});
  const {branch} = useApp();

  const banners = [
    require('../../../assets/images/slide1.png'),
    require('../../../assets/images/slide1.png'),
    require('../../../assets/images/slide1.png'),
  ];

  useFocusEffect(
    useCallback(() => {
      loadAppointments(mrn);
    }, [branch]),
  );

  const loadAppointments = async (id: string | undefined) => {
    try {
      const payload = {
        // patientId: await AsyncStorage.getItem('mrn'),
        patientId: id || 'MAHTMP-182297',
        OrganisationUID: branch?.organisation?.organisationid.toString(),
      };

      const response = await getAppointments(payload);
      if (response && response.status == 200) {
        setAppointments(response.data);
        setFilteredappointment(
          response.data.filter(
            (item: any) => item?.BookingUID == appointment?.bookingId,
          )[0],
        );
      } else {
        ToastService.error('Error', response.message);
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.acTitle}>Appointment Confirmed</Text>
          <Text style={styles.acSubTitle}>
            Thank you for booking your appointment. We appreciate your trust and
            look forward to serving you.
          </Text>
          <View style={{marginVertical: h * 0.02}}>
            <View style={styles.rowItems}>
              <View
                style={[
                  styles.rowItem,
                  {borderTopWidth: 0.7, borderLeftWidth: 0.7},
                ]}>
                <Text style={styles.acSubTitle}>Booking Id</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>{appointment?.bookingId}</Text>
              </View>
            </View>
            <View style={styles.rowItems}>
              <View
                style={[
                  styles.rowItem,
                  {borderTopWidth: 0.7, borderLeftWidth: 0.7},
                ]}>
                <Text style={styles.acSubTitle}>Doctor Name</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>
                  {appointment?.doctor_name}
                </Text>
              </View>
            </View>
            <View style={styles.rowItems}>
              <View
                style={[
                  styles.rowItem,
                  {borderTopWidth: 0.7, borderLeftWidth: 0.7},
                ]}>
                <Text style={styles.acSubTitle}>Patient Id</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>{appointment?.mrn}</Text>
              </View>
            </View>
            <View style={styles.rowItems}>
              <View
                style={[
                  styles.rowItem,
                  {borderTopWidth: 0.7, borderLeftWidth: 0.7},
                ]}>
                <Text style={styles.acSubTitle}>Appointment Type</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>
                  {appointment?.AppointmentType}
                </Text>
              </View>
            </View>
            <View style={styles.rowItems}>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderTopWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderBottomWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>Scheduled Time</Text>
              </View>
              <View
                style={[
                  styles.rowItem,
                  {
                    borderWidth: 0.7,
                  },
                ]}>
                <Text style={styles.acSubTitle}>
                  {moment(filteredappointment?.SlotStartDttm).format(
                    'YYYY-MM-DD',
                  )}
                  ,{appointment?.time}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.acSubTitle}>
            Appointments can be rescheduled or cancelled only up to{' '}
            <Text style={{fontWeight: 'bold', color: pallette.red}}>
              2 hours{' '}
            </Text>
            before the scheduled appointment time. Changes or cancellations made
            within 2 hours of the appointment will not be accepted.
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 2,
                  routes: [
                    {name: routes.Dashboard},
                    {
                      name: routes.MyAppointments,
                      params: {mrn: appointment?.mrn},
                    },
                    {
                      name: routes.MyAppointmentDetails,
                      params: {
                        appointmentData: filteredappointment,
                        vitalsUpload: true,
                      },
                    },
                  ],
                }),
              )
            }
            style={styles.payBtn}>
            <Text style={styles.payBtnTxt}>Continue to Upload Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: routes.Dashboard}],
                }),
              )
            }
            style={styles.payBtn}>
            <Text style={styles.payBtnTxt}>Back To Home</Text>
          </TouchableOpacity>
          <View style={styles.imgTextGroup}>
            <View style={styles.imgTextBox}>
              <View style={styles.textbeforeDot}>
                <View style={styles.beforeDot} />
                <Text style={styles.imgTextTitle}>
                  To support you on your health journey, we invite you to
                  explore our Health Library for Mothers and Children.
                </Text>
              </View>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.subscribeBlock}
              onPress={() => showModal()}>
              <Image
                source={require('../../../assets/images/subscribe.png')}
                style={styles.subscribeImg}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderBlock}>
            <>
              <Banners
                images={banners}
                activeindex={activeindex}
                setActiveindex={setActiveindex}
                height={h * 0.2}
                resizeMode="cover"
                width={w * 0.95}
                marginVertical={w * 0.01}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: h * 0.02,
                }}>
                {banners?.map((banner, index) => (
                  <View
                    style={{
                      height: 8,
                      width: 8,
                      borderRadius: 5,
                      backgroundColor:
                        index == activeindex ? pallette.teal : 'grey',
                      marginHorizontal: w * 0.01,
                    }}
                    key={index}
                  />
                ))}
              </View>
            </>
          </View>
        </View>
      </ScrollView>
      <Footer />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalImageWrapp}>
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => hideModal()}>
            <Image
              source={require('../../../assets/images/close-icon.png')}
              style={styles.closeModalIcon}
            />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/images/rewards-points.png')}
            style={styles.modalImage}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default AppointmentConfirmed;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
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

  // imgTextGroup

  imgTextGroup: {
    paddingHorizontal: 10,
    position: 'relative',
    zIndex: 1,
  },

  imgTextBox: {
    width: '99%',
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 25,
    backgroundColor: pallette.dark_purple,
    borderRadius: 30,
  },
  textbeforeDot: {position: 'relative'},
  imgTextTitle: {
    fontSize: adjust(10),
    lineHeight: 18,
    fontWeight: 'normal',
    color: pallette.white,
    textAlign: 'center',
  },

  beforeDot: {
    position: 'absolute',
    top: '27%',
    right: -38,
    width: 30,
    height: 30,
    backgroundColor: pallette.teal,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: pallette.white,
  },

  subscribeBlock: {
    width: 250,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: pallette.white,
    borderRadius: 10,
    marginTop: -20,
    position: 'relative',
    zIndex: 1,
    padding: 10,
    paddingBottom: 0,
    margin: 'auto',
  },
  subscribeImg: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 85,
    resizeMode: 'contain',
  },
  acTitle: {
    fontSize: adjust(18),
    fontWeight: 'bold',
    color: pallette.black,
    textAlign: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  acSubTitle: {
    fontSize: adjust(12),
    color: pallette.black,
    textAlign: 'center',
    marginTop: 0,
    // marginBottom: '10%',
    width: '80%',
    margin: 'auto',
  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    borderRadius: w * 0.04,
    backgroundColor: pallette.dark_purple,
    marginVertical: 10,
  },
  payBtnTxt: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },

  sliderBlock: {
    marginTop: '10%',
  },
  modalImageWrapp: {
    width: '90%',
    padding: 10,
    backgroundColor: pallette.teal,
    marginHorizontal: 0,
    borderRadius: 20,
    position: 'absolute',
    left: '5%',
    right: '5%',
  },

  modalImage: {
    resizeMode: 'contain',
    width: '100%',
    height: Dimensions.get('window').height * 0.63,
  },

  closeModal: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: pallette.white,
    borderRadius: 50,
    padding: 5,
  },
  closeModalIcon: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  rowItems: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowItem: {
    padding: w * 0.02,
    borderColor: pallette.black,
    width: w * 0.4,
  },
});

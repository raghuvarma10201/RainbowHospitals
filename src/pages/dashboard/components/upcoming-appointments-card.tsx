import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Card} from 'react-native-paper';
import {upcomingApointment} from '../../../utils/types';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  isAfterTwoHours,
  isBeforeTwoHours,
  isPreviousDay,
} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {routes} from '../../../utils/enums';
import {MainStackParamList} from '../../../types/navigation';
import moment from 'moment';
import {useJitsi} from '../../../context/jitsi-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ add this import

interface Props {
  appointment: upcomingApointment;
  navigation: any;
}

const UpcomingAppointmentCard: React.FC<Props> = ({
  appointment,
  navigation,
}) => {
  const dateTime = moment().format();
  const {showJitsi} = useJitsi();

  const startVideoCall = () => {
    showJitsi({
      roomName: appointment?.roomId || 'SampleJitsiCall',
      token: '',
      serverURL: 'https://dev.rb.vc.demos.im/',
      patient: {
        name: appointment?.PatientName,
        mobile: appointment?.patient?.mobile_no,
        email: appointment?.patient?.email_id,
        time: formatAppointmentTime(appointment?.SlotStartDttm),
      },
      doctor: {
        name: appointment?.SessionName,
        time: formatAppointmentTime(appointment?.SlotStartDttm),
      },
      bookingId: appointment?.BookingUID,
      careprovider: appointment?.CareProviderCode,
    });
  };

  const handleChatPress = () => {
    // 👇 navigate to your chat screen
    navigateTo(
      navigation,
      routes.Chat as keyof MainStackParamList, // adjust route name if needed
      {appointmentId: appointment?.BookingUID},
    );
  };

  return (
    <View style={{position: 'relative'}}>
      <Card.Content
        style={[
          styles.upcomingAppBlockcard,
          {
            elevation: 0,
            backgroundColor: !isPreviousDay(appointment?.SlotStartDttm)
              ? pallette.pale_turquoise
              : '#EFEAF6',
          },
        ]}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('MyAppointmentDetails', {
              appointmentData: appointment,
            })
          }
          style={styles.row}>
          <View style={styles.row}>
            <Image
              source={
                appointment?.image
                  ? {uri: `${appointment?.image}`}
                  : {
                      uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                    }
              }
              style={styles.docImage}
            />

            <View style={styles.upcomingAppBlockcontent}>
              <Text
                style={[
                  styles.upcomingAppTitle,
                  {
                    backgroundColor: !isPreviousDay(appointment?.SlotStartDttm)
                      ? pallette.teal
                      : pallette.dark_purple,
                  },
                ]}>
                {isPreviousDay(appointment?.SlotStartDttm)
                  ? 'Previous Appointment'
                  : 'Upcoming Appointment'}
              </Text>
              <Text
                style={{
                  fontFamily: 'ProximaNovaA-Regular',
                  fontSize: adjust(12),
                  color: pallette.dark_purple,
                }}>
                {appointment?.CareProviderTitle} {appointment?.CareProviderName}
              </Text>
              <Text
                style={{
                  fontFamily: 'ProximaNovaA-Regular',
                  fontSize: adjust(8),
                  color: pallette.dark_purple,
                }}>
                {appointment?.SpecialtyName}
              </Text>
              <Text style={styles.upcomingTime}>
                {formatAppointmentDate(appointment?.SlotStartDttm)}{' '}
                {formatAppointmentTime(appointment?.SlotStartDttm)}
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.patientLabel}>
                  {' '}
                  Patient Name :{' '}
                  <Text style={styles.patientName}>
                    {appointment?.PatientName}
                  </Text>
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.appointmentTypeBlock}>
                  <Image
                    source={require('../../../../assets/images/user-icon.png')}
                    style={{width: 11, height: 11, marginRight: 1}}
                  />
                  <Text style={styles.appointmentTypeText}>
                    {' '}
                    {appointment?.AppointmentType}
                  </Text>
                </View>
                <Text style={styles.appointmentNumber}>
                  {' '}
                  #{appointment?.appointmentnumber}
                </Text>
              </View>

              <View
                style={[
                  styles.bottomUABlock,
                  {
                    backgroundColor: !isPreviousDay(appointment?.SlotStartDttm)
                      ? pallette.teal
                      : pallette.dark_purple,
                  },
                ]}>
                <>
                  <TouchableOpacity
                    disabled={
                      isBeforeTwoHours(
                        dateTime,
                        appointment?.SlotStartDttm,
                        2,
                      ) ||
                      isAfterTwoHours(
                        dateTime,
                        appointment?.SlotStartDttm,
                        0.25,
                      )
                    }
                    onPress={startVideoCall}>
                    <Text
                      style={[
                        styles.rescheduleBt,
                        {
                          color:
                            isBeforeTwoHours(
                              dateTime,
                              appointment?.SlotStartDttm,
                              2,
                            ) ||
                            isAfterTwoHours(
                              dateTime,
                              appointment?.SlotStartDttm,
                              0.25,
                            )
                              ? pallette.dark_grey
                              : pallette.white,
                        },
                      ]}>
                      Join Call
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
                <TouchableOpacity
                  disabled={
                    !isBeforeTwoHours(dateTime, appointment?.SlotStartDttm, 2)
                  }
                  onPress={() => {
                    navigateTo(
                      navigation,
                      routes.DoctorSlots as keyof MainStackParamList,
                      {
                        doctorId: appointment?.id,
                        appointmentType: appointment?.AppointmentType,
                        appointmentnumber: appointment?.appointmentnumber,
                        OrganisationID: appointment?.OrganisationUID,
                        patientId: appointment?.PatientID,
                        paid:
                          appointment?.payment_type?.toUpperCase() == 'PAYU',
                      },
                    );
                  }}>
                  <Text
                    style={[
                      styles.rescheduleBt,
                      {
                        color: !isBeforeTwoHours(
                          dateTime,
                          appointment?.SlotStartDttm,
                          2,
                        )
                          ? pallette.dark_grey
                          : pallette.white,
                      },
                    ]}>
                    Reschedule
                  </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity
                  disabled={
                    !isBeforeTwoHours(dateTime, appointment?.SlotStartDttm, 2)
                  }
                  onPress={() =>
                    navigateTo(
                      navigation,
                      routes.MyAppointmentDetails as keyof MainStackParamList,
                      {
                        appointmentData: appointment,
                        cancel: true,
                      },
                    )
                  }>
                  <Text
                    style={[
                      styles.cancelBtn,
                      {
                        color: !isBeforeTwoHours(
                          dateTime,
                          appointment?.SlotStartDttm,
                          2,
                        )
                          ? pallette.dark_grey
                          : pallette.white,
                      },
                    ]}>
                    {' '}
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Card.Content>

      {/* ✅ Floating Chat Button */}
      {!isPreviousDay(appointment?.SlotStartDttm) &&
      appointment?.unreadCount ? (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
          activeOpacity={0.8}>
          <Icon name="chat" size={24} color={pallette.teal} />
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {appointment?.unreadCount > 99 ? '99+' : appointment?.unreadCount}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingAppBlockcard: {
    flex: 1,
    marginTop: 16,
    marginBottom: 32,
    padding: 10,
    borderRadius: 12,
    elevation: 0,
    borderWidth: 0,
    minWidth: w * 0.95,
    marginRight: w * 0.03,
    marginLeft: w * 0.021,
    width: w * 0.9,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  docImage: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginRight: 12,
    marginTop: 40,
    marginBottom: -40,
  },
  upcomingAppBlockcontent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 7,
  },
  upcomingAppTitle: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.white,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: -30,
    marginBottom: 7,
    textAlign: 'center',
  },
  infoRow: {flexDirection: 'row', alignItems: 'center', marginLeft: 2},
  patientLabel: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.dark_purple,
    marginBottom: 5,
  },
  patientName: {
    fontWeight: 'bold',
    color: pallette.black,
    fontSize: adjust(14),
  },
  appointmentTypeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  appointmentTypeText: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.dark_purple,
  },
  appointmentNumber: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.dark_purple,
  },
  rescheduleBt: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.white,
  },
  cancelBtn: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    color: pallette.white,
    paddingLeft: 5,
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: pallette.pale_turquoise,
  },
  upcomingTime: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(10),
    backgroundColor: pallette.white,
    color: pallette.dark_purple,
    textAlign: 'center',
    padding: 4,
    marginVertical: 7,
    borderRadius: 4,
  },
  bottomUABlock: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: pallette.dark_purple,
    padding: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 20,
    marginBottom: -50,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  chatButton: {
    position: 'absolute',
    top: h * 0.04,
    right: w * 0.1,
    width: w * 0.1,
    height: w * 0.1,
    borderRadius: w * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },

  unreadBadge: {
    position: 'absolute',
    top: 10,
    borderRadius: 10,
    minWidth: w * 0.04,
    height: w * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  unreadText: {
    color: 'white',
    fontSize: adjust(10),
    fontWeight: 'bold',
  },
});

export default React.memo(UpcomingAppointmentCard);

import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {upcomingApointment} from '../../../utils/types';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  isBeforeTwoHours,
} from '../../../utils/common-functions';
import {pallette, w} from '../../../constants/constants';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {routes} from '../../../utils/enums';
import {MainStackParamList} from '../../../types/navigation';
import moment from 'moment';

interface Props {
  appointment: upcomingApointment;
  navigation: any;
}

const UpcomingAppointmentCard: React.FC<Props> = ({
  appointment,
  navigation,
}) => {
  const dateTime = moment().format();
  return (
    <Card.Content style={[styles.upcomingAppBlockcard, {elevation: 0}]}>
      <TouchableOpacity
        // disabled
        onPress={() =>
          navigation.navigate('MyAppointmentDetails', {
            appointmentData: appointment,
          })
        }
        style={styles.row}>
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
          <Text style={styles.upcomingAppTitle}>Upcoming Appointment</Text>
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 2,
            }}>
            <Text
              style={{
                fontFamily: 'ProximaNovaA-Regular',
                fontSize: adjust(10),
                color: pallette.dark_purple,
                marginBottom: 5,
              }}>
              {' '}
              Patient Name :{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: pallette.black,
                  fontSize: adjust(14),
                }}>
                {appointment?.PatientName}
              </Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 15,
              }}>
              <Image
                source={require('../../../../assets/images/user-icon.png')}
                style={{width: 11, height: 11, marginRight: 1}}
              />
              <Text
                style={{
                  fontFamily: 'ProximaNovaA-Regular',
                  fontSize: adjust(10),
                  color: pallette.dark_purple,
                }}>
                {' '}
                {appointment?.AppointmentType}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'ProximaNovaA-Regular',
                fontSize: adjust(10),
                color: pallette.dark_purple,
              }}>
              {' '}
              #{appointment?.appointmentnumber}
            </Text>
          </View>

          <View
            style={[
              styles.bottomUABlock,
              {
                backgroundColor: isBeforeTwoHours(
                  dateTime,
                  appointment?.SlotStartDttm,
                  2,
                )
                  ? pallette.dark_purple
                  : pallette.dark_grey,
              },
            ]}>
            {!isBeforeTwoHours(dateTime, appointment?.SlotStartDttm, 0.25) && (
              <>
                <TouchableOpacity
                  disabled={isBeforeTwoHours(
                    dateTime,
                    appointment?.SlotStartDttm,
                    2,
                  )}
                  onPress={() =>
                    navigation.navigate('MyAppointmentDetails', {
                      appointmentData: appointment,
                    })
                  }>
                  <Text style={styles.rescheduleBt}>Join Call</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}
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
                    paid: appointment?.payment_type?.toUpperCase() == 'PAYU',
                  },
                );
              }}>
              <Text style={styles.rescheduleBt}>Reschedule</Text>
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
              <Text style={styles.cancelBtn}> Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  upcomingAppBlockcard: {
    flex: 1,
    marginTop: 16,
    marginBottom: 32,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#EFEAF6',
    elevation: 0,
    borderWidth: 0,
    minWidth: w * 0.95,
    marginLeft: w * 0.02,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

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
    backgroundColor: pallette.dark_purple,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: -30,
    marginBottom: 7,
    textAlign: 'center',
  },
  providerText: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
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
});

export default React.memo(UpcomingAppointmentCard);

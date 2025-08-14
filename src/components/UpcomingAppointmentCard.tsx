import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {upcomingApointment} from '../utils/types';
import {formatAppointmentDate, formatAppointmentTime} from '../utils/dateTime';
import {pallette, w} from '../Constants/Constant';

interface Props {
  appointment: upcomingApointment;
  navigation: any;
}

const UpcomingAppointmentCard: React.FC<Props> = ({
  appointment,
  navigation,
}) => {
  return (
    <Card.Content style={[styles.upcomingAppBlockcard, {elevation: 0}]}>
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
          <Text style={styles.upcomingAppTitle}>Upcoming Appointment</Text>
          <Text
            style={{
              fontFamily: 'ProximaNovaA-Regular',
              fontSize: 12,
              color: pallette.app_purple,
            }}>
            {appointment?.CareProviderTitle} {appointment?.CareProviderName}
          </Text>
          <Text
            style={{
              fontFamily: 'ProximaNovaA-Regular',
              fontSize: 8,
              color: pallette.app_purple,
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 15,
              }}>
              <Image
                source={require('../../assets/images/user-icon.png')}
                style={{width: 11, height: 11, marginRight: 1}}
              />
              <Text
                style={{
                  fontFamily: 'ProximaNovaA-Regular',
                  fontSize: 11,
                  color: pallette.app_purple,
                }}>
                {' '}
                {appointment?.AppointmentType}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'ProximaNovaA-Regular',
                fontSize: 11,
                color: pallette.app_purple,
              }}>
              {' '}
              #{appointment?.appointmentnumber}
            </Text>
          </View>

          <View style={styles.bottomUABlock}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DoctorSlots', {
                  doctorId: appointment?.id,
                  appointmentType: appointment?.AppointmentType,
                  appointmentnumber: appointment?.appointmentnumber,
                  OrganisationID: appointment?.OrganisationUID,
                })
              }>
              <Text style={styles.rescheduleBt}>Reschedule</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'ProximaNovaA-Regular',
                  fontSize: 11,
                  color: pallette.white,
                  paddingLeft: 5,
                }}>
                {' '}
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    fontSize: 10,
    color: pallette.white,
    backgroundColor: pallette.app_purple,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: -10,
    marginBottom: 7,
    textAlign: 'center',
  },
  providerText: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 12,
  },
  rescheduleBt: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 11,
    color: pallette.white,
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: pallette.app_light_green,
  },
  upcomingTime: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 11,
    backgroundColor: pallette.white,
    color: pallette.app_purple,
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
    backgroundColor: pallette.app_purple,
    padding: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
    marginBottom: -50,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});

export default UpcomingAppointmentCard;

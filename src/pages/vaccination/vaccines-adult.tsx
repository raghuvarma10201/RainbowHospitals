import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React from 'react';

import {Header} from '../../components';
import Footer from '../../components/footer';
import {h, pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';

const vaccinationData = [
  {age: 'Birth', vaccine: 'BCG, OPV, Hepatitis B (1st)'},
  {
    age: '6 Weeks',
    vaccine:
      'DTwP / DTaP + Hib + OPV / IPV Pneumococcal Vaccine (1st) Hepatitis B (2nd) Rotavirus (1st)',
  },
  {
    age: '10 Weeks',
    vaccine:
      'DTwP / DTaP + Hib + OPV / IPV Pneumococcal Vaccine (2nd) Rotavirus (2nd)',
  },
  {
    age: '14 Weeks',
    vaccine:
      'DTwP / DTaP + Hib + OPV / IPV Pneumococcal Vaccine (3rd) Rotavirus (3rd)',
  },
  {age: '6 Months', vaccine: 'Hepatitis B (3rd), OPV First Dental Check Up'},
  {age: '9 Months', vaccine: 'Measles Vaccine, OPV'},
  {age: '12 Months', vaccine: 'Pneumococcal (4th Dose) Hepatitis A (1st)'},
  {age: '15 Months', vaccine: 'MMR (1st) Chicken Pox (1st)'},
  {
    age: '18 Months',
    vaccine: 'DTwP / DTaP + OPV / IPV + Hib (1st Booster) Hepatitis A (2nd)',
  },
  {age: '2 Years', vaccine: 'Typhoid Vaccine'},
  {age: '3 Years', vaccine: 'MMR (2nd), Chicken Pox (2nd)'},
  {
    age: '5 Years',
    vaccine: 'DTwP / DTaP / OPV / IPV (2nd Booster) Typhoid Vaccine',
  },
  {age: '8 Years', vaccine: 'Typhoid Vaccine'},
  {age: '10 Years', vaccine: 'Tdap / dT / TT'},
  {
    age: '13 to 26 Years',
    vaccine:
      'HPV 1st Dose HPV 2nd Dose (2 months from 1st Dose) HPV 3rd Dose (6 months from 1st Dose)',
  },
];

const VaccinesAdult: React.FC = () => {
  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <View
              style={{
                padding: w * 0.03,
                backgroundColor: '#81388B20',
                width: w * 0.9,
                alignSelf: 'center',
                borderRadius: w * 0.02,
                marginVertical: h * 0.02,
              }}>
              <Text
                style={{
                  fontSize: adjust(12),
                  textAlign: 'center',
                  fontFamily: 'ProximaNovaA-Regular',
                  color: pallette.black,
                }}>
                {' '}
                For any general information (Vaccine availability, cost, etc)
                about Vaccination, please contact:
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${18002122}`)}
                style={{
                  padding: w * 0.02,
                  backgroundColor: pallette.white,
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: w * 0.5,
                  alignSelf: 'center',
                  marginVertical: h * 0.01,
                  gap: w * 0.02,
                }}>
                <Image
                  source={require('../../../assets/images/footer-call-icon.png')}
                  style={{
                    width: w * 0.06,
                    height: w * 0.06,
                    tintColor: pallette.black,
                  }}
                />
                <Text
                  style={{
                    fontSize: adjust(12),
                    textAlign: 'center',
                    fontFamily: 'ProximaNovaA-Regular',
                    color: pallette.black,
                  }}>
                  1800 2122
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subTitle}>
              {' '}
              Vaccines for women are vital for protecting health at every stage
              of life
            </Text>

            <View style={styles.formContainer}>
              {/* <Text style={styles.formTitle}>Book Vaccine </Text> */}

              <Text style={styles.title}>Vaccination Chart</Text>

              <View style={styles.header}>
                <Text style={[styles.cell, styles.headerCell]}>
                  Age of the Child
                </Text>
                <Text style={[styles.cell, styles.headerCell]}>
                  Name of the Vaccine
                </Text>
              </View>

              {vaccinationData.map((item, index) => (
                <View
                  key={index}
                  style={[styles.row, index % 2 ? styles.altRow : null]}>
                  <Text style={[styles.cell, styles.age]}>{item.age}</Text>
                  <Text style={[styles.cell, styles.vaccine]}>
                    {item.vaccine}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default VaccinesAdult;

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
  subTitle: {
    fontSize: adjust(12),
    textAlign: 'center',
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formTitle: {
    fontSize: adjust(16),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: pallette.white,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  chart: {
    flex: 1,
    padding: 10,
    backgroundColor: pallette.dark_purple,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: pallette.dark_purple,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: pallette.dark_purple,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    color: pallette.white,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: pallette.dark_grey,
  },
  altRow: {
    backgroundColor: pallette.pale_turquoise,
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlignVertical: 'center',
  },
  age: {
    flex: 0.8,
    fontWeight: 'bold',
    color: pallette.dark_purple,
  },
  vaccine: {
    flex: 2,
    color: pallette.black,
  },
});

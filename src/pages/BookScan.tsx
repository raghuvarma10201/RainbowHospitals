import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text, Banner, Modal, Portal} from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {pallette} from '../Constants/Constant';

const BookScan: React.FC = () => {
  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <Text style={styles.subTitle}> SCANS</Text>

            <View style={styles.quickActions}>
              <View style={styles.actionItem}>
                <View style={styles.activeActionItemIcon}>
                  <Image
                    source={require('../../assets/images/birth-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>1st Trimester Screening</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Amniocentesis</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Anamoly Scan or TIFA Scan</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>
                  Cervical Length Measurement
                </Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Doppler Scan</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>
                  Endometrial Thickness Scan
                </Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Book Vaccine </Text>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}> Type of Scan</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}> Name</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Select Location</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}> Date </Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Time </Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.vaccinesDescription}>
                <Text style={styles.vaccinesDesTitle}>
                  Cervical L ength Measurement
                </Text>
                <Text style={styles.vaccinesDesText}>
                  During a cervical length scan, an ultrasound is used to
                  measure the length of the cervix. The procedure is typically
                  performed transvaginally, as this provides a more accurate
                  measurement compared to an abdominal ultrasound. The
                  ultrasound probe is inserted into the vagina to visualize and
                  measure the length of the cervix.
                </Text>
              </View>

              <View style={styles.formRow}>
                <TouchableOpacity style={styles.formButton}>
                  <Text style={styles.formButtonText}>Book Scan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default BookScan;

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
    fontSize: 14,
    textAlign: 'center',
    marginTop: '10%',
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    alignSelf: 'center',
  },

  actionItem: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 12,
  },
  actionItemIcon: {
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    padding: 15,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },

  activeActionItemIcon: {
    backgroundColor: pallette.app_green,
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
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '100%',
    paddingVertical: 5,
  },

  formTitle: {
    fontSize: 18,
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

  formRow: {
    marginBottom: 12,
  },

  formLabel: {
    fontSize: 12,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 5,
  },

  formInput: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: pallette.app_light_green,
    borderRadius: 10,
    padding: 10,
    backgroundColor: pallette.app_light_green,
  },

  formButton: {
    backgroundColor: pallette.app_purple,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  formButtonText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },

  vaccinesDescription: {
    backgroundColor: pallette.white,
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  vaccinesDesTitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 6,
  },

  vaccinesDesText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 10,
  },
});

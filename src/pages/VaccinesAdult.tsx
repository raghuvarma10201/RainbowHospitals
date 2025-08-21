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

import Header from '../components/header';
import Footer from '../components/footer';
import {pallette} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

const VaccinesAdult: React.FC = () => {
  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <Text style={styles.subTitle}>
              {' '}
              Vaccines for women are vital for protecting health at every stage
              of life
            </Text>

            <View style={styles.quickActions}>
              <View style={styles.actionItem}>
                <View style={styles.activeActionItemIcon}>
                  <Image
                    source={require('../../assets/images/tetanus-diphtheria-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Tetanus & Diphtheria</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Hepatitis B</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Influenza (Flu)</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>
                  HPV (Human Papilloma Virus)
                </Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Shingles (Herpes Zoster)</Text>
              </View>

              <View style={styles.actionItem}>
                <View style={styles.actionItemIcon}>
                  <Image
                    source={require('../../assets/images/plus-icon.png')}
                    style={styles.iconAction}
                  />
                </View>
                <Text style={styles.actionText}>Pneumococcal</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Book Vaccine </Text>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Age*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Location*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Vaccine Type*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}> Date</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Time</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Phone No.*</Text>
                <TextInput style={styles.formInput} />
              </View>

              <View style={styles.vaccinesDescription}>
                <Text style={styles.vaccinesDesTitle}>
                  Tetanus & Diphtheria
                </Text>
                <Text style={styles.vaccinesDesText}>
                  Recommended For: All adults, every 10 years Risk if
                  unvaccinated: Wound infections, breathing issues
                </Text>
              </View>

              <View style={styles.formRow}>
                <TouchableOpacity style={styles.formButton}>
                  <Text style={styles.formButtonText}>Book Vaccine</Text>
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
    fontSize: adjust(10),
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    width: '100%',
    paddingVertical: 5,
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

  formRow: {
    marginBottom: 12,
  },

  formLabel: {
    fontSize: adjust(10),
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
    fontSize: adjust(12),
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
    fontSize: adjust(14),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 6,
  },

  vaccinesDesText: {
    fontSize: adjust(10),
    textAlign: 'center',
    marginTop: 0,
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 10,
  },
});

import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {adjust, API_IMG_URL, routes} from '../../utils';
import {h, pallette, w} from '../../constants/constants';
import {Header} from '../../components';
import {
  fetchFamilyMembers,
  getPatientMedicalRecords,
} from '../../services/common';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FamilyMember} from '../../utils/types';
import ThreeDotLoader from '../../components/three-dot-loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PdfPreview} from '../../components/pdf-preview';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import {ActivityIndicator} from 'react-native-paper';

const PatientRecords: FC = ({navigation, route}: any) => {
  const {mrn} = route?.params;
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    mrn || '',
  );
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [patientVisits, setPatientVisits] = useState<any[]>([]);
  const [filePaths, setFilePaths] = useState<{[key: number]: string}>({});
  const [preview, setPreview] = useState<any>();

  // Default date range: last 15 days
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  const [startDate, setStartDate] = useState<Date | null>(fifteenDaysAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Cleanup when navigating away
  useFocusEffect(
    useCallback(() => {
      // Focused
      return () => {
        // On blur - clear any loaded files and accordion
        setFilePaths({});
        setOpenIndex(-1);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getFamilyMembers();
    }, []),
  );

  useEffect(() => {
    if (startDate && endDate) {
      fetchVisits();
    }
  }, [startDate, endDate]);

  const getFamilyMembers = useCallback(async () => {
    try {
      const response = await fetchFamilyMembers({
        MobileNo: await AsyncStorage.getItem('mobileNumber'),
      });

      if (response?.status === 200) {
        setFamilyMembers(response.data);
        fetchVisits();
      }
    } catch (error: any) {
      console.error('Error fetching family members:', error);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const response = await getPatientMedicalRecords({
        mrn: mrn,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      });

      if (response?.status == 200 && response.success) {
        setPatientVisits(response?.data);
        if (response.data.length > 0) {
          setOpenIndex(0);
          loadPdfForIndex(0, response.data[0]);
        }
      } else {
        setPatientVisits([]);
      }
    } catch (error: any) {
      console.error('Error fetching visits:', error);
      setPatientVisits([]);
      setLoading(false);
    }
  }, [startDate, endDate]);

  const loadPdfForIndex = async (index: number, visit: any) => {
    try {
      if (!visit?.prescription_file) return;
      if (filePaths[index]) return; // Already loaded
      const res = await RNFetchBlob.config({fileCache: true}).fetch(
        'GET',
        `${API_IMG_URL}${visit?.prescription_file}`,
      );
      setFilePaths(prev => ({...prev, [index]: res.path()}));
    } catch (err) {
      console.error('Error loading PDF:', err);
    }
  };

  const AccordionItem = ({title, children, expanded, onToggle}: any) => {
    return (
      <View style={styles.accCard}>
        <TouchableOpacity
          style={styles.accHeader}
          onPress={onToggle}
          activeOpacity={0.8}>
          <Text style={styles.accTitleStyle}>{title}</Text>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#333"
          />
        </TouchableOpacity>

        {expanded && <View style={styles.accBody}>{children}</View>}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: h * 0.03,
        backgroundColor: pallette.white,
      }}>
      <Header showLocation />
      <View style={{padding: w * 0.02}}>
        {/* Patient Dropdown */}
        <Dropdown
          style={styles.dropdownSelect}
          selectedTextStyle={styles.selectedTextContry}
          placeholderStyle={styles.placeholderCountry}
          maxHeight={200}
          value={selectedPatient}
          data={familyMembers}
          valueField="PatientID"
          labelField="PatientName"
          placeholder="Select Patient"
          containerStyle={styles.dropdownList}
          itemTextStyle={styles.selectedTextContry}
          activeColor={pallette.pale_turquoise}
          iconColor={pallette.black}
          onChange={(item: FamilyMember) => {
            setSelectedPatient(item.PatientID);
          }}
        />

        {/* Date Filters */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => setShowStartPicker(true)}>
            <Text style={styles.datePickerText}>
              {startDate
                ? moment(startDate).format('DD MMM YYYY')
                : 'Select Start Date'}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) {
                  let newStart = date;
                  let newEnd = endDate;

                  if (
                    newEnd &&
                    moment(newEnd).diff(moment(newStart), 'days') > 15
                  ) {
                    newEnd = moment(newStart).add(15, 'days').toDate();
                  }
                  setStartDate(newStart);
                  setEndDate(newEnd);
                }
              }}
            />
          )}

          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => setShowEndPicker(true)}>
            <Text style={styles.datePickerText}>
              {endDate
                ? moment(endDate).format('DD MMM YYYY')
                : 'Select End Date'}
            </Text>
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={today}
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) {
                  let newEnd = date;
                  let newStart = startDate;
                  if (
                    newStart &&
                    moment(newEnd).diff(moment(newStart), 'days') > 15
                  ) {
                    newStart = moment(newEnd).subtract(15, 'days').toDate();
                  }
                  setEndDate(newEnd);
                  setStartDate(newStart);
                }
              }}
            />
          )}
        </View>

        {/* Accordion List */}
        {patientVisits.length ? (
          patientVisits.map((visit: any, index: number) => (
            <AccordionItem
              key={index}
              title={`${moment(visit?.date).format('DD MMM')}'${moment().format(
                'YY',
              )}`}
              expanded={openIndex === index}
              onToggle={async () => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                if (openIndex === index) {
                  setOpenIndex(-1);
                } else {
                  setOpenIndex(index);
                  await loadPdfForIndex(index, visit);
                }
              }}>
              {loading ? (
                <View style={{marginVertical: h * 0.02}}>
                  <ThreeDotLoader />
                </View>
              ) : (
                <View
                  style={{
                    borderColor: pallette.light_grey,
                    borderRadius: w * 0.02,
                    marginBottom: h * 0.01,
                  }}>
                  <View
                    style={{
                      padding: w * 0.02,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: adjust(12),
                        color: pallette.white,
                        textTransform: 'capitalize',
                        backgroundColor: pallette.amethyst,
                        padding: 4,
                        borderRadius: 5,
                      }}>
                      Prescription
                    </Text>
                    <Text
                      style={{
                        fontSize: adjust(12),
                        color: pallette.black,
                        textTransform: 'capitalize',
                      }}>
                      Record Date : {moment(visit.date).format('DD MMM')}'
                      {moment().format('YY')}
                    </Text>
                  </View>

                  {/* PDF Preview */}
                  <TouchableOpacity
                    style={{
                      height: h * 0.2,
                      width: w * 0.9,
                      alignSelf: 'center',
                      borderWidth: 0.7,
                      borderColor: pallette.dark_grey,
                      borderRadius: w * 0.02,
                    }}
                    onPress={() =>
                      navigation.navigate(routes.PDFPreview, {
                        source: {
                          uri: `${API_IMG_URL}${visit?.prescription_file}`,
                        },
                      })
                    }>
                    {filePaths[index] && filePaths[index].startsWith('/') ? (
                      <Pdf
                        source={{uri: `file://${filePaths[index]}`}}
                        fitPolicy={0}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: w * 0.02,
                        }}
                        onError={err => console.error('PDF load error:', err)}
                      />
                    ) : (
                      <ActivityIndicator size="small" color="#000" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: w * 0.03,
                      width: w * 0.9,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 0.7,
                      borderColor: pallette.dark_purple,
                      borderRadius: w * 0.03,
                      marginVertical: h * 0.01,
                    }}
                    onPress={() =>
                      navigation.navigate(routes.PDFPreview, {
                        source: {
                          uri: `${API_IMG_URL}${visit?.prescription_file}`,
                        },
                      })
                    }>
                    <Text
                      style={{
                        fontSize: adjust(12),
                        color: pallette.dark_purple,
                        textTransform: 'capitalize',
                      }}>
                      View Complete Report
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </AccordionItem>
          ))
        ) : (
          <ActivityIndicator size="small" color="#000" />
        )}

        {preview && (
          <PdfPreview
            source={
              Platform.OS === 'android'
                ? {uri: `bundle-assets://${preview}`}
                : require('../../../android/app/src/main/assets/docs/DischargeSummary.pdf')
            }
            back={() => setPreview(undefined)}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default PatientRecords;

const styles = StyleSheet.create({
  dropdownSelect: {
    height: h * 0.04,
    width: '100%',
    color: '#383838',
    borderWidth: 0.7,
    borderColor: pallette.dark_grey,
    paddingHorizontal: w * 0.02,
    borderRadius: w * 0.02,
    marginBottom: h * 0.02,
  },
  placeholderCountry: {
    fontFamily: 'Poppins-Regular',
    fontSize: adjust(12),
    color: '#000',
  },
  selectedTextContry: {
    fontSize: adjust(12),
    color: pallette.black,
  },
  dropdownList: {
    fontFamily: 'Poppins-Regular',
    fontSize: adjust(10),
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'left',
    color: pallette.black,
  },
  datePickerBtn: {
    borderWidth: 0.7,
    borderColor: pallette.dark_grey,
    padding: w * 0.025,
    borderRadius: w * 0.02,
    marginBottom: h * 0.015,
    backgroundColor: '#f9f9f9',
    width: w * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: adjust(12),
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  accCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 10,
    elevation: 2,
    overflow: 'hidden',
    padding: w * 0.02,
  },
  accHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 5,
  },
  accTitleStyle: {
    fontSize: adjust(16),
    fontFamily: 'Poppins-Bold',
    color: pallette.dark_purple,
  },
  accBody: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

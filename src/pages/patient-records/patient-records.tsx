import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {adjust, ToastService} from '../../utils';
import {h, pallette, w} from '../../constants/constants';
import Header from '../../components/header';
import {
  fetchFamilyMembers,
  getAllLabReports,
  getPatientMedicalRecords,
  getPatientVisits,
  getVisitPrescriptions,
} from '../../services/common';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import RNBlobUtil from 'react-native-blob-util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FamilyMember} from '../../utils/types';
import ThreeDotLoader from '../../components/three-dot-loader';
import DateTimePicker from '@react-native-community/datetimepicker';

const PatientRecords: FC = ({route}: any) => {
  const {mrn} = route?.params;
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    mrn || '',
  );
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [patientVisits, setPatientVisits] = useState<any[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<any[]>([]);
  const [labreports, setLabreports] = useState({
    file: '',
    documentname: '',
    filetype: '',
  });
  const [radiologyreports, setRadiologyreports] = useState({
    file: '',
    documentname: '',
    filetype: '',
  });
  const [prescription, setPrescription] = useState({
    file: '',
    documentname: '',
    filetype: '',
  });

  const [selectedReportType, setSelectedReportType] = useState<
    'lab' | 'radiology' | 'prescription' | null
  >('lab');

  // Default date range: last 15 days
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  const [startDate, setStartDate] = useState<Date | null>(fifteenDaysAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getFamilyMembers();
      fetchVisits();
    }, []),
  );

  const getFamilyMembers = useCallback(async () => {
    try {
      const response = await fetchFamilyMembers({
        MobileNo: await AsyncStorage.getItem('mobileNumber'),
      });

      if (response?.status === 200) {
        setFamilyMembers(response.data);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Unable to fetch patients',
        );
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const response = await getPatientMedicalRecords({
        mrn: 'BAH-00519630',
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      });
      if (response?.status == 200 && response.success) {
        const visitOptions = response.data.map((e: any) => ({
          ...e,
          label: `${e.VisitID} | ${moment(e.VisitStartDttm).format(
            'DD MMM YYYY',
          )}`,
          value: e.VisitID,
        }));
        setPatientVisits(visitOptions);
        setFilteredVisits(visitOptions);
        fetchReports(visitOptions[0]);
        // fetchPrescription(visitOptions[0]);
      } else {
        setPatientVisits([]);
        setFilteredVisits([]);
      }
    } catch (error: any) {
      console.error('Error fetching visits:', error);
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
      setPatientVisits([]);
      setFilteredVisits([]);
    }
  }, [startDate, endDate]);

  const fetchReports = useCallback(async (item: any) => {
    try {
      setLoading(true);
      const response = await getAllLabReports({
        orguid: item?.OrgUID,
        patientuid: item?.PatientUID,
        patientvisituid: item?.PatientVisitUID,
      });

      setLabreports(response.labResult);
      setRadiologyreports(response.radiologyResult);
      setPrescription(response.prescriptionResult || {});
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // const fetchPrescription = useCallback(async (item: any) => {
  //   try {
  //     setLoading(true);
  //     const response = await getVisitPrescriptions({
  //       orguid: item?.OrgUID,
  //       patientuid: item?.PatientUID,
  //       patientvisituid: item?.PatientVisitUID,
  //     });

  //     setLabreports(response.labResult);
  //     setRadiologyreports(response.radiologyResult);
  //     setPrescription(response.prescriptionResult || {});
  //   } catch (error: any) {
  //     console.error('Error fetching reports:', error);
  //     ToastService.error(
  //       'Error',
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         'Something went wrong',
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // Function to download PDF
  const downloadPDF = async (
    base64Data: string,
    fileName: string = 'LabResults.pdf',
  ) => {
    try {
      const base64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
      const dirs = RNBlobUtil.fs.dirs;
      const path = `${dirs.DownloadDir}/${fileName}`;
      await RNBlobUtil.fs.writeFile(path, base64, 'base64');
      RNBlobUtil.android.addCompleteDownload({
        title: fileName,
        description: 'Download complete',
        mime: 'application/pdf',
        path: path,
        showNotification: true,
      });
    } catch (error) {
      console.error('File save error:', error);
    }
  };

  // Function to view PDF (fixed version)
  const openPDF = async (
    base64Data: string,
    fileName: string = 'LabResults.pdf',
  ) => {
    try {
      const base64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
      const dirs = RNBlobUtil.fs.dirs;
      const path = `${dirs.DownloadDir}/${fileName}`;
      await RNBlobUtil.fs.writeFile(path, base64, 'base64');

      if (Platform.OS === 'android') {
        RNBlobUtil.android.actionViewIntent(path, 'application/pdf');
      } else {
        const canOpen = await Linking.canOpenURL(`file://${path}`);
        if (canOpen) {
          await Linking.openURL(`file://${path}`);
        } else {
          ToastService.error('Error', 'No PDF viewer available');
        }
      }
    } catch (error) {
      console.error('File open error:', error);
      ToastService.error('Error', 'Unable to open file');
    }
  };

  const filterVisitsByDate = useCallback(() => {
    if (!startDate && !endDate) {
      setFilteredVisits(patientVisits);
      return;
    }
    const filtered = patientVisits.filter((v: any) => {
      const visitDate = moment(v.VisitStartDttm);
      const afterStart = startDate
        ? visitDate.isSameOrAfter(startDate, 'day')
        : true;
      const beforeEnd = endDate
        ? visitDate.isSameOrBefore(endDate, 'day')
        : true;
      return afterStart && beforeEnd;
    });
    setFilteredVisits(filtered);
  }, [startDate, endDate, patientVisits]);

  React.useEffect(() => {
    filterVisitsByDate();
  }, [startDate, endDate, patientVisits]);

  const AccordionItem = ({title, children, expanded, onToggle}: any) => {
    return (
      <View style={styles.accCard}>
        <TouchableOpacity
          style={styles.accHeader}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            onToggle();
          }}
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
      <Header title="menu" showLocation />
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

        {/* Date Pickers */}
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

        {/* Accordion Visits */}
        {filteredVisits.map((visit, index) => (
          <AccordionItem
            key={index}
            title={visit?.label}
            expanded={index == openIndex}
            onToggle={() => {
              setOpenIndex(index);
              setSelectedReportType(null);
              fetchReports(visit);
            }}>
            {loading ? (
              <View style={{marginVertical: h * 0.02}}>
                <ThreeDotLoader />
              </View>
            ) : (
              <View>
                <View
                  style={{
                    padding: w * 0.02,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: pallette.black,
                      textTransform: 'capitalize',
                    }}>
                    {visit?.labReport?.documentname}.
                    {visit?.labReport?.filetype}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: w * 0.03,
                    }}>
                    <MaterialCommunityIcons
                      name="eye"
                      color={pallette.black}
                      size={w * 0.05}
                      onPress={() =>
                        openPDF(
                          visit?.labReport?.file,
                          `${visit?.labReport?.documentname}.pdf`,
                        )
                      }
                    />
                    <MaterialCommunityIcons
                      name="download"
                      color={pallette.black}
                      size={w * 0.05}
                      onPress={() =>
                        downloadPDF(
                          visit?.labReport?.file,
                          `${visit?.labReport?.documentname}.pdf`,
                        )
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    padding: w * 0.02,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: pallette.black,
                      textTransform: 'capitalize',
                    }}>
                    {visit?.radiologyReport?.documentname}.
                    {visit?.radiologyReport?.filetype}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: w * 0.03,
                    }}>
                    <MaterialCommunityIcons
                      name="eye"
                      color={pallette.black}
                      size={w * 0.05}
                      onPress={() =>
                        openPDF(
                          visit?.radiologyReport?.file,
                          `${visit?.radiologyReport?.documentname}.pdf`,
                        )
                      }
                    />
                    <MaterialCommunityIcons
                      name="download"
                      color={pallette.black}
                      size={w * 0.05}
                      onPress={() =>
                        downloadPDF(
                          visit?.radiologyReport?.file,
                          `${visit?.radiologyReport?.documentname}.pdf`,
                        )
                      }
                    />
                  </View>
                </View>
                {visit?.prescriptions?.map((invoice, index) => (
                  <View
                    style={{
                      padding: w * 0.02,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: pallette.black,
                        textTransform: 'capitalize',
                      }}>
                      {invoice?.documentname}.{invoice?.filetype}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: w * 0.03,
                      }}>
                      <MaterialCommunityIcons
                        name="eye"
                        color={pallette.black}
                        size={w * 0.05}
                        onPress={() =>
                          openPDF(invoice?.file, `${invoice.documentname}.pdf`)
                        }
                      />
                      <MaterialCommunityIcons
                        name="download"
                        color={pallette.black}
                        size={w * 0.05}
                        onPress={() =>
                          downloadPDF(
                            invoice?.file,
                            `${invoice.documentname}.pdf`,
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
                {visit?.invoices?.map((invoice, index) => (
                  <View
                    style={{
                      padding: w * 0.02,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: pallette.black,
                        textTransform: 'capitalize',
                      }}>
                      {invoice?.documentname}.{invoice?.filetype}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: w * 0.03,
                      }}>
                      <MaterialCommunityIcons
                        name="eye"
                        color={pallette.black}
                        size={w * 0.05}
                        onPress={() =>
                          openPDF(invoice?.file, `${invoice.documentname}.pdf`)
                        }
                      />
                      <MaterialCommunityIcons
                        name="download"
                        color={pallette.black}
                        size={w * 0.05}
                        onPress={() =>
                          downloadPDF(
                            invoice?.file,
                            `${invoice.documentname}.pdf`,
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </AccordionItem>
        ))}
      </View>
    </ScrollView>
  );
};

export default PatientRecords;

const styles = StyleSheet.create({
  accItemTitle: {
    fontSize: adjust(14),
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  accItemDescription: {
    fontSize: adjust(12),
    fontFamily: 'Poppins-Regular',
    color: pallette.dark_purple,
    textAlign: 'center',
  },
  accItem: {
    marginVertical: h * 0.01,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: w * 0.04,
  },
  accItemBtn: {
    width: w * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: w * 0.02,
    borderRadius: w * 0.02,
  },
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
    fontSize: adjust(14),
    fontFamily: 'Poppins-SemiBold',
    color: '#F08E46',
  },
  accBody: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  reportSelectorContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    marginVertical: h * 0.01,
  },
  reportSelectorBtn: {
    borderBottomWidth: 1,
    borderColor: pallette.dark_grey,
    paddingVertical: h * 0.008,
    paddingHorizontal: w * 0.065,
    backgroundColor: '#f9f9f9',
  },
  reportSelectorBtnActive: {
    backgroundColor: pallette.pale_turquoise,
    borderColor: pallette.dark_purple,
  },
  reportSelectorText: {
    fontSize: adjust(12),
    fontFamily: 'Poppins-Regular',
    color: pallette.dark_purple,
  },
  reportSelectorTextActive: {
    fontFamily: 'Poppins-SemiBold',
    color: pallette.black,
  },
});

import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {adjust, ToastService} from '../../utils';
import {h, pallette, w} from '../../constants/constants';
import Header from '../../components/header';
import {
  fetchFamilyMembers,
  getAllLabReports,
  getPatientVisits,
} from '../../services/common';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import RNBlobUtil from 'react-native-blob-util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FamilyMember} from '../../utils/types';
import {Loader} from '../../components';
import ThreeDotLoader from '../../components/three-dot-loader';

const PatientRecords: FC = ({route}: any) => {
  const {mrn} = route?.params;
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    mrn || '',
  );
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [patientVisits, setPatientVisits] = useState([{label: ''}]);
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
    } finally {
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const response = await getPatientVisits({
        // mrn: patientId || 'MAHTMP-169649',
        mrn: 'BAH-00519630',
      });
      console.log(response.data);
      if (response?.status == 200 && response.success) {
        const visitOptions = response.data.map((e: any) => ({
          ...e,
          label: `${e.VisitID} | ${moment(e.VisitStartDttm).format(
            'DD MMM YYYY',
          )}`,
          value: e.VisitID, // value should stay simple & consistent
        }));
        setPatientVisits(visitOptions);
        fetchReports(visitOptions[0]);
      } else {
        setPatientVisits([]);
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
    }
  }, []);

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
        showNotification: true, // 🔔 shows notification
      });
    } catch (error) {
      console.error('File save error:', error);
    }
  };

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
        {patientVisits.map((visit, index) => (
          <AccordionItem
            title={visit?.label}
            expanded={index == openIndex}
            onToggle={() => {
              setOpenIndex(index), fetchReports(visit);
            }}>
            {loading ? (
              <View style={{marginVertical: h * 0.02}}>
                <ThreeDotLoader />
              </View>
            ) : (
              <View>
                <View style={styles.accItem}>
                  <TouchableOpacity
                    onPress={() =>
                      downloadPDF(
                        labreports?.file,
                        `${labreports.documentname}.pdf`,
                      )
                    }>
                    <Text style={styles.accItemDescription}>
                      {'Download Lab Report'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.accItem}>
                  <TouchableOpacity
                    onPress={() =>
                      downloadPDF(
                        radiologyreports?.file,
                        `${radiologyreports.documentname}.pdf`,
                      )
                    }>
                    <Text style={styles.accItemDescription}>
                      {'Download Radiology Report'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: h * 0.01,
    padding: w * 0.02,
    borderRadius: w * 0.02,
  },
  primaryOrgBtnBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    gap: w * 0.02,
  },
  history: {
    color: pallette.dark_purple,
    fontSize: adjust(12),
    fontFamily: 'Poppins-SemiBold',
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
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  accBody: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

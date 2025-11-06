import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageProps,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Card,
  Searchbar,
  TextInput,
  Icon,
  Text,
  Appbar,
} from 'react-native-paper';
import {useApp} from '../../context/app-context';
import {ToastService} from '../../utils';
import {NotFound} from '../../components';
import {h, pallette, w} from '../../constants/constants';
import {Header} from '../../components';
import {getNotifications} from '../../services/common';
import moment from 'moment';

const Notifications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const {profile} = useApp();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotifications({
        MobileNumber: profile?.MobileNumber,
      });
      console.log(response.data[0]);

      if (response?.status == 200 && response.success) {
        setNotifications(
          response?.data.sort((a: any, b: any) =>
            moment(b.createdAt).diff(moment(a.createdAt)),
          ),
        );
      } else {
        setNotifications([]);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
      setNotifications([]);
    }
  }, []);

  return (
    <>
      <View style={{flex: 1}}>
        <Header title="Notifications" showBack={true} />
        <ScrollView style={styles.mainContainer}>
          <View>
            {/* <View style={styles.searchMain}>
              <View style={styles.searchIconty}>
                <Icon source="magnify" size={20} color="#000" />
              </View>

              <TextInput
                mode="flat"
                style={[styles.searchFormInput, {color: '#000'}]}
                placeholder="Search Name / Ward/ Category"
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#000"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{
                  colors: {
                    text: '#000',
                    placeholder: '#000',
                    background: 'transparent',
                  },
                }}
              />
            </View> */}

            <View style={styles.listPatients}>
              {notifications?.length > 0 ? (
                notifications.map((item, index) => (
                  <View
                    style={{
                      padding: w * 0.02,
                      backgroundColor: pallette.white,
                      borderWidth: 0.7,
                      borderColor: '#00000020',
                      marginTop: h * 0.02,
                      borderRadius: w * 0.02,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.name}>{item?.title}</Text>
                      <Text style={styles.statusTitle}>
                        {moment(item?.createdAt).format('DD-MM-YYYY hh:mm a')}
                      </Text>
                    </View>
                    <Text style={styles.statusTitle}>{item?.message}</Text>
                  </View>
                ))
              ) : (
                <NotFound
                  text="No Notifications found"
                  hideBtn={true}
                  // subText="Try changing date or search again."
                  margin={h * 0.2}
                />
              )}
              {/* <Card style={styles.card}>
                <View style={styles.infoBlock}>
                  <View style={styles.cardInfo}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <UserIcon
                          width={23}
                          height={23}
                          stroke="#675587"
                          strokeWidth={0.5}
                        />
                      </View>
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.statusTitle}>New Admissions</Text>
                      <Text style={styles.name}>Abdul Aziz (M/45)</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.bottomRow}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <Text style={styles.label}>Date and Time</Text>
                      <Text style={styles.value}>05 Aug 2025, 09:32 AM</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.label}>Admitted To</Text>
                      <Text style={styles.value}>General Ward 3A</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.reasonBlock}>
                  <Text style={styles.reasonLabel}>Reason</Text>
                  <Text style={styles.reasonValue}>
                    Chest Pain – under observation
                  </Text>
                </View>
              </Card> */}

              {/* <Card style={styles.card}>
                <View style={styles.infoBlock}>
                  <View style={styles.cardInfo}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <UserIcon
                          width={23}
                          height={23}
                          stroke="#675587"
                          strokeWidth={0.5}
                        />
                      </View>
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.statusTitle}>
                        {' '}
                        <Text style={styles.statusSubTitle}>Lab Reports</Text> -
                        New Admissions
                      </Text>
                      <Text style={styles.name}>Abdul Aziz (M/45)</Text>
                      <View style={styles.viewReportsRow}>
                        <Text
                          style={[
                            styles.name,
                            {fontSize: Dimensions.get('window').width * 0.03},
                          ]}>
                          General Ward 3A
                        </Text>
                        <TouchableOpacity style={styles.viewReports}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: Dimensions.get('window').width * 0.028,
                              fontFamily: 'Poppins-Medium',
                            }}>
                            View Reports
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={[styles.bottomRow, {paddingBottom: 10}]}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <Text style={styles.label}>Date and Time</Text>
                      <Text style={styles.value}>05 Aug 2025, 09:32 AM</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.label}>Test</Text>
                      <Text style={styles.value}>
                        Complete Blood Count (CBC)
                      </Text>
                    </View>
                  </View>
                </View>
              </Card> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  searchMain: {
    borderWidth: 1,
    borderColor: '#BDB3C6',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, .1)',
    position: 'relative',
    overflow: 'hidden',
  },

  searchIconty: {
    marginLeft: 12,
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },

  searchFormInput: {
    width: '100%',
    height: 40,
    fontSize: Dimensions.get('window').width * 0.035,
    color: '#fff',
    paddingRight: 0,
    paddingLeft: 25,
    marginLeft: 0,
    marginHorizontal: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Poppins-Medium',
  },

  //--List Patients

  listPatients: {},

  card: {
    borderRadius: 12,
    marginVertical: 8,
    paddingTop: 12,
    backgroundColor: '#fff',
  },

  statusTitle: {
    fontSize: Dimensions.get('window').width * 0.032,
    color: '#FF9916',
    fontFamily: 'Poppins-Regular',
  },
  statusSubTitle: {
    fontSize: Dimensions.get('window').width * 0.032,
    color: '#D59E57',
    fontFamily: 'Poppins-Regular',
  },
  infoBlock: {
    paddingHorizontal: 10,
  },
  cardInfo: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    width: 8,
    height: 8,
    backgroundColor: '#F06060',
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Dimensions.get('window').width * 0.035,
    color: '#472D7A',
    fontFamily: 'Poppins-Medium',
    width: w * 0.4,
  },

  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    justifyContent: 'space-between',
  },
  admittedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    justifyContent: 'space-between',
  },
  ageRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginRight: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#777',
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#000',
    fontFamily: 'Poppins-Medium',
    lineHeight: 14,
  },

  rightArrowIcon: {
    marginLeft: 10,
  },

  reasonBlock: {
    backgroundColor: '#E1FEFE',
    padding: 10,
    marginTop: 10,
  },

  reasonLabel: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#199595',
    fontFamily: 'Poppins-Regular',
  },

  reasonValue: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  viewReportsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  viewReports: {
    backgroundColor: '#7171D7',
    borderRadius: 40,
    width: 120,
    height: 25,
    paddingTop: 2,

    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

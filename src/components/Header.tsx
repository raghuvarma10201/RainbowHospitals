import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useApp} from '../context/AppContext';
import {Branch} from '../services/Region/api';
import {getBranches, getPatientProfile, getRegions} from '../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  findNearestRegion,
  findNearestBranch,
} from '../services/Region/location';
import {getCurrentCoordinates} from '../utils/LocationService';
import {pallette, w} from '../Constants/Constant';
import {adjust} from '../utils/commonFunctions';

const images = {
  arrow: require('../../assets/images/back-arrow.png'),
  profile: require('../../assets/images/profile-icon.png'),
  map: require('../../assets/images/map-icon.png'),
  services: require('../../assets/images/services-icon.png'),
  wallet: require('../../assets/images/wallet-icon.png'),
  filter: require('../../assets/images/filter-icon.png'),
};

interface CommonHeaderProps {
  title?: string;
  showLocation?: boolean;
  showBack?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  showLocation = true,
  showBack = true,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [branchesForRegion, setBranchesForRegion] = useState<Branch[]>([]);
  const [expandedRegionId, setExpandedRegionId] = useState<string | null>(null);
  const [branchHeights, setBranchHeights] = useState<{
    [key: string]: Animated.Value;
  }>({});

  const {
    branch,
    region,
    updateAllBranch,
    updateBranch,
    updateRegion,
    updateProfile,
  } = useApp();

  useEffect(() => {
    loadDetails();
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const mrn = await AsyncStorage.getItem('mrn');
      if (!mrn) return;
      const data = await getPatientProfile({mrn});
      if (data?.data?.[0]?.PatientID) {
        updateProfile(data.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  useEffect(() => {
    setSelectedBranch(branch || null);
    setSelectedRegion(region || null);
  }, [branch, region]);

  const loadDetails = async () => {
    try {
      const regions = await getRegions();
      const location = await getCurrentCoordinates();
      if (!location) return;
      const nearestRegion = findNearestRegion(
        regions,
        location.latitude,
        location.longitude,
      );
      if (!nearestRegion) return;

      updateRegion(nearestRegion);
      const allBranches = await getBranches(nearestRegion.region_id);
      if (!allBranches.length) return;

      updateAllBranch(allBranches);
      const nearestBranch = findNearestBranch(
        allBranches,
        location.latitude,
        location.longitude,
      );
      if (nearestBranch) updateBranch(nearestBranch);
    } catch (err) {
      console.error('Error loading details:', err);
    }
  };

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = await getRegions();
        setRegions(regionData);
      } catch (error) {
        console.error('Failed to load regions:', error);
      }
    };
    loadRegions();
  }, []);

  const toggleRegion = async (regionItem: any) => {
    const id = regionItem.region_id;
    const isExpanded = expandedRegionId === id;

    if (expandedRegionId && expandedRegionId !== id) {
      Animated.timing(branchHeights[expandedRegionId], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    if (isExpanded) {
      Animated.timing(branchHeights[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedRegionId(null));
    } else {
      const branches = await getBranches(id);
      setBranchesForRegion(branches);
      if (!branchHeights[id]) {
        branchHeights[id] = new Animated.Value(0);
      }
      setExpandedRegionId(id);
      Animated.timing(branchHeights[id], {
        toValue: branches.length * 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBranchUpdate = () => {
    if (selectedBranch && selectedRegion) {
      updateBranch(selectedBranch);
      updateRegion(selectedRegion);
      setLocationModalVisible(false);
    }
  };

  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backArrowBlock}>
            <Image
              source={images.arrow}
              style={{
                width: w * 0.05,
                height: w * 0.05,
                tintColor: pallette.white,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.profileIconBlock}>
            <Image
              source={images.profile}
              style={{width: w * 0.08, height: w * 0.08}}
              resizeMode="contain"
            />
          </View>
        )}

        {showLocation ? (
          <TouchableOpacity
            style={styles.dropdownIcon}
            onPress={() => setLocationModalVisible(true)}>
            <View style={{marginLeft: 6}}>
              <Text style={styles.locationText}>
                {branch?.name || 'Fetching location...'}
              </Text>
              <View style={styles.locationInfo}>
                <Image
                  source={images.map}
                  style={{
                    width: w * 0.03,
                    height: w * 0.03,
                    marginRight: 3,
                    marginTop: 3,
                  }}
                />
                <Text style={styles.regionText}>{region?.name ?? ''}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          title && <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity>
          <Image
            source={images.services}
            style={{width: w * 0.07, height: w * 0.07}}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={images.wallet}
            style={{width: w * 0.065, height: w * 0.065}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {title != 'menu' && (
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={images.filter}
              style={{width: w * 0.06, height: w * 0.06}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Location Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => setLocationModalVisible(false)}
          accessible={false}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>📍 Select Region & Branch</Text>
                <ScrollView style={{maxHeight: 400}}>
                  {regions.map(regionItem => {
                    const isExpanded =
                      expandedRegionId === regionItem.region_id;
                    const animatedHeight =
                      branchHeights[regionItem.region_id] ||
                      new Animated.Value(0);

                    return (
                      <View key={regionItem.region_id}>
                        <TouchableOpacity
                          style={[
                            styles.locationOption,
                            isExpanded && styles.selectedLocationOption,
                          ]}
                          onPress={() => {
                            toggleRegion(regionItem);
                            setSelectedRegion(regionItem);
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                styles.locationOptionText,
                                isExpanded && styles.selectedLocationText,
                              ]}>
                              {regionItem.name}
                            </Text>
                            <FontAwesome
                              name={isExpanded ? 'angle-up' : 'angle-down'}
                              size={20}
                              color="#888"
                            />
                          </View>
                        </TouchableOpacity>

                        <Animated.View
                          style={{height: animatedHeight, overflow: 'hidden'}}>
                          {isExpanded &&
                            branchesForRegion.map((b, idx) => (
                              <TouchableOpacity
                                key={b.id}
                                style={[
                                  styles.locationOption,
                                  selectedBranch?.id === b.id &&
                                    styles.selectedLocationOption,
                                ]}
                                onPress={() => setSelectedBranch(b)}>
                                <Text
                                  style={[
                                    styles.locationOptionText,
                                    selectedBranch?.id === b.id &&
                                      styles.selectedLocationText,
                                  ]}>
                                  {idx + 1}. {b.name}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </Animated.View>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.updateButton, {marginRight: 8}]}
                    disabled={!selectedBranch}
                    onPress={handleBranchUpdate}>
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setLocationModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: pallette.app_purple,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileIconBlock: {
    width: w * 0.1,
    height: w * 0.1,
    backgroundColor: pallette.white,
    borderRadius: w,
    borderWidth: 3,
    borderColor: pallette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowBlock: {
    width: w * 0.08,
    height: w * 0.08,
    borderRadius: w,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerTitle: {
    color: pallette.white,
    fontSize: adjust(16),
    paddingStart: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w * 0.03,
  },
  dropdownIcon: {
    marginLeft: 0,
    padding: 4,
  },
  locationText: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionText: {
    fontSize: adjust(10),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: pallette.black,
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: adjust(16),
    fontWeight: 'bold',
    marginBottom: 10,
    color: pallette.black,
  },
  locationOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: pallette.dark_grey,
  },
  selectedLocationOption: {
    backgroundColor: pallette.light_grey,
  },
  locationOptionText: {
    fontSize: adjust(14),
    color: pallette.black,
  },
  selectedLocationText: {
    color: pallette.app_light_purple,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: pallette.app_light_purple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: pallette.dark_grey,
    fontWeight: '600',
  },
});

export default React.memo(CommonHeader);

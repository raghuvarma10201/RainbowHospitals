import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    LayoutAnimation,
    UIManager,
    Animated,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useApp } from '../context/AppContext';
import {
    Branch
} from '../services/Region/api';
import {
    getBranches,
    getRegions,
} from '../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findNearestRegion, findNearestBranch } from '../services/Region/location';
import { getCurrentCoordinates } from '../utils/LocationService';

interface CommonHeaderProps {
    title?: string;
    showLocation?: boolean;
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
    onChatPress?: () => void;
    onMenuPress?: () => void;
    backgroundColor?: string;
    loading?: boolean;
    home?: boolean;
    location?: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
    title,
    showLocation = true,
    onNotificationPress,
    onChatPress,
    home,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [regions, setRegions] = useState<any[]>([]);
    const [branchesForRegion, setBranchesForRegion] = useState<Branch[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(true);

    const { branch, region, updateAllBranch, updateBranch, updateRegion } = useApp();
    const [expandedRegionId, setExpandedRegionId] = useState<string | null>(null);
    const [branchHeights, setBranchHeights] = useState<{
        [key: string]: Animated.Value;
    }>({});


    useEffect(() => {
        loadDetails();
    }, []);



    useEffect(() => {
        setCurrentLocation(branch?.name || null);
        setSelectedBranch(branch || null);
        setSelectedRegion(region || null);
    }, [branch, region]);

    const loadDetails = async () => {
    try {
      const regions = await getRegions();
      const location = await getCurrentCoordinates();
      if (!location) throw new Error('Location unavailable');
      const nearestRegion = findNearestRegion(
        regions,
        location.latitude,
        location.longitude,
      );
      if (!nearestRegion) throw new Error('No region found nearby');
      updateRegion(nearestRegion);
      const allBranches = await getBranches(nearestRegion.region_id);
      if (!allBranches.length) throw new Error('No branch data found');
      updateAllBranch(allBranches);
      const nearestBranch = findNearestBranch(
        allBranches,
        location.latitude,
        location.longitude,
      );
      if (!nearestBranch) throw new Error('No nearby branch found');
      updateBranch(nearestBranch);
    } catch (err: any) {
      console.log(err);
    } finally {
      
    }
  };
    useEffect(() => {
        const loadRegions = async () => {
            try {
                const regionData = await getRegions();
                setRegions(regionData);
            } catch (error) {
                console.error('Failed to load regions:', error);
            } finally {
                setLoadingRegions(false);
            }
        };
        loadRegions();
    }, []);

    useEffect(() => {
        if (
            Platform.OS === 'android' &&
            UIManager.setLayoutAnimationEnabledExperimental
        ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const toggleRegion = async (regionItem: any) => {
        const id = regionItem.region_id;
        const isExpanded = expandedRegionId === id;

        // Collapse previously expanded region
        if (expandedRegionId && expandedRegionId !== id) {
            Animated.timing(branchHeights[expandedRegionId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }

        if (isExpanded) {
            // Collapse current
            Animated.timing(branchHeights[id], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setExpandedRegionId(null);
            });
        } else {
            const branches = await getBranches(id);
            setBranchesForRegion(branches);

            // Prepare height value if not present
            if (!branchHeights[id]) {
                branchHeights[id] = new Animated.Value(0);
            }

            setExpandedRegionId(id);

            Animated.timing(branchHeights[id], {
                toValue: branches.length * 50, // Adjust row height if needed
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleBranchUpdate = () => {
        if (selectedBranch && selectedRegion) {
            updateBranch(selectedBranch);
            updateRegion(selectedRegion);
            console.log(selectedBranch)
            setCurrentLocation(`${selectedBranch.name}, ${selectedRegion.name}`);
            setLocationModalVisible(false);
        }
    };

    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <View style={styles.profileIconBlock}>
                    <Image source={require('../../assets/images/profile-icon.png')} style={{ width: 30, height: 30, }} resizeMode="contain" />
                </View>
                {showLocation && (
                    <TouchableOpacity style={styles.dropdownIcon} onPress={() => setLocationModalVisible(true)}>
                        <View style={{ marginLeft: 6 }}>
                            <Text style={{ fontSize: 12, color: '#fff', fontFamily: 'ProximaNovaA-Regular', }}> {branch?.name || 'Fetching location...'}</Text>
                            <View style={{ flexDirection: 'row', justifyContent:"flex-start" }}>
                                <Image source={require('../../assets/images/map-icon.png')} style={{ width: 12, height: 12, marginRight: 3, marginTop: 3, }} />
                                <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'normal', marginTop: 0, fontFamily: 'ProximaNovaA-Regular' }}>
                                    {region?.name ?? ''}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                {title && !showLocation && (
                    <Text style={styles.headerTitle}>{title}</Text>
                )}
            </View>
            <View style={styles.headerRight}>
                <Image source={require('../../assets/images/services-icon.png')} style={{ width:26, height:26, marginRight: 10, }} resizeMode="contain" />
                <Image source={require('../../assets/images/wallet-icon.png')} style={{ width: 26, height: 26, marginRight: 10, }} resizeMode="contain" />
                <Image source={require('../../assets/images/filter-icon.png')} style={{ width: 22, height: 22, }} resizeMode="contain" />
            </View>
            {/* Location Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={locationModalVisible}
                onRequestClose={() => setLocationModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>📍 Select Region & Branch</Text>
                        <ScrollView style={{ maxHeight: 400 }}>
                            {regions.map((regionItem, index) => {
                                const isExpanded = expandedRegionId === regionItem.region_id;
                                const animatedHeight =
                                    branchHeights[regionItem.region_id] || new Animated.Value(0);
                                // setSelectedRegion(regionItem)
                                return (
                                    <View key={regionItem.region_id}>
                                        <TouchableOpacity
                                            style={[
                                                styles.locationOption,
                                                isExpanded && styles.selectedLocationOption,
                                            ]}
                                            onPress={() => {
                                                toggleRegion(regionItem)
                                                setSelectedRegion(regionItem)
                                            }
                                            }>
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
                                            style={{ height: animatedHeight, overflow: 'hidden' }}>
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
                                style={[styles.updateButton, { marginRight: 8 }]}
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
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 15,
        paddingTop:
            Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 5 : 10,
        paddingBottom: 10,
        marginTop: -25,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    //Header
    header: {
        backgroundColor: '#3C2871',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },


    profileIconBlock: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    headerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    //Header End

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 19,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    rightSection: {
        flexDirection: 'row',
        gap: 1,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    locationInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    locationText: {},
    dropdownIcon: {
        marginLeft: 0,
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    locationOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',

    },
    selectedLocationOption: {
        backgroundColor: '#eee',
    },
    locationOptionText: {
        fontSize: 16,
        color: '#000',
    },
    selectedLocationText: {
        color: '#8B5A8C',
        fontWeight: 'bold',
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: '#8B5A8C',
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
        color: '#555',
        fontWeight: '600',
    },
});

export default CommonHeader;

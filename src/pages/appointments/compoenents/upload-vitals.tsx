import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {styles} from '../common-styles';
import {adjust, ToastService} from '../../../utils';
import {h, pallette, w} from '../../../constants/constants';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uploadPatientVitals} from '../../../services/common';
import Icon from 'react-native-vector-icons/Ionicons';

type VitalKey = 'height' | 'weight' | 'temperature';

const UploadVitals = ({appointmentData}: {appointmentData: any}) => {
  const [vitals, setVitals] = useState({
    height: appointmentData?.vitals?.height || '',
    weight: appointmentData?.vitals?.weight || '',
    temperature: appointmentData?.vitals?.temperature || '',
  });
  const vitalFields = [
    {key: 'height', label: 'Height (in cm) (Normal Range - Based on age)'},
    {key: 'weight', label: 'Weight (in Kgs) (Normal Range - Based on BMI)'},
    {
      key: 'temperature',
      label: 'Temperature (in °F) (Normal Range - 97.5 to 99.5)',
    },
  ];
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => setIsExpanded(false));
    } else {
      setIsExpanded(true);
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: adjust(h * 0.4),
          duration: 300,
          useNativeDriver: false,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };
  const uploadVitals = async () => {
    const obj = {
      appointmentnumber: appointmentData?.BookingUID,
      mrn: (await AsyncStorage.getItem('mrn')) || '',
      OrganisationUID: appointmentData?.OrganisationUID,
      height: vitals.height ? parseFloat(vitals.height) : undefined,
      weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
      temperature: vitals.temperature
        ? parseFloat(vitals.temperature)
        : undefined,
    };
    try {
      const response = await uploadPatientVitals(obj);
      if (response?.status == 200 && response?.success) {
        ToastService.success('Success', 'Vitals Uploaded Successfully');
        toggleExpand();
        // navigation.goBack();
      } else {
        ToastService.error('Error', response.message);
      }
    } catch (error: any) {
      ToastService.error(
        'Error Uploading Vitals',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
    }
  };
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.expandableContainer,
          {
            height: animatedHeight, // Smooth expand/collapse
            opacity: animatedOpacity,
          },
        ]}>
        {vitalFields.map(({key, label}, idx) => (
          <View style={styles.formRow} key={idx}>
            <Text style={styles.formLabel}>{label}</Text>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              placeholderTextColor={pallette.dark_grey}
              value={
                vitals[key as VitalKey] ? String(vitals[key as VitalKey]) : ''
              }
              style={styles.formInput}
              keyboardType={'decimal-pad'}
              onChangeText={text =>
                setVitals(prev => ({
                  ...prev,
                  [key]: text,
                }))
              }
            />
          </View>
        ))}
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadVitals}>
          <Text style={{color: 'white', fontWeight: '600'}}>Upload</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.fabButton} onPress={toggleExpand}>
        {isExpanded ? (
          <Icon
            name={isExpanded ? 'close' : 'add'}
            size={w * 0.05}
            color={pallette.white}
          />
        ) : (
          <Text style={{color: 'white', fontWeight: '600'}}>Upload Vitals</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadVitals;

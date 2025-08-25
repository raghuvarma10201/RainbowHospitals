import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';

// Type for a single action item
type ActionItem = {
  icon: any; // You can replace 'any' with ImageSourcePropType if you import it from 'react-native'
  label: string;
  onPress: () => void;
};

// Props for QuickActions component
type QuickActionsProps = {
  navigation: any;
};

// Reusable component for a single quick action button
const QuickActionButton: React.FC<ActionItem & {style?: object}> = ({
  icon,
  label,
  onPress,
  style,
}) => (
  <TouchableOpacity style={[styles.actionItem, style]} onPress={onPress}>
    <Image source={icon} style={styles.iconAction} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const QuickActions: React.FC<QuickActionsProps> = ({navigation}) => {
  // Array of quick action items
  const actionItems: ActionItem[] = [
    {
      icon: require('../../../../assets/images/physical-consultation-icon.png'),
      label: 'Book Physical Consultation',
      onPress: () =>
        navigateTo(navigation, 'Specialities', {appointmentType: 'Physical'}),
    },
    {
      icon: require('../../../../assets/images/video-consultation-icon.png'),
      label: 'Book Video Consultation',
      onPress: () =>
        navigateTo(navigation, 'Specialities', {appointmentType: 'Video'}),
    },
    {
      icon: require('../../../../assets/images/vaccine-icon.png'),
      label: 'Book Vaccination',
      onPress: () => navigateTo(navigation, 'BookVaccination'),
    },
    {
      icon: require('../../../../assets/images/book-scan.png'),
      label: 'Book Scan',
      onPress: () => navigateTo(navigation, 'BookScan'),
    },
    {
      icon: require('../../../../assets/images/view-report.png'),
      label: 'View Report',
      onPress: () => navigateTo(navigation, 'MedicalRecord'),
    },
  ];

  // Render function for FlatList
  const renderItem: ListRenderItem<ActionItem> = ({item}) => (
    <QuickActionButton
      icon={item.icon}
      label={item.label}
      onPress={item.onPress}
    />
  );

  return (
    <FlatList
      data={actionItems}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{paddingVertical: 10}}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    gap: w * 0.04,
    marginBottom: h * 0.01,
  },
  actionItem: {
    backgroundColor: pallette.app_light_green,
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
    minHeight: h * 0.12,
  },
  iconAction: {
    width: w * 0.15,
    height: w * 0.13,
    marginBottom: 5,
  },
  actionText: {
    fontSize: adjust(12),
    textAlign: 'center',
  },
});

export default React.memo(QuickActions);

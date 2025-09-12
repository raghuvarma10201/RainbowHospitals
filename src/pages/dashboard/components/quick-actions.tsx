import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ListRenderItem,
  View,
} from 'react-native';
import {adjust, navigateTo} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';
import {useApp} from '../../../context/app-context';

// Type for a single action item
type ActionItem = {
  icon: any; // You can replace 'any' with ImageSourcePropType if you import it from 'react-native'
  label: string;
  onPress: () => void;
  cat: any;
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
  cat,
}) => (
  <TouchableOpacity
    style={[
      styles.actionItem,
      {
        borderColor:
          cat == 'Child Care' ? pallette.medium_turquoise : pallette.amethyst,
        backgroundColor:
          cat == 'Child Care'
            ? pallette.pale_turquoise
            : pallette.light_amethyst,
      },
      style,
    ]}
    onPress={onPress}>
    <View
      style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={icon}
        style={{
          position: 'absolute',
          top: -(h * 0.07),
          left: -(w * 0.1),
          height: w * 0.12,
          width: w * 0.12,
          backgroundColor:
            cat == 'Child Care' ? pallette.medium_turquoise : pallette.amethyst,
          tintColor: pallette.white,
          borderRadius: w,
          resizeMode: 'contain',
        }}
      />
    </View>
    <Text style={[styles.actionText]}>{label}</Text>
    <Image
      source={require('../../../../assets/images/arrow-right-light-icon.png')}
      style={[
        styles.arrowIcon,
        {
          tintColor:
            cat == 'Child Care' ? pallette.medium_turquoise : pallette.amethyst,
        },
      ]}
    />
  </TouchableOpacity>
);

const QuickActions: React.FC<QuickActionsProps> = ({navigation}) => {
  const {category} = useApp();
  // Array of quick action items
  const actionItems: ActionItem[] = [
    {
      icon: require('../../../../assets/images/physical-consultation-icon.png'),
      label: 'Book Consultation',
      onPress: () =>
        navigateTo(navigation, 'Specialities', {appointmentType: 'Physical'}),
      cat: category,
    },
    {
      icon: require('../../../../assets/images/book-scan.png'),
      label: 'Book Scan',
      onPress: () => navigateTo(navigation, 'BookScan'),
      cat: category,
    },
    {
      icon: require('../../../../assets/images/vaccine-icon.png'),
      label: 'Book Vaccination',
      onPress: () => navigateTo(navigation, 'BookVaccination'),
      cat: category,
    },
  ];

  // Render function for FlatList
  const renderItem: ListRenderItem<ActionItem> = ({item}) => (
    <QuickActionButton
      icon={item.icon}
      label={item.label}
      onPress={item.onPress}
      cat={item.cat}
    />
  );

  return (
    <FlatList
      data={
        category == 'Fertility'
          ? actionItems.slice(0, 1)
          : category == 'Child Care'
          ? [actionItems[0], actionItems[2]]
          : actionItems
      }
      numColumns={3}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
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
    width: w * 0.28,
    height: h * 0.14,
    alignSelf: 'center',
    borderWidth: 1.5,
    borderBottomLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
    marginHorizontal: w * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: h * 0.02,
    paddingVertical: h * 0.01,
  },
  actionText: {
    fontSize: adjust(12),
    color: pallette.dark_purple,
    fontFamily: 'ProximaNovaA-Bold',
    textAlign: 'left',
    minHeight: h * 0.04,
    width: '80%',
  },
  arrowIcon: {
    height: w * 0.03,
    width: w * 0.03,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: h * 0.005,
    right: w * 0.01,
  },
});

export default React.memo(QuickActions);

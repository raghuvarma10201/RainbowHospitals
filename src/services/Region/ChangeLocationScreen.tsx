import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {pallette} from '../../Constants/Constant';

// Define type for route params
type ChangeLocationParams = {
  currentLocation: string;
  onLocationChange: (location: string) => void;
};

const LOCATIONS = [
  'Banjara Hills',
  'Hydernagar',
  'Secunderabad',
  'LB Nagar',
  'Heart Institute, Banjara Rd 10',
  'Kondapur',
  'Financial District',
  'Himayatnagar',
  'Attapur Clinic',
];

const ChangeLocationScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<Record<string, ChangeLocationParams>, string>>();

  const currentLocation = route.params?.currentLocation;
  const onLocationChange = route.params?.onLocationChange;

  const [selected, setSelected] = useState<string>(currentLocation || '');

  const updateLocation = () => {
    if (selected && onLocationChange) {
      onLocationChange(selected);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Location</Text>
      <FlatList
        data={LOCATIONS}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelected(item)}>
            <View
              style={[styles.radioOuter, selected === item && styles.selected]}>
              {selected === item && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={updateLocation}>
        <Text style={styles.buttonText}>Update Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: pallette.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'purple',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'purple',
  },
  selected: {
    borderColor: 'purple',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 30,
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: pallette.white,
    fontWeight: 'bold',
  },
});

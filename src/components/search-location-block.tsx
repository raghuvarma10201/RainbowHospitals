import React, {useState, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {h, w, pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';
import {
  LocationOptionsProps,
  SearchLocationBlockProps,
} from '../types/components';

// ---------- STATIC DATA (memoized outside component) ----------
const location_options: LocationOptionsProps[] = [
  {value: '1', label: 'Location'},
  {value: '2', label: 'Location 2'},
];

// ---------- COMPONENT ----------
const SearchLocationBlock: React.FC<SearchLocationBlockProps> = ({style}) => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');

  return (
    <View style={style}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/search-icon.png')}
            style={styles.icon}
          />
        </View>
        <TextInput
          mode="flat"
          style={styles.input}
          placeholder="Doctor/Specialty"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={pallette.light_grey}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          theme={{
            colors: {
              text: pallette.white,
              placeholder: pallette.white,
              background: 'transparent',
            },
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/map-icon.png')}
            style={styles.icon}
          />
        </View>
        <Dropdown
          style={styles.dropdownSelect}
          selectedTextStyle={styles.selectedTextCountry}
          placeholderStyle={styles.placeholderCountry}
          containerStyle={styles.dropdownList}
          maxHeight={200}
          value={country}
          data={location_options}
          valueField="value"
          labelField="label"
          placeholder="Select Location"
          activeColor={pallette.white}
          onChange={e => setCountry(e.value)}
        />
      </View>
    </View>
  );
};
export default memo(SearchLocationBlock); // ✅ Memoized for performance

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    backgroundColor: pallette.white,
    flexDirection: 'row',
    borderRadius: w * 0.1,
    borderWidth: 0.3,
    borderColor: pallette.light_grey,
    paddingRight: w * 0.03,
  },
  iconContainer: {
    backgroundColor: pallette.medium_turquoise,
    width: w * 0.12,
    height: h * 0.04,
    borderRadius: w * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '80%',
    width: '50%',
    resizeMode: 'contain',
    tintColor: pallette.white,
  },
  input: {
    height: h * 0.04,
    width: w * 0.28,
    color: pallette.black,
    backgroundColor: pallette.white,
    borderRadius: w * 0.1,
    fontSize: adjust(11),
    fontFamily: 'ProximaNovaA-Regular',
  },
  dropdownSelect: {
    height: h * 0.04,
    width: w * 0.18,
    marginLeft: w * 0.01,
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(11),
    color: pallette.light_grey,
  },
  selectedTextCountry: {
    fontSize: adjust(11),
    color: pallette.dark_grey,
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(11),
    width: w * 0.3,
    marginLeft: -(w * 0.1),
  },
});

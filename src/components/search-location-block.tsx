import React, {useState, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {h, w, pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';
import {
  LocationOptionsProps,
  SearchLocationBlockProps,
} from '../types/component-types';

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
      {/* --- Search Input Block --- */}
      <View style={styles.searchBlock}>
        <TextInput
          mode="flat"
          style={styles.searchFormInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={pallette.white}
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
        <Image
          source={require('../../assets/images/search-icon.png')}
          style={styles.formInputIcon}
        />
      </View>

      {/* --- Dropdown Location Selector --- */}
      <View style={styles.searchBlock}>
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
        <Image
          source={require('../../assets/images/map-icon.png')}
          style={styles.formInputIcon}
        />
      </View>
    </View>
  );
};

export default memo(SearchLocationBlock); // ✅ Memoized for performance

// ---------- STYLES ----------
const styles = StyleSheet.create({
  searchBlock: {
    height: h * 0.05,
    backgroundColor: pallette.app_medium_green,
    borderRadius: w * 0.1,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
    marginBottom: h * 0.01, // added small gap for better UI separation
  },
  searchFormInput: {
    height: h * 0.05,
    borderRadius: w * 0.1,
    paddingLeft: w * 0.03,
    fontSize: adjust(12),
    color: pallette.white,
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNovaA-Regular',
    width: w * 0.4,
  },
  formInputIcon: {
    width: w * 0.04,
    height: h * 0.02,
    position: 'absolute',
    left: w * 0.03,
    tintColor: pallette.white,
  },
  dropdownSelect: {
    height: h * 0.05,
    paddingLeft: w * 0.07,
    width: w * 0.4,
    justifyContent: 'center',
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.white,
  },
  selectedTextCountry: {
    fontSize: adjust(12),
    color: pallette.white,
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'right',
  },
});

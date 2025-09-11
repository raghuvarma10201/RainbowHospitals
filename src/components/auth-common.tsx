import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {h, pallette, w} from '../constants/constants';
import {adjust} from '../utils';
import {FC, useCallback, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';

const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

interface commonauth {
  toEnter: string;
  subTxt: string;
  input: string;
  btnTxt: string;
  handleNumberChange: any;
  handleNumberBlur: any;
  value: any;
}

export const AuthCommonComponent: FC<commonauth> = ({
  toEnter,
  subTxt,
  input,
  btnTxt,
  handleNumberChange,
  handleNumberBlur,
  value,
}) => {
  const [country, setCountry] = useState('1');

  const handleCountryChange = useCallback((e: any) => {
    setCountry(e.value);
  }, []);
  return (
    <>
      {/* LOGO */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>
        India's no.1{'\n'}
        <Text style={[styles.tagline, {fontFamily: 'ProximaNovaA-Bold'}]}>
          Women and{'\n'}Children{'\n'}
        </Text>
        Hospital Group
      </Text>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Login/Register</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inpHeading}>Enter {toEnter}</Text>
        <Text style={styles.inpSubHeading}>{subTxt}</Text>
        <View style={styles.inputGroup}>
          <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.dropdownText}
            placeholderStyle={styles.dropdownText}
            maxHeight={h * 0.25}
            value={country}
            data={local_data}
            valueField="value"
            labelField="lable"
            placeholder="Select country"
            onChange={handleCountryChange}
          />
          <TextInput
            keyboardType="numeric"
            maxLength={10}
            style={styles.input}
            placeholder="Enter Mobile Number"
            onChangeText={handleNumberChange}
            onBlur={handleNumberBlur}
            value={value}
          />
        </View>
        <Text style={styles.inpSubHeading}>{subTxt}</Text>
        <TouchableOpacity style={styles.btn}>
          <View style={styles.btnTxtCntnr}>
            <Text style={styles.btnTxt}>{btnTxt}</Text>
          </View>
          <View style={styles.btnIcnCntnr}></View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginVertical: h * 0.05,
    width: w * 0.8,
    height: h * 0.09,
  },
  tagline: {
    fontSize: adjust(32),
    color: pallette.dark_purple,
    fontFamily: 'ProximaNovaA-Regular',
    marginLeft: w * 0.18,
  },
  headingContainer: {
    paddingVertical: h * 0.01,
    backgroundColor: pallette.medium_turquoise,
    width: w * 0.5,
    marginTop: h * 0.05,
    borderTopRightRadius: w * 0.1,
    borderBottomRightRadius: w * 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: w * 0.08,
  },
  heading: {
    fontSize: adjust(14),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  inputContainer: {
    width: w * 0.62,
    alignSelf: 'center',
    paddingVertical: w * 0.05,
  },
  inpHeading: {
    fontSize: adjust(16),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Bold',
  },
  inpSubHeading: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h * 0.007,
    backgroundColor: pallette.white,
    borderRadius: w * 0.01,
    borderWidth: 0.7,
    borderColor: pallette.dark_grey,
  },
  input: {
    fontSize: adjust(12),
  },
  dropdown: {
    height: h * 0.02,
    borderRightWidth: 1,
    borderRightColor: pallette.dark_grey,
    width: w * 0.17,
    marginRight: w * 0.02,
    paddingHorizontal: w * 0.025,
  },
  dropdownText: {
    fontSize: adjust(12),
    color: pallette.black,
  },
  btn: {
    paddingVertical: h * 0.01,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: w * 0.5,
    borderWidth: 1,
    borderColor: pallette.medium_turquoise,
  },
  btnTxtCntnr: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: adjust(12),
    color: pallette.black,
  },
  btnIcnCntnr: {
    width: '20%',
    backgroundColor: pallette.medium_turquoise,
  },
});

import {
  Image,
  ImageBackground,
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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;
const PIN_COUNT = 4;
const local_data = [
  {value: '1', lable: '+91'},
  {value: '2', lable: '+92'},
];

interface commonauth {
  toEnter: string;
  subTxt: string;
  input: string;
  btnTxt: string;
  handleNumberChange?: any;
  handleNumberBlur?: any;
  formik: any;
  resendDisabled?: boolean;
  isSet?: boolean;
}

export const AuthCommonComponent: FC<commonauth> = ({
  toEnter,
  subTxt,
  input,
  btnTxt,
  handleNumberChange,
  handleNumberBlur,
  formik,
  resendDisabled,
  isSet,
}) => {
  console.log(input);

  const [country, setCountry] = useState('1');
  const [value, setValue] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const codeFieldRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const mpinFieldRef = useBlurOnFulfill({value: mpin, cellCount: PIN_COUNT});
  const confirmFieldRef = useBlurOnFulfill({
    value: confirmMpin,
    cellCount: PIN_COUNT,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [mpinProps, getMpinCellOnLayoutHandler] = useClearByFocusCell({
    value: mpin,
    setValue: setMpin,
  });
  const [confirmProps, getConfirmCellOnLayoutHandler] = useClearByFocusCell({
    value: confirmMpin,
    setValue: setConfirmMpin,
  });

  const handleCountryChange = useCallback((e: any) => {
    setCountry(e.value);
  }, []);
  return (
    <>
      <ImageBackground
        source={require('../../assets/images/topbg.png')}
        style={{
          height: h * 0.2,
          width: '100%',
          position: 'absolute',
          top: -(h * 0.05),
          right: 0,
          left: 0,
        }}
        resizeMode="cover"
      />

      <ImageBackground
        source={require('../../assets/images/bottombg.png')}
        style={{
          height: h * 0.4,
          width: '100%',
          position: 'absolute',
          bottom: -(h * 0.1),
          right: 0,
          left: 0,
        }}
        resizeMode="cover"
      />

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
        <Text style={styles.heading}>Authentication</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inpHeading}>
          {input == 'mpin' ? (isSet ? 'Enter' : 'Set') : 'Enter'} {toEnter}
        </Text>
        <Text style={styles.inpSubHeading}>{subTxt}</Text>
        {input == 'mobile' ? (
          <>
            <View style={styles.inputGroup}>
              <Dropdown
                style={styles.dropdown}
                selectedTextStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
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
                placeholderTextColor={pallette.dark_grey}
                onChangeText={handleNumberChange}
                onBlur={handleNumberBlur}
                value={formik.values.mobileNumber}
              />
            </View>

            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <Text style={styles.error}>{formik.errors.mobileNumber}</Text>
            )}
          </>
        ) : input == 'otp' ? (
          <>
            <CodeField
              ref={codeFieldRef as React.RefObject<TextInput>}
              {...props}
              value={value}
              onChangeText={text => {
                setValue(text.replace(/[^0-9]/g, '')),
                  handleNumberChange(text.replace(/[^0-9]/g, ''));
              }}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {formik.errors.otp && formik.touched.otp && (
              <Text style={styles.error}>{formik.errors.otp}</Text>
            )}
          </>
        ) : (
          <>
            {/* Enter M-Pin */}
            <Text style={[styles.inpSubHeading, {fontSize: adjust(11)}]}>
              Enter M-Pin
            </Text>

            <CodeField
              ref={mpinFieldRef as React.RefObject<TextInput>}
              {...mpinProps}
              value={mpin}
              onChangeText={text => {
                const cleanText = text.replace(/[^0-9]/g, '');
                setMpin(cleanText);
                handleNumberChange('mpin', text.replace(/[^0-9]/g, ''));
              }}
              cellCount={PIN_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getMpinCellOnLayoutHandler(index)}>
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {formik.touched.mpin && formik.errors.mpin && (
              <Text style={styles.error}>{formik.errors.mpin}</Text>
            )}

            {/* Confirm M-Pin */}
            {!isSet && (
              <>
                <Text style={[styles.inpSubHeading, {fontSize: adjust(11)}]}>
                  Confirm M-Pin
                </Text>

                <CodeField
                  ref={confirmFieldRef as React.RefObject<TextInput>}
                  {...confirmProps}
                  value={confirmMpin}
                  onChangeText={text => {
                    const cleanText = text.replace(/[^0-9]/g, '');
                    setConfirmMpin(cleanText);
                    handleNumberChange(
                      'confirmMpin',
                      text.replace(/[^0-9]/g, ''),
                    );
                  }}
                  cellCount={PIN_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getConfirmCellOnLayoutHandler(index)}>
                      <Text style={styles.cellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
                {formik.touched.confirmMpin && formik.errors.confirmMpin && (
                  <Text style={styles.error}>{formik.errors.confirmMpin}</Text>
                )}
              </>
            )}
          </>
        )}
        {input == 'mobile' && (
          <Text
            style={[
              styles.inpSubHeading,
              {fontSize: adjust(11)},
            ]}>{`You will recieve an OTP on this mobile number / or on your registered email id as well`}</Text>
        )}
        {input == 'otp' && (
          <TouchableOpacity
            disabled={resendDisabled}
            onPress={() => handleNumberBlur()}>
            <Text style={styles.resend}>{`Resend OTP`}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          style={styles.btn}>
          <View style={styles.btnTxtCntnr}>
            <Text style={styles.btnTxt}>{btnTxt}</Text>
          </View>
          <View style={styles.btnIcnCntnr}>
            <Image
              source={require('../../assets/images/login-right-arrow.png')}
              style={styles.rightArrow}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginTop: h * 0.06,
    marginBottom: h * 0.05,
    width: w * 0.8,
    height: w * 0.2,
  },
  tagline: {
    fontSize: adjust(28),
    color: pallette.dark_purple,
    fontFamily: 'ProximaNovaA-Regular',
    marginLeft: w * 0.18,
    lineHeight: h * 0.04,
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
    width: w * 0.8,
    alignSelf: 'flex-end',
    paddingVertical: w * 0.05,
    paddingRight: w * 0.1,
  },
  inpHeading: {
    fontSize: adjust(16),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Bold',
    marginBottom: h * 0.006,
  },
  inpSubHeading: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: h * 0.01,
  },
  resend: {
    fontSize: adjust(11),
    color: pallette.medium_turquoise,
    fontFamily: 'ProximaNovaA-Semibold',
    marginTop: h * 0.01,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h * 0.007,
    backgroundColor: pallette.white,
    borderRadius: w * 0.01,
    borderWidth: 0.7,
    borderColor: pallette.dark_grey,
    height: h * 0.05,
  },
  input: {
    fontSize: adjust(13),
    color: pallette.black,
    width: '80%',
    height: h * 0.6,
    fontFamily: 'ProximaNovaA-Regular',
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
    fontSize: adjust(13),
    color: pallette.black,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: w * 0.5,
    borderWidth: 1,
    borderColor: pallette.medium_turquoise,
    marginTop: h * 0.02,
    backgroundColor: pallette.white,
  },
  btnTxtCntnr: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: adjust(14),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  btnIcnCntnr: {
    width: '21%',
    height: h * 0.04,
    backgroundColor: pallette.medium_turquoise,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    resizeMode: 'contain',
    tintColor: pallette.black,
    height: h * 0.04,
    width: w * 0.05,
  },
  error: {
    color: pallette.red,
    marginBottom: h * 0.007,
    fontSize: adjust(12),
  },
  codeFieldRoot: {
    marginTop: h * 0.005,
    marginBottom: h * 0.005,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: w * 0.02,
  },
  cell: {
    width: h * 0.04,
    height: h * 0.04,
    borderWidth: 1,
    borderColor: pallette.light_grey,
    borderRadius: 8,
    backgroundColor: pallette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: pallette.electric_indigo,
  },
  cellText: {
    fontSize: adjust(18),
    textAlign: 'center',
    color: pallette.black,
  },
});

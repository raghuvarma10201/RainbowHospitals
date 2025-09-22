import {Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const FormDropdown = ({
  label,
  data,
  value,
  onChange,
  placeholder,
  error,
  styles,
}: any) => (
  <View style={styles.formRow}>
    <Text style={styles.formLabel}>{label}</Text>
    <Dropdown
      style={styles.dropdownSelect}
      selectedTextStyle={styles.selectedText}
      placeholderStyle={styles.placeholderText}
      maxHeight={200}
      value={value}
      data={data}
      valueField="value"
      labelField="label"
      placeholder={placeholder}
      containerStyle={styles.dropdownList}
      itemTextStyle={styles.dropdownList}
      onChange={item => onChange(item.value)}
    />
    {error && <Text style={styles.errorMessage}>{error}</Text>}
  </View>
);

export default FormDropdown;

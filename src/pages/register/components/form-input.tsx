import {Text, TextInput, View} from 'react-native';
import {pallette} from '../../../constants/constants';

const FormInput = ({label, styles, ...props}: any) => (
  <View style={styles.formRow}>
    <Text style={styles.formLabel}>{label}</Text>
    <TextInput
      {...props}
      style={styles.formInput}
      placeholderTextColor={pallette.dark_grey}
    />
    {props.error && <Text style={styles.errorMessage}>{props.error}</Text>}
  </View>
);

export default FormInput;

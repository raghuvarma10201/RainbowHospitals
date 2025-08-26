import {Text, TextInput, View} from 'react-native';

const FormInput = ({label, styles, ...props}: any) => (
  <View style={styles.formRow}>
    <Text style={styles.formLabel}>{label}</Text>
    <TextInput
      {...props}
      style={styles.formInput}
      placeholderTextColor="#000"
    />
    {props.error && <Text style={styles.errorMessage}>{props.error}</Text>}
  </View>
);

export default FormInput;

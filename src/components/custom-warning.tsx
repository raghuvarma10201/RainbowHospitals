import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {pallette} from '../constants/constants';

interface WarningModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  highlightText?: string;
  buttonText?: string;
  highlightColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

const WarningModal: React.FC<WarningModalProps> = ({
  visible,
  onClose,
  title = 'Warning Message',
  message = '',
  highlightText,
  buttonText = 'Okay',
  highlightColor = '#d12f6a',
  containerStyle,
  messageStyle,
}) => {
  // Split message to insert highlight text dynamically
  const parts = message.split('{{highlight}}');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, containerStyle]}>
          <Text style={styles.title}>{title}</Text>

          <Text style={[styles.message, messageStyle]}>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < parts.length - 1 && highlightText && (
                  <Text style={[styles.highlight, {color: highlightColor}]}>
                    {highlightText}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={[styles.buttonText, {color: highlightColor}]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: pallette.black,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: pallette.black,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '600',
  },
  button: {
    alignSelf: 'center',
    marginTop: 22,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: pallette.black,
  },
});

export default WarningModal;

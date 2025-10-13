import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const WarningModal = ({visible, onClose}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Warning Message</Text>

          <Text style={styles.message}>
            Use the existing MPID (if available).{'\n'}
            For every new MPID creation, you will be charged an extra{' '}
            <Text style={styles.highlight}>₹150 - ₹300</Text>.{'\n'}
            Also, new MPIDs will not have the previous records from the
            old/existing MPIDs of the particular patient.
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Okay</Text>
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
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    color: '#d12f6a',
    fontWeight: '600',
  },
  button: {
    alignSelf: 'center',
    marginTop: 22,
  },
  buttonText: {
    color: '#d12f6a',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WarningModal;

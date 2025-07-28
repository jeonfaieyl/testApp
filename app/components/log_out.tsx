import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LogOutScreen = () => {
  const router = useRouter();

  // Cross-platform alert function
  const showAlert = (title: string, message: string, onPress?: () => void) => {
    if (Platform.OS === 'web') {
      // For web, use browser's native confirm
      const userConfirmed = window.confirm(`${title}: ${message}`);
      if (userConfirmed && onPress) {
        onPress();
      }
    } else {
      // For mobile, use React Native Alert
      Alert.alert(title, message, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: onPress,
          style: 'destructive',
        }
      ]);
    }
  };

  const handleLogOut = () => {
    showAlert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      () => {
        // Navigate back to login screen
        router.replace('/');
      }
    );
  };

  const handleCancel = () => {
    // Go back to the previous screen
    router.push('/components/item_list');
  };

  return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="log-out-outline" size={64} color="#0066cc" />
        </View>
        
        <Text style={styles.cardTitle}>Log Out</Text>
        <Text style={styles.cardDescription}>
          Are you sure you want to log out of your account?
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogOut}
          >
            <Text style={styles.logoutButtonText}>Yes, Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  logoutButton: {
    backgroundColor: '#0066cc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default LogOutScreen;
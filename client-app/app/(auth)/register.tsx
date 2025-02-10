import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../redux/features/auth/authSlice';
import { router } from 'expo-router';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
    healthGoals: '',
    physicalDetails: {
      age: '',
      gender: '',
      weight: '',
      height: ''
    },
    activityLevel: '',
    profilePicture: ''
  });

  const dietaryOptions = ['vegetarian', 'vegan', 'keto', 'gluten-free'];
  const healthGoalOptions = ['weight-loss', 'muscle-gain', 'maintenance', 'improve-health'];
  const activityLevelOptions = ['sedentary', 'light', 'moderate', 'active', 'very-active'];
  const genderOptions = ['male', 'female', 'other'];

  const handleRegister = async () => {
    try {
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password) {
        Alert.alert('Error', 'Username, email and password are required');
        return;
      }

      // Convert numeric strings to numbers
      const physicalDetails = {
        ...formData.physicalDetails,
        age: formData.physicalDetails.age ? Number(formData.physicalDetails.age) : undefined,
        weight: formData.physicalDetails.weight ? Number(formData.physicalDetails.weight) : undefined,
        height: formData.physicalDetails.height ? Number(formData.physicalDetails.height) : undefined,
      };

      await dispatch(registerUser({ ...formData, physicalDetails })).unwrap();
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Registration Error', error || 'Failed to register');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {/* Required Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
      </View>

      {/* Physical Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.physicalDetails.age}
          onChangeText={(text) => setFormData({
            ...formData,
            physicalDetails: { ...formData.physicalDetails, age: text }
          })}
        />
        <Picker
          selectedValue={formData.physicalDetails.gender}
          onValueChange={(value) => setFormData({
            ...formData,
            physicalDetails: { ...formData.physicalDetails, gender: value }
          })}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          {genderOptions.map((gender) => (
            <Picker.Item key={gender} label={gender} value={gender} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={formData.physicalDetails.weight}
          onChangeText={(text) => setFormData({
            ...formData,
            physicalDetails: { ...formData.physicalDetails, weight: text }
          })}
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={formData.physicalDetails.height}
          onChangeText={(text) => setFormData({
            ...formData,
            physicalDetails: { ...formData.physicalDetails, height: text }
          })}
        />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Picker
          selectedValue={formData.healthGoals}
          onValueChange={(value) => setFormData({ ...formData, healthGoals: value })}
          style={styles.picker}
        >
          <Picker.Item label="Select Health Goal" value="" />
          {healthGoalOptions.map((goal) => (
            <Picker.Item key={goal} label={goal} value={goal} />
          ))}
        </Picker>
        
        <Picker
          selectedValue={formData.activityLevel}
          onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
          style={styles.picker}
        >
          <Picker.Item label="Select Activity Level" value="" />
          {activityLevelOptions.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  linkText: {
    color: '#007AFF',
  },
});

export default Register;
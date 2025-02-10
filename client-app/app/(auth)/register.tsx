import React, { useState, useCallback, ReactNode } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../redux/features/auth/authSlice';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

interface SectionProps {
  title: string;
  isComplete: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  dietaryPreferences: string[];
  allergies: string[];
  healthGoals: string;
  physicalDetails: {
    age: string;
    gender: string;
    weight: string;
    height: string;
  };
  activityLevel: string;
  profilePicture: string;
}

const Section: React.FC<SectionProps> = ({ title, isComplete, isOpen, onToggle, children }) => {
  console.log(`Section ${title} - isOpen:`, isOpen, 'isComplete:', isComplete);
  
  const animatedStyles = useAnimatedStyle(() => {
    console.log(`Animating section ${title} - height:`, isOpen ? 'auto' : 0);
    return {
      maxHeight: withTiming(isOpen ? 500 : 0, { 
        duration: 300 
      }),
      opacity: withTiming(isOpen ? 1 : 0, { 
        duration: 300 
      }),
    };
  }, [isOpen]);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => {
          console.log(`Section ${title} clicked - current state:`, isOpen);
          onToggle();
        }}
      >
        <View style={styles.sectionHeaderLeft}>
          {isComplete && (
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" style={styles.icon} />
          )}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <MaterialIcons 
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="#007AFF" 
        />
      </TouchableOpacity>
      <Animated.View 
        style={[styles.sectionContent, animatedStyles]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [activeSection, setActiveSection] = useState<number>(0);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    dietaryPreferences: [],
    allergies: [],
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

  const validateSection = (section: string): boolean => {
    switch (section) {
      case 'Account Details':
        return Boolean(formData.username && formData.email && formData.password);
      case 'Physical Details':
        return Boolean(
          formData.physicalDetails.age &&
          formData.physicalDetails.gender &&
          formData.physicalDetails.weight &&
          formData.physicalDetails.height
        );
      case 'Health Preferences':
        return Boolean(formData.healthGoals && formData.activityLevel);
      default:
        return false;
    }
  };

  const sections = [
    {
      title: 'Account Details',
      content: (
        <View>
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
      )
    },
    {
      title: 'Physical Details',
      content: (
        <View>
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
          <View style={styles.pickerContainer}>
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
          </View>
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
      )
    },
    {
      title: 'Health Preferences',
      content: (
        <View>
          <View style={styles.pickerContainer}>
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
          </View>
          <View style={styles.pickerContainer}>
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
        </View>
      )
    }
  ];

  const toggleSection = (index: number) => {
    console.log('Toggling section:', index, 'Current active:', activeSection);
    setActiveSection(prevActive => {
      const newActive = prevActive === index ? -1 : index;
      console.log('New active section:', newActive);
      return newActive;
    });
  };

  const handleRegister = async () => {
    try {
      if (!validateSection('Account Details')) {
        Alert.alert('Error', 'Username, email and password are required');
        return;
      }

      const physicalDetails = {
        age: Number(formData.physicalDetails.age) || undefined,
        gender: formData.physicalDetails.gender || undefined,
        weight: Number(formData.physicalDetails.weight) || undefined,
        height: Number(formData.physicalDetails.height) || undefined,
      };

      console.log("register: ",{ ...formData, physicalDetails });
      await dispatch(registerUser({ ...formData, physicalDetails })).unwrap();
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Registration Error', error || 'Failed to register');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Account</Text>
      
      {sections.map((section, index) => (
        <Section
          key={index}
          title={section.title}
          isComplete={validateSection(section.title)}
          isOpen={activeSection === index}
          onToggle={() => toggleSection(index)}
        >
          {section.content}
        </Section>
      ))}

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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 40,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Register;
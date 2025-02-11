import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../redux/features/auth/authSlice';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SectionProps {
  title: string;
  isComplete: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Section: React.FC<SectionProps> = ({ title, isComplete, isOpen, onToggle, children }) => {
  const animatedStyles = useAnimatedStyle(() => ({
    maxHeight: withTiming(isOpen ? 500 : 0, { duration: 300 }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
  }));

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
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
      <Animated.View style={[styles.sectionContent, animatedStyles]}>
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
  });

  const validateSection = (section: string): boolean => {
    return Boolean(formData.username && formData.email && formData.password);
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
    }
  ];

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index ? -1 : index);
  };

  const handleRegister = async () => {
    try {
      if (!validateSection('Account Details')) {
        Alert.alert('Error', 'Username, email and password are required');
        return;
      }

      await dispatch(registerUser(formData)).unwrap();
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
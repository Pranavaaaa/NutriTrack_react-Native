import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming
} from 'react-native-reanimated';
import { AppDispatch, RootState } from '../../redux/store';

interface SectionProps {
  title: string;
  isComplete: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, isComplete, isOpen, onToggle, children }) => {
  const animatedStyles = useAnimatedStyle(() => ({
    maxHeight: withTiming(isOpen ? 500 : 0, { duration: 300 }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
  }));

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={onToggle}
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
      <Animated.View style={[styles.sectionContent, animatedStyles]}>
        {children}
      </Animated.View>
    </View>
  );
};

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeSection, setActiveSection] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    physicalDetails: {
      age: user?.physicalDetails?.age?.toString() || '',
      gender: user?.physicalDetails?.gender || '',
      weight: user?.physicalDetails?.weight?.toString() || '',
      height: user?.physicalDetails?.height?.toString() || '',
    },
    healthGoals: user?.healthGoals || '',
    activityLevel: user?.activityLevel || '',
  });

  const healthGoalOptions = ['weight-loss', 'muscle-gain', 'maintenance', 'improve-health'];
  const activityLevelOptions = ['sedentary', 'light', 'moderate', 'active', 'very-active'];
  const genderOptions = ['male', 'female', 'other'];

  const sections = [
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
    setActiveSection(activeSection === index ? -1 : index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {sections.map((section, index) => (
        <Section
          key={index}
          title={section.title}
          isComplete={true}
          isOpen={activeSection === index}
          onToggle={() => toggleSection(index)}
        >
          {section.content}
        </Section>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  email: {
    fontSize: 16,
    color: '#888',
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
    overflow: 'hidden',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 15,
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
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
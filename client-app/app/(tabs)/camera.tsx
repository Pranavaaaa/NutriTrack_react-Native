import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function FoodScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [previewVisible, setPreviewVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        Alert.alert('Permission required', 'Need gallery access to upload photos');
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });
      
      setSelectedImage({
        uri: photo.uri,
        base64: photo.base64,
      });
      setPreviewVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera error:', error);
    }
  };

  const toggleCameraType = () => {
   setType(current => (
     current === CameraType.back ? CameraType.front : CameraType.back
   ));
 };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImage({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });
        setPreviewVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
      console.error('Gallery error:', error);
    }
  };

  const retakePhoto = () => {
    setPreviewVisible(false);
    setSelectedImage(null);
    setAnalysisResults([]);
  };

  const analyzePhoto = async () => {
    if (!selectedImage?.base64) return;
    setIsLoading(true);

    try {
      // Google Vision API Call
      const visionResponse = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_API_KEY',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: selectedImage.base64 },
              features: [{ type: 'LABEL_DETECTION', maxResults: 10 }]
            }]
          })
        }
      );

      const visionData = await visionResponse.json();
      const labels = visionData.responses[0]?.labelAnnotations || [];
      
      // Filter food items (add more keywords as needed)
      const foodItems = labels.filter(item => 
        item.description.match(/food|fruit|vegetable|meal|dish|snack/i) && 
        item.score > 0.75
      );

      if (foodItems.length === 0) {
        Alert.alert('No food detected', 'Could not identify any edible items');
        return;
      }

      // Nutrition API Call (replace with your endpoint)
      const nutritionResponse = await fetch('YOUR_NUTRITION_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: foodItems.map(item => item.description) })
      });

      const nutritionData = await nutritionResponse.json();
      setAnalysisResults(nutritionData.items);

    } catch (error) {
      Alert.alert('Analysis failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <ThemedView style={styles.permissionContainer}>
        <ThemedText style={styles.permissionText}>
          Camera permission not granted. Please enable it in settings.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {!previewVisible ? (
        <Camera 
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
        >
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
            >
              <Ionicons name="radio-button-on" size={80} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.galleryButton}
              onPress={openGallery}
            >
              <Ionicons name="images" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
          <View style={styles.previewControls}>
            <TouchableOpacity
              style={[styles.button, styles.retakeButton]}
              onPress={retakePhoto}
            >
              <ThemedText style={styles.buttonText}>Retake</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.analyzeButton]}
              onPress={analyzePhoto}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.buttonText}>Analyze</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {analysisResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <ThemedText style={styles.resultsTitle}>Nutrition Analysis</ThemedText>
          {analysisResults.map((item, index) => (
            <ThemedView key={index} style={styles.resultItem}>
              <ThemedText style={styles.foodName}>{item.name}</ThemedText>
              <ThemedText>Calories: {item.calories}kcal</ThemedText>
              <ThemedText>Protein: {item.protein}g</ThemedText>
              <ThemedText>Carbs: {item.carbs}g</ThemedText>
              <ThemedText>Fat: {item.fat}g</ThemedText>
            </ThemedView>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ff4444',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  flipButton: {
    padding: 15,
  },
  captureButton: {
    alignSelf: 'center',
  },
  galleryButton: {
    padding: 15,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: '#ff4444',
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2c3e50',
  },
});
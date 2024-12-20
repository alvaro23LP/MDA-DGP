import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

// Función de escalado en función del ancho de pantalla
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function UserStepsTask({ navigation, route }) {
  const { studentId, idTarea } = route.params; 
  const [taskData, setTaskData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    navigation.setOptions({
      title: 'Tarea de Pasos',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonExitText}>Salir</Text>
        </TouchableOpacity>
      )
    });

    const fetchTaskData = async (taskId) => {
      try {
        console.log('Buscando tarea:', taskId);
        const taskDoc = await getDoc(doc(db, 'Tareas', taskId));
        if (taskDoc.exists()) {
          return taskDoc.data();
        } else {
          console.log('No se encontró la tarea');
          return null;
        }
      } catch (error) {
        console.error('Error al obtener los datos de la tarea:', error);
        return null;
      }
    };

    const loadTaskData = async () => {
      const data = await fetchTaskData(idTarea);
      setTaskData(data);
    };

    loadTaskData();
  }, [navigation]);

  const showNextStep = () => {
    if (taskData && currentStep < Object.keys(taskData.pasos).length) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert(
        'Tarea completada',
        'Has completado la tarea',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('UserScreen', { studentId: studentId }),
          },
        ],
        { cancelable: false }
      );
    }
  };

  if (!taskData) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const currentStepData = taskData.pasos[currentStep] || {};
  const stepImage = currentStepData.Imagen || require('../../images/no-image-icon.png');
  const stepDescription = currentStepData.Instrucciones || 'No hay descripción disponible';

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <Image source={typeof stepImage === 'string' ? { uri: stepImage } : stepImage} style={styles.stepImage} />
        <Text style={styles.stepDescription}>{stepDescription}</Text>
        <TouchableOpacity style={styles.completeButton} onPress={showNextStep}>
          <Icon name="checkmark-circle" size={scale(50)} color="#1565C0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9EFFF',
    padding: largeScale(10),
  },
  stepContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#1565C0',
    width: '80%',
  },
  stepImage: {
    width: scale(200),
    height: scale(200),
    marginBottom: scale(20),
  },
  stepDescription: {
    fontSize: scale(18),
    color: '#424242',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  completeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
    backgroundColor: '#FEF28A',
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#424242',
  },
  buttonExitText: {
    color: '#fff',
    fontSize: scale(10),
  },
  buttonExit: {
    position: 'absolute',
    top: largeScale(20),
    right: largeScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: largeScale(10),
    borderColor: 'black',
    borderWidth: 1,
    width: '30%',
    height: '60%',
  },
});

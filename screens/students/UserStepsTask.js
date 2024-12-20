import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import AceptButton from '../../componentes/AceptButton';

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
  const [prefPictograma, setPrefPictograma] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Tarea por pasos',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) }, // Color de fondo y tamaño del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título
      headerTitleAlign: 'center', // Centrar el título
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: scale(20) }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={scale(40)} color="#fff" />
        </TouchableOpacity>
      ),
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

    const getStudentData = async () => {
      try {
        const studentDoc = await getDoc(doc(db, 'Estudiantes', studentId));
        if (studentDoc.exists()) {
          const data = studentDoc.data();

          if (data.preferenciasVista === 'Pictograma' || data.preferenciasVista === 'Por defecto' || data.preferenciasVista === 'Imagenes reales') {
            setPrefPictograma(true);
          }
          else if (data.preferenciasVista === 'Texto') {
            setPrefTexto(true);
          }


        } else {
          console.log('No se encontró al alumno');
          Alert.alert('Error', 'No se encontró al alumno con el ID proporcionado.');
        }

      } catch (error) {
        console.error('Error al obtener los datos del alumno:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del alumno. Inténtalo de nuevo.');
      }

    };


    getStudentData();
    loadTaskData();
  }, [navigation]);

  const showNextStep = () => {
    if (taskData && currentStep < Object.keys(taskData.pasos).length) {
      setCurrentStep(currentStep + 1);
    } 
  };
  
  const showPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
  const stepTitle = currentStepData.Titulo || 'Paso sin título';
  const stepDescription = currentStepData.Instrucciones || 'No hay descripción disponible';
  const stepImage = currentStepData.Imagen || require('../../images/no-image-icon.png');

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{stepTitle}</Text>   
        <View style={styles.arrowButtonContainer}>
          <TouchableOpacity
            style={currentStep === 1 ? styles.hidden : styles.arrowLeft}
            onPress={showPreviousStep}
            disabled={currentStep === 1}
          >
            <Icon
              name="arrow-back-circle"
              size={scale(50)}
              color="#1565C0"
            />
          </TouchableOpacity>
          <Image source={typeof stepImage === 'string' ? { uri: stepImage } : stepImage} style={styles.stepImage} />
          <TouchableOpacity
            style={currentStep === Object.keys(taskData.pasos).length ? styles.hidden : styles.arrowRight}
            onPress={showNextStep}
            disabled={currentStep === Object.keys(taskData.pasos).length}
          >
            <Icon
              name="arrow-forward-circle"
              size={scale(50)}
              color="#1565C0"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.stepDescription}>{stepDescription}</Text>

      </View>
      {currentStep === Object.keys(taskData.pasos).length && (
        <AceptButton
          prefPictograma={prefPictograma}
          navigate={navigation}
          idStudent={studentId}
          idTarea={idTarea}
          buttonstyle={styles.aceptButton}
          imageStyle={styles.imageButton}
          textStyle={styles.textAceptButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9EFFF',
    padding: largeScale(0),
  },
  stepContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: scale(0),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#1565C0',
    width: '95%',
    marginBottom: scale(20),
  },
  stepImage: {
    width: scale(200),
    height: scale(200),
  },
  stepDescription: {
    fontSize: scale(14),
    color: '#424242',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  stepTitle: {
    fontSize: scale(18),
    color: '#424242',
    textAlign: 'center',
    marginBottom: scale(10),
    fontWeight: 'bold',
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
  arrowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: scale(20),
  },
  hidden: {
    opacity: 0,
  },
  aceptButton: {        
    flexDirection: 'row',
    backgroundColor: '#9df4a5',
    borderWidth: 3,
    borderColor: '#424242',
    borderRadius: 10,
    alignItems: 'center'
  },
  textAceptButton: {
    marginHorizontal: scale(20),
    fontSize: scale(20),
    color: '#424242',
    fontWeight: 'bold'
  },
  imageButton: {
    width: scale(100),
    height: scale(100),
    marginHorizontal: scale(5)
  }
});

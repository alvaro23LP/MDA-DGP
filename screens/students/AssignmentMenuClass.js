import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Dimensiones para escalado
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function AssignmentMenuClass({ route, navigation }) {
  const { studentId, idTarea } = route.params || {};

  const [classes, setClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Selecciona una clase',
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
  }, [navigation]);

  useEffect(() => {
    if (!idTarea) {
      alert('No se ha proporcionado la información necesaria.');
      return;
    }
    fetchClasses();
  }, [idTarea]);

  const fetchClasses = async () => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const classNames = Object.keys(taskData.Clases || {});
        setClasses(classNames);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error al obtener clases de la base de datos:', error);
    }
  };

  const handleClassSelect = (className) => {
    navigation.navigate('UserMenuTask', {
      studentId,
      idTarea,
      className,
      onComplete: (completedClass) => {
        setCompletedClasses((prev) => [...prev, completedClass]);
      },
    });
  };

  const renderClassItem = ({ item }) => {
    const isCompleted = completedClasses.includes(item);
    return (
      <View style={[styles.outerWrapper, isCompleted && styles.outerWrapperCompleted]}>
        <TouchableOpacity
          style={styles.classItem}
          onPress={() => handleClassSelect(item)}
        >
          <Text style={styles.classText}>{item}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clases disponibles</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item}
        renderItem={renderClassItem}
        contentContainerStyle={styles.classList}
      />

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.acceptButtonText}>Completar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    padding: scale(15),
  },
  title: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: scale(20),
    textAlign: 'center',
  },
  classList: {
    alignItems: 'center',
  },
  // Contenedor externo
  outerWrapper: {
    marginBottom: scale(20), // Espaciado entre las clases
    padding: scale(4), // Espaciado interno para separar el borde verde
  },
  outerWrapperCompleted: {
    borderWidth: 10, // Borde más grueso
    borderColor: 'green', // Borde verde
    borderRadius: scale(15),
  },
  // Contenido de la clase
  classItem: {
    width: scale(200),
    padding: scale(15),
    backgroundColor: '#fff',
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#1565C0',
    alignItems: 'center',
  },
  classText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
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
  buttonExitText: {
      color: '#fff',
      fontSize: scale(15),
      fontWeight: 'bold',
      fontshadowColor: 'black',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 3,
  },
  acceptButton: {
    marginTop: scale(20),
    paddingVertical: scale(15), // Ajuste de altura
    paddingHorizontal: scale(10), // Ajuste horizontal
    backgroundColor: '#FFF59D', // Amarillo claro
    borderRadius: scale(5), // Esquinas más pequeñas
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200), // Ancho similar a la imagen
    borderWidth: 2, // Borde más grueso, similar al de las clases
    borderColor: '#000', // Borde negro
  },
  acceptButtonText: {
    color: '#000', // Texto negro
    fontSize: scale(18),
    fontWeight: 'bold',
  },  
});

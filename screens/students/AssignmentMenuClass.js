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
      headerRight: () => ( // Botón en la esquina superior derecha
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonBackText}>Atrás</Text>
        </TouchableOpacity>
      ),
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
        <Text style={styles.acceptButtonText}>Aceptar</Text>
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
  buttonBack: {
    marginRight: scale(10), // Cambia posición a la derecha
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: '#FF7043',
    borderRadius: scale(6),
  },
  buttonBackText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  acceptButton: {
    marginTop: scale(20),
    paddingVertical: scale(15), // Ajuste de altura
    paddingHorizontal: scale(10), // Ajuste horizontal
    backgroundColor: '#FFF59D', // Amarillo claro
    borderRadius: scale(5), // Esquinas más pequeñas
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(300), // Ancho similar a la imagen
    borderWidth: 2, // Borde más grueso, similar al de las clases
    borderColor: '#000', // Borde negro
  },
  acceptButtonText: {
    color: '#000', // Texto negro
    fontSize: scale(18),
    fontWeight: 'bold',
  },  
});

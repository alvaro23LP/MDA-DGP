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
  const { studentId, idTarea, onComplete } = route.params || {};

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Selecciona una clase',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
      headerLeft: () => (
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
      onComplete: () => {
        if (onComplete) onComplete();
        fetchClasses();
      },
    });
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => handleClassSelect(item)}
    >
      <Text style={styles.classText}>{item}</Text>
    </TouchableOpacity>
  );

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
    justifyContent: 'center', // Centra verticalmente
  },
  title: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: scale(20),
    textAlign: 'center',
  },
  classList: {
    alignItems: 'center', // Centra horizontalmente los botones
  },
  classItem: {
    width: scale(200), // Ancho del botón
    padding: scale(15),
    marginBottom: scale(15),
    backgroundColor: '#fff',
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#1565C0',
    alignItems: 'center', // Centra el texto dentro del botón
  },
  classText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
  },
  buttonBack: {
    marginLeft: scale(10),
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
    paddingVertical: scale(10),
    backgroundColor: '#1565C0',
    borderRadius: scale(10),
    alignItems: 'center',
    alignSelf: 'center', // Centra el botón "Aceptar"
    width: scale(150), // Ancho del botón
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});
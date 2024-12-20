import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa Icon para la flecha
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import AceptButton from '../../componentes/AceptButton'; // Importa el componente AceptButton

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
          title: 'Selecciona una Clase',
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

      <View style={styles.buttonContainer}>
        <AceptButton
          prefPictograma={false} // Si necesitas usar preferencias, ajusta este valor
          navigate={navigation}
          idStudent={studentId}
          idTarea={idTarea}
          buttonstyle={styles.acceptButton}
          textStyle={styles.acceptButtonText}
        />
      </View>
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
  outerWrapper: {
    marginBottom: scale(20),
    padding: scale(4),
  },
  outerWrapperCompleted: {
    borderWidth: 10,
    borderColor: 'green',
    borderRadius: scale(15),
  },
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
  },
  acceptButton: {
    flexDirection: 'row',
    backgroundColor: '#9df4a5',
    borderWidth: 3,
    borderColor: '#424242',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
    width: scale(200),
  },
  acceptButtonText: {
    fontSize: scale(18),
    color: '#424242',
    fontWeight: 'bold',
  },
});

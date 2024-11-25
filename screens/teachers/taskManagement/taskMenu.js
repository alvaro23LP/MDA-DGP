import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, CheckBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const TaskMenu = () => {
  const navigation = useNavigation();
  const [selectedClasses, setSelectedClasses] = useState({
    ClaseA: false,
    ClaseB: false,
    ClaseC: false,
    ClaseD: false,
  });

  useEffect(() => {
    navigation.setOptions({
      title: 'Menú de Tareas', // Título de la pantalla
      headerStyle: { backgroundColor: '#1565C0', height: 50 }, // Estilo del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: 20 }, // Estilo del título
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => navigation.goBack()} // Acción al presionar el botón "Atrás"
        >
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCheckBoxChange = (className) => {
    setSelectedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  const createAndAssignTask = async () => {
    const selected = Object.keys(selectedClasses).filter((key) => selectedClasses[key]);
    if (selected.length === 0) {
      alert('Por favor, selecciona al menos una clase.');
      return;
    }

    const taskData = {
      tipoTarea: "Tarea Menu",
      titulo: "Solicitar la comanda del menú del día", // Nombre predefinido de la tarea
      Clases: {},
    };

    selected.forEach((className) => {
      taskData.Clases[className] = {
        Menu1: ["url", "url", 0],
        Menu2: ["url", "url", 0],
        Menu3: ["url", "url", 0],
        Menu4: ["url", "url", 0],
        Menu5: ["url", "url", 0],
        Menu6: ["url", "url", 0],
      };
    });

    try {
      const docRef = await addDoc(collection(db, 'Tareas'), taskData);
      navigation.navigate('TaskAssignment', { taskId: docRef.id });
    } catch (error) {
      console.error('Error creando la tarea:', error);
      alert('Ocurrió un error al crear la tarea.');
    }
  };

  const createTask = async () => {
    const selected = Object.keys(selectedClasses).filter((key) => selectedClasses[key]);
    if (selected.length === 0) {
      alert('Por favor, selecciona al menos una clase.');
      return;
    }

    const taskData = {
      tipoTarea: "Tarea Menu",
      titulo: "Solicitar la comanda del menú del día", // Nombre predefinido de la tarea
      Clases: {},
    };

    selected.forEach((className) => {
      taskData.Clases[className] = {
        Menu1: ["url", "url", 0],
        Menu2: ["url", "url", 0],
        Menu3: ["url", "url", 0],
        Menu4: ["url", "url", 0],
        Menu5: ["url", "url", 0],
        Menu6: ["url", "url", 0],
      };
    });

    try {
      await addDoc(collection(db, 'Tareas'), taskData);
      alert('Tarea creada exitosamente.');
    } catch (error) {
      console.error('Error creando la tarea:', error);
      alert('Ocurrió un error al crear la tarea.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selecciona las clases</Text>
      {Object.keys(selectedClasses).map((className) => (
        <View key={className} style={styles.classContainer}>
          <Text style={styles.classText}>{className}</Text>
          <CheckBox
            value={selectedClasses[className]}
            onValueChange={() => handleCheckBoxChange(className)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={createAndAssignTask}>
        <Text style={styles.buttonText}>Crear y asignar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={createTask}>
        <Text style={styles.buttonText}>Crear tarea</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  classContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#b2ebf2',
    borderRadius: 8,
  },
  classText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffd600',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default TaskMenu;

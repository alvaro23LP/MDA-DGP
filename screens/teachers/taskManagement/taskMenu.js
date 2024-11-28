import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, CheckBox, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { firebaseConfig } from '../../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const { width, height } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

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
      title: 'Menú de Tareas',
      headerStyle: { backgroundColor: '#1565C0', height: scale(50) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: scale(20) }}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={scale(20)} color="#fff" />
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

  const createTaskInCollection = async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, 'Tareas'), taskData); // Siempre usa 'Tareas'
      return docRef;
    } catch (error) {
      console.error('Error creando la tarea:', error);
      throw new Error('Ocurrió un error al crear la tarea.');
    }
  };

  const saveTaskInDB = async () => {
    const selected = Object.keys(selectedClasses).filter((key) => selectedClasses[key]);
    if (selected.length === 0) {
      alert('Por favor, selecciona al menos una clase.');
      return;
    }

    const taskData = {
      tipoTarea: 'Tarea Menu',
      titulo: 'Solicitar la comanda del menú del día',
      Clases: {},
    };

    selected.forEach((className) => {
      taskData.Clases[className] = {
        Menu1: ['../../../images/Menu.png', 'Menu', 0],
        Menu2: ['../../../images/NoCarne.png', 'Sin Carne', 0],
        Menu3: ['../../../images/Triturado.png', 'Triturado', 0],
        Menu4: ['../../../images/FrutaTriturada.png', 'Fruta Triturada', 0],
        Menu5: ['../../../images/yogur_natillas.png', 'Yogur Natillas', 0],
        Menu6: ['../../../images/Fruta.png', 'Fruta', 0],
      };
    });


    try {
      const docRef = await createTaskInCollection(taskData);
      return docRef;
    } catch (error) {
      alert(error.message);
    }
  };

  

  const createAndAssignTask = async () => {
    const docRef = await saveTaskInDB();
    navigation.navigate('TaskAssignment', { taskId: docRef.id });
  };

  const createTask = async () => {
    saveTaskInDB();
    navigation.navigate('ShowTasks');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Selecciona las clases</Text>
        {Object.keys(selectedClasses).map((className) => (
          <View key={className} style={styles.classContainer}>
            <Text style={styles.classText}>{className}</Text>
            <Switch
              value={selectedClasses[className]}
              onValueChange={() => handleCheckBoxChange(className)}
            />
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={createAndAssignTask}>
          <Text style={styles.textButton}>Crear y asignar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={createTask}>
          <Text style={styles.textButton}>Crear tarea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    padding: scale(20),
  },
  content: {
    backgroundColor: '#D9EFFF',
    margin: scale(20),
    borderRadius: scale(10),
    borderWidth: 4,
    borderColor: '#1565C0',
    padding: scale(20),
  },
  header: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(20),
    color: '#1565C0',
    textAlign: 'center',
  },
  classContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
    padding: scale(10),
    backgroundColor: '#fff',
    borderRadius: scale(10),
    borderColor: '#1565C0',
    borderWidth: 2,
  },
  classText: {
    fontSize: scale(16),
    color: '#424242',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(30),
  },
  button: {
    backgroundColor: '#FEF28A',
    padding: scale(13),
    borderRadius: scale(30),
    alignItems: 'center',
    marginVertical: scale(10),
    borderWidth: 3,
    borderColor: '#424242',
    width: '60%',
  },
  textButton: {
    fontSize: scale(15),
    color: '#424242',
    fontWeight: 'bold',
  },
});

export default TaskMenu;

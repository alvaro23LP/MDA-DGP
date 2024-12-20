import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import MultiSelect from 'react-native-multiple-select';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default function TaskAssignment({ navigation, route }) {
  const { taskId } = route.params || {};
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [preferenciasVista, setPreferenciasVista] = useState([]);
  const [manualDate, setManualDate] = useState('');

  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [searchTask, setSearchTask] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [isStudentModalVisible, setStudentModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Asignar Tarea',
      headerStyle: { backgroundColor: '#1565C0', height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
    });
  }, [navigation]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskSnapshot = await getDocs(collection(db, 'Tareas'));
        const fetchedTasks = taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);
        if (taskId) {
          const selectedTask = fetchedTasks.find((task) => task.id === taskId);
          setTaskTitle(selectedTask?.id || '');
          setSearchTask(selectedTask?.titulo || '');
        }
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, 'Estudiantes'));
        const fetchedStudents = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
      }
    };

    fetchTasks();
    fetchStudents();
  }, [taskId]);

  const assignTask = async () => {
    if (!taskTitle || !selectedStudent || preferenciasVista.length === 0 || !manualDate) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const studentDoc = doc(db, 'Estudiantes', selectedStudent);
      const studentData = students.find((student) => student.id === selectedStudent);

      const [day, month, year] = manualDate.split('/');
      const fechaLimite = new Date(year, month - 1, day);

      const taskRef = doc(db, 'Tareas', taskTitle);

      await updateDoc(studentDoc, {
        agendaTareas: [
          ...(studentData.agendaTareas || []),
          {
            idTarea: taskRef,
            fechaInicio: new Date(),
            fechaLimite: fechaLimite,
          },
        ],
      });

      Alert.alert('Éxito', 'Tarea asignada correctamente.');
      setTaskTitle('');
      setSelectedStudent('');
      setPreferenciasVista([]);
      setManualDate('');
      navigation.goBack();
    } catch (error) {
      console.error('Error al asignar tarea:', error);
      Alert.alert('Error', 'No se pudo asignar la tarea.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tarea a asignar</Text>
        <TouchableOpacity onPress={() => setTaskModalVisible(true)} style={styles.input}>
          <Text>{searchTask || 'Buscar tarea'}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isTaskModalVisible} animationType="slide">
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Buscar tarea"
            value={searchTask}
            onChangeText={setSearchTask}
          />
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setTaskTitle(item.id);
                  setSearchTask(item.titulo);
                  setTaskModalVisible(false);
                }}
              >
                <Text>{item.titulo}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setTaskModalVisible(false)} style={styles.button}>
            <Text style={styles.updateButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alumno asignado</Text>
        <TouchableOpacity onPress={() => setStudentModalVisible(true)} style={styles.input}>
          <Text>{searchStudent || 'Buscar alumno'}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isStudentModalVisible} animationType="slide">
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Buscar alumno"
            value={searchStudent}
            onChangeText={setSearchStudent}
          />
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setSelectedStudent(item.id);
                  setSearchStudent(item.nombre);
                  setStudentModalVisible(false);
                }}
              >
                <Text>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setStudentModalVisible(false)} style={styles.button}>
            <Text style={styles.updateButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Preferencia visual</Text>
        <MultiSelect
          items={[
            { id: 'Pictograma', name: 'Pictograma' },
            { id: 'Imagenes reales', name: 'Imagenes reales' },
            { id: 'Texto', name: 'Texto' },
          ]}
          uniqueKey="id"
          onSelectedItemsChange={(selectedItems) => setPreferenciasVista(selectedItems.slice(-1))}
          selectedItems={preferenciasVista}
          selectText="Selecciona Preferencias de Vista"
          styleDropdownMenuSubsection={styles.MultiSelect}
          styleTextDropdown={{ color: '#000' }}
          styleTextDropdownSelected={{ color: '#000' }}
          submitButtonColor="#90EE90"
          submitButtonTextColor="#000"
          fontSize={20}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha Límite</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={manualDate}
          onChangeText={setManualDate}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={assignTask}>
          <Text style={styles.updateButtonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#D9EFFF',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    fontSize: 22,
    marginBottom: 12,
  },
  MultiSelect: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 3,
    paddingLeft: 8,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: '#FEF28A',
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 50,
  },
  updateButtonText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import MultiSelect from 'react-native-multiple-select';

// Inicializa Firebase
initializeApp(firebaseConfig);

const db = getFirestore();

export default function TaskAssignment({ navigation }) {
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
    // Cargar tareas desde Firebase
    const fetchTasks = async () => {
      try {
        const taskSnapshot = await getDocs(collection(db, 'Tareas'));
        const fetchedTasks = taskSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    // Cargar estudiantes desde Firebase
    const fetchStudents = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, 'Estudiantes'));
        const fetchedStudents = studentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
      }
    };

    fetchTasks();
    fetchStudents();
  }, []);

  // Función para asignar la tarea
  const assignTask = async () => {
    if (!taskTitle || !selectedStudent || preferenciasVista.length === 0 || !manualDate) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const studentDoc = doc(db, 'Estudiantes', selectedStudent);
      const studentData = students.find((student) => student.id === selectedStudent);

      // Agregar la nueva tarea a la agenda del estudiante
      await updateDoc(studentDoc, {
        agendaTareas: [
          ...(studentData.agendaTareas || []),
          {
            idTarea: `/Tareas/${taskTitle}`,
            fechaInicio: new Date(),
            fechaLimite: new Date(manualDate),
          },
        ],
      });

      alert('Tarea asignada correctamente.');
      setTaskTitle('');
      setSelectedStudent('');
      setPreferenciasVista([]);
      setManualDate('');
    } catch (error) {
      console.error('Error al asignar tarea:', error);
      alert('Hubo un problema al asignar la tarea.');
    }
  };

  // Filtrar tareas
  const filterTasks = (text) => {
    setSearchTask(text);
    if (text === '') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(
        tasks.filter((task) =>
          task.titulo.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  // Filtrar estudiantes
  const filterStudents = (text) => {
    setSearchStudent(text);
    if (text === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.nombre.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Asignar tarea</Text>
      </View>

      {/* Tarea a Asignar */}
      <Text style={styles.label}>Tarea a asignar</Text>
      <TouchableOpacity onPress={() => setTaskModalVisible(true)} style={styles.input}>
        <Text>{searchTask || 'Buscar tarea'}</Text>
      </TouchableOpacity>
      <Modal visible={isTaskModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar tarea"
            value={searchTask}
            onChangeText={filterTasks}
          />
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
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
          <TouchableOpacity onPress={() => setTaskModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Alumno Asignado */}
      <Text style={styles.label}>Alumno asignado</Text>
      <TouchableOpacity onPress={() => setStudentModalVisible(true)} style={styles.input}>
        <Text>{searchStudent || 'Buscar alumno'}</Text>
      </TouchableOpacity>
      <Modal visible={isStudentModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar alumno"
            value={searchStudent}
            onChangeText={filterStudents}
          />
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
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
          <TouchableOpacity onPress={() => setStudentModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Preferencia Visual */}
      <Text style={styles.label}>Preferencia visual</Text>
      <MultiSelect
        items={[
          { id: 'Por defecto', name: 'Por defecto' },
          { id: 'Pictograma', name: 'Pictograma' },
          { id: 'Sonido', name: 'Sonido' },
          { id: 'Texto', name: 'Texto' },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={(selected) => setPreferenciasVista(selected)}
        selectedItems={preferenciasVista}
        selectText="Escoger preferencia"
        styleDropdownMenuSubsection={styles.dropdown}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
      />

      {/* Fecha Límite */}
      <Text style={styles.label}>Fecha Límite</Text>
      <TextInput
        style={styles.input}
        placeholder="dd/mm/yyyy"
        value={manualDate}
        onChangeText={setManualDate}
      />

      {/* Botón de aceptar */}
      <TouchableOpacity style={styles.submitButton} onPress={assignTask}>
        <Text style={styles.submitButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    padding: 20,
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 15,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#1565C0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 20,
    marginTop: -5, // Ajuste para evitar que tape el título
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    padding: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#1565C0',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#1565C0',
    fontSize: 16,
    textAlign: 'center',
  },
});

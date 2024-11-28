import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity, 
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import MultiSelect from 'react-native-multiple-select';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function TaskAssignment({ navigation, route }) {
  const { taskId } = route.params || {}; // Recibe el ID de la tarea desde la navegación
  const [taskTitle, setTaskTitle] = useState(''); // ID de la tarea seleccionada
  const [selectedStudent, setSelectedStudent] = useState(''); // ID del estudiante seleccionado
  const [preferenciasVista, setPreferenciasVista] = useState([]); // Preferencias visuales seleccionadas
  const [manualDate, setManualDate] = useState(''); // Fecha límite

  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [students, setStudents] = useState([]); // Lista de estudiantes
  const [filteredTasks, setFilteredTasks] = useState([]); // Filtro para tareas
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtro para estudiantes

  const [searchTask, setSearchTask] = useState(''); // Campo de búsqueda de tareas
  const [searchStudent, setSearchStudent] = useState(''); // Campo de búsqueda de estudiantes

  const [isTaskModalVisible, setTaskModalVisible] = useState(false); // Modal de tareas
  const [isStudentModalVisible, setStudentModalVisible] = useState(false); // Modal de estudiantes

  // Configuración del encabezado
  useEffect(() => {
    navigation.setOptions({
      title: 'Asignar Tarea',
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

  // Cargar tareas y estudiantes desde Firebase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskSnapshot = await getDocs(collection(db, 'Tareas'));
        const fetchedTasks = taskSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);

        // Si el taskId está disponible, selecciona automáticamente la tarea correspondiente
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
  }, [taskId]);

  // Validar fecha
  const isValidDate = (dateString) => {
    const regEx = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateString.match(regEx)) return false; // Formato inválido
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  // Asignar tarea al estudiante
  const assignTask = async () => {
    if (!taskTitle || !selectedStudent || preferenciasVista.length === 0 || !manualDate) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (!isValidDate(manualDate)) {
      alert('Por favor ingresa una fecha válida en el formato dd/mm/yyyy.');
      return;
    }

    try {
      const studentDoc = doc(db, 'Estudiantes', selectedStudent);
      const studentData = students.find((student) => student.id === selectedStudent);

      const [day, month, year] = manualDate.split('/');
      const fechaLimite = new Date(year, month - 1, day);

      await updateDoc(studentDoc, {
        agendaTareas: [
          ...(studentData.agendaTareas || []),
          {
            idTarea: `/Tareas/${taskTitle}`,
            fechaInicio: new Date(),
            fechaLimite: fechaLimite,
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

  // Filtros dinámicos
  const filterTasks = (text) => {
    setSearchTask(text);
    setFilteredTasks(
      text ? tasks.filter((task) => task.titulo.toLowerCase().includes(text.toLowerCase())) : tasks
    );
  };

  const filterStudents = (text) => {
    setSearchStudent(text);
    setFilteredStudents(
      text ? students.filter((student) => student.nombre.toLowerCase().includes(text.toLowerCase())) : students
    );
  };

  return (
    <View style={styles.container}>
      {/* Selector de tareas */}
      <Text style={styles.label}>Tarea a asignar</Text>
      <TouchableOpacity onPress={() => setTaskModalVisible(true)} style={styles.inputButton}>
        <Text style={styles.inputText}>{searchTask || 'Buscar tarea'}</Text>
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
            <Text style={styles.textButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Selector de estudiantes */}
      <Text style={styles.label}>Alumno asignado</Text>
      <TouchableOpacity onPress={() => setStudentModalVisible(true)} style={styles.inputButton}>
        <Text style={styles.inputText}>{searchStudent || 'Buscar alumno'}</Text>
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
            <Text style={styles.textButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Preferencias */}
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
      />

      {/* Fecha límite */}
      <Text style={styles.label}>Fecha Límite</Text>
      <TextInput
        style={styles.input}
        placeholder="dd/mm/yyyy"
        value={manualDate}
        onChangeText={setManualDate}
      />

      {/* Botón Aceptar */}
      <TouchableOpacity style={styles.button} onPress={assignTask}>
        <Text style={styles.textButton}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D9EFFF',
  },
  label: {
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#1565C0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  inputButton: {
    backgroundColor: '#fff',
    borderColor: '#1565C0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  inputText: {
    color: '#000',
  },
  button: {
    backgroundColor: '#FEF28A',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#424242',
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D9EFFF',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FEF28A',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#424242',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 5,
  },
});
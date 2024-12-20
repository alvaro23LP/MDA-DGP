import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Image, Dimensions } from 'react-native';
import { getFirestore, doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseConfig } from '../../../services/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import editIcon from '../../../images/edit.png';
import deleteIcon from '../../../images/eliminar_alumno.png';
import avatarIcon from '../../../images/avatar_1.png';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function UsersManagement({ navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Gestión de tareas', 
      headerStyle: { backgroundColor: '#1565C0',  height: scale(60) },
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

  const [tareas, setTareas] = useState([]);

  const db = getFirestore();
  
  const getTareas = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'Tareas'));
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({ id: doc.id, ...doc.data() });
      });
      setTareas(usuariosData);
    } catch (error) {
      console.error('Error al obtener las tareas: ', error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      getTareas();
    }, [])
  );

  const handleDeleteTask = async (taskId) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'Tareas', taskId));
      Alert.alert('Éxito', 'Tarea eliminada exitosamente');
      setTareas(tareas.filter(user => user.id !== taskId));
    } catch (error) {
      console.error('Error al eliminar la tarea: ', error);
      Alert.alert('Error', 'No se pudo eliminar la tarea');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.addButtonText}>Añadir Tarea</Text>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Lista de Tareas</Text>
      <FlatList
        data={tareas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.titulo}</Text>
            <View style={styles.iconContainer}>
            {item.tipoTarea === "Tarea por pasos" && (
              <TouchableOpacity onPress={() => navigation.navigate('EditTask', { taskId: item.id })}>
                <Image source={editIcon} style={styles.editIcon} />
              </TouchableOpacity>
            )}
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Image source={deleteIcon} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#D9EFFF',
  padding: 20,
},
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF28A', 
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderRadius: 50,
  },
  addButtonText: {
    color: '#000',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#7CC3FD',
    padding: 20,
    marginVertical: 8,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userText: {
    color: '#000',
    fontSize: scale(16),
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editIcon: {
    width: 36, // Aumenta el tamaño del icono de editar
    height: 36, // Aumenta el tamaño del icono de editar
    marginLeft: 20,
    marginRight: 10, // Añade margen derecho para separar los iconos
  },
  deleteIcon: {
    width: 36, // Aumenta el tamaño del icono de borrar
    height: 36, // Aumenta el tamaño del icono de borrar
  },
  listContent: {
    paddingBottom: 20,
  },
});
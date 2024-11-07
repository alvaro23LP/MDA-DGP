import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { getFirestore, doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import editIcon from './images/edit.png';
import deleteIcon from './images/eliminar_alumno.png';
import avatarIcon from './images/avatar_1.png';

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function UsersManagement({ navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Gestión de usuarios', 
      headerStyle: { backgroundColor: '#1565C0',  height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },

    });
  }, [navigation]);

  const [usuarios, setUsuarios] = useState([]);

  const db = getFirestore();
  
  const getUsuarios = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'Estudiantes'));
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al obtener los usuarios: ', error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      getUsuarios();
    }, [])
  );

  const handleDeleteUser = async (userId) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'Estudiantes', userId));
      Alert.alert('Éxito', 'Alumno eliminado exitosamente');
      setUsuarios(usuarios.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar el alumno: ', error);
      Alert.alert('Error', 'No se pudo eliminar el alumno');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.addButtonText}>Añadir Usuario</Text>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
          <Image 
            source={item.fotoAvatar ? { uri: item.fotoAvatar.uri || item.fotoAvatar } : avatarIcon} 
            style={styles.avatar} 
          />
            <Text style={styles.userText}>{item.nombre}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userId: item.id })}>
                <Image source={editIcon} style={styles.editIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
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
    fontSize: 18,
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
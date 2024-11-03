import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function EditUser({ route, navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Editar usuario',  // Cambia el título
      headerStyle: { backgroundColor: '#1565C0',  height: 80 }, // Color de fondo y tamaño del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 }, // Estilo del título

    });
  }, [navigation]);
  
  const { userId } = route.params;
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [discapacidad, setDiscapacidad] = useState('');
  const [ayudasNecesarias, setAyudasNecesarias] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [originalData, setOriginalData] = useState({});

  const db = getFirestore();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Usuarios', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNombre(userData.nombre);
          setEdad(userData.edad);
          setDiscapacidad(userData.discapacidad);
          setAyudasNecesarias(userData.ayudasNecesarias);
          setContrasena(userData.contrasena);
          setOriginalData(userData);
        } else {
          Alert.alert('Error', 'No se encontró el usuario');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario: ', error);
        Alert.alert('Error', 'No se pudo cargar los datos del usuario');
      }
    };

    loadUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    if (nombre === '' || edad === '' || discapacidad === '' || ayudasNecesarias === '' || contrasena === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const updatedData = {};
    if (nombre !== originalData.nombre) updatedData.nombre = nombre;
    if (edad !== originalData.edad) updatedData.edad = edad;
    if (discapacidad !== originalData.discapacidad) updatedData.discapacidad = discapacidad;
    if (ayudasNecesarias !== originalData.ayudasNecesarias) updatedData.ayudasNecesarias = ayudasNecesarias;
    if (contrasena !== originalData.contrasena) updatedData.contrasena = contrasena;

    if (Object.keys(updatedData).length === 0) {
      Alert.alert('Info', 'No se han realizado cambios');
      return;
    }

    try {
      await updateDoc(doc(db, 'Usuarios', userId), updatedData);
      Alert.alert('Éxito', 'Alumno actualizado exitosamente');
      navigation.navigate('UsersManagement'); // Navega a UsersManagement después de actualizar el alumno
    } catch (error) {
      console.error('Error al actualizar el alumno: ', error);
      Alert.alert('Error', 'No se pudo actualizar el alumno');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, 'Usuarios', userId));
      Alert.alert('Éxito', 'Alumno eliminado exitosamente');
      navigation.navigate('UsersManagement'); // Navega a UsersManagement después de eliminar el alumno
    } catch (error) {
      console.error('Error al eliminar el alumno: ', error);
      Alert.alert('Error', 'No se pudo eliminar el alumno');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Alumno</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Discapacidad"
        value={discapacidad}
        onChangeText={setDiscapacidad}
      />
      <TextInput
        style={styles.input}
        placeholder="Ayudas Necesarias"
        value={ayudasNecesarias}
        onChangeText={setAyudasNecesarias}
      />
      <TextInput
        style={[styles.input, styles.passwordInput]}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <Button title="Actualizar Alumno" onPress={handleUpdateUser} />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
        <Text style={styles.deleteButtonText}>Eliminar Alumno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Alinea el contenido al inicio
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9EFFF', // Mismo color de fondo que en UsersManagement.js
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    backgroundColor: '#FFDDC1', // Color de fondo distinto para el campo de contraseña
  },
  deleteButton: {
    backgroundColor: 'red', // Fondo rojo para el botón de eliminar
    padding: 10, // Reduce el padding para hacer el botón más pequeño
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'flex-start', // Alinea el botón a la izquierda
  },
  deleteButtonText: {
    color: '#fff', // Texto blanco
    fontSize: 18,
    fontWeight: 'bold',
  },
});
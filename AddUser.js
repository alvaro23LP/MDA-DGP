import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function AddUser({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [discapacidad, setDiscapacidad] = useState('');
  const [ayudasNecesarias, setAyudas] = useState('');
  const [contrasena, setContrasena] = useState('');

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Añadir usuario',  // Cambia el título
      headerStyle: { backgroundColor: '#1565C0',  height: 80 }, // Color de fondo y tamaño del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 }, // Estilo del título
    });
  }, [navigation]);

  const db = getFirestore();

  const handleAddUser = async () => {
    if (nombre === '' || edad === '' || discapacidad === '' || ayudasNecesarias === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await addDoc(collection(db, 'Usuarios'), {
        nombre,
        edad,
        discapacidad,
        ayudasNecesarias,
        //contrasena,
      });
      Alert.alert('Éxito', 'Alumno agregado exitosamente');
      setNombre('');
      setEdad('');
      setDiscapacidad('');
      setAyudas('');
      setContrasena('');
      navigation.navigate('UsersManagement'); // Navega a UsersManagement después de agregar el alumno
    } catch (error) {
      console.error('Error al agregar el alumno: ', error);
      Alert.alert('Error', 'No se pudo agregar el alumno');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Alumno</Text>
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
        onChangeText={setAyudas}
      />
      <TextInput
        style={[styles.input, styles.passwordInput]}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <Button title="Agregar Alumno" onPress={handleAddUser} />
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
});
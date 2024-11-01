import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function LoginPage({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  const db = getFirestore();

  const handleLogin = async () => {
    if (nombre.trim() === '' || contrasena.trim() === '') {
      Alert.alert('Error', 'Nombre y contraseña son obligatorios.');
      return;
    }

    try {
      const q = query(
        collection(db, 'Profesores'),
        where('nombre', '==', nombre),
        where('contrasena', '==', contrasena)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        // Aquí puedes navegar a la siguiente pantalla después del inicio de sesión exitoso
        navigation.navigate('HomeScreen'); // Cambia 'HomeScreen' al nombre de la pantalla que deseas navegar
      } else {
        Alert.alert('Error', 'Nombre o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      Alert.alert('Error', 'No se pudo iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#C0E8F1', // Cambia el color de fondo si lo deseas
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%', // Ajusta el ancho al contenedor
  },
});

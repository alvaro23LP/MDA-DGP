import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta
import logo from './images/Logo2-SinFondo.png';

// Obtener el ancho de la pantalla
const { height, width } = Dimensions.get('window');


// Inicializa Firebase
initializeApp(firebaseConfig);

export default function LoginPage({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');

  const db = getFirestore();


  const handleLogin = async () => {
    // Verifica que los campos no estén vacíos
    if (!nombre || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    try {
      // Crea una consulta para buscar el usuario en la colección "Profesores"
      const q = query(
        collection(db, 'Profesores'),
        where('nombre', '==', nombre),
        where('contraseña', '==', contrasena)
      );
  
      const querySnapshot = await getDocs(q);
  
      // Verifica si se encontró un documento que coincida
      if (!querySnapshot.empty) {
        alert('Inicio de sesión exitoso.');
        navigation.navigate('TeachersMainScreen');
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message); // Asegúrate de acceder al mensaje de error como string
      alert('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
    
  };
  
   

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image style={styles.logoImage} source={logo} />

      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="Introduzca su usuario"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      
      {/* BOTONES */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.03,
    backgroundColor: '#D9EFFF', 
  },

  logoImage: {
    position: 'absolute',
    top: 50,
    width: width*0.65,
    height: undefined,
    aspectRatio: 5,
    marginBottom: 80, 
  },

  title: {
    fontSize: width * 0.075,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    color: '#000', 
  },

  input: {
    height: height * 0.052,
    borderColor: '#888', 
    borderWidth: 1,
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.04,
    width: '85%',
    borderRadius: 5, 
    fontSize: width * 0.045,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: height * 0.015,
    borderRadius: 36,
    alignItems: 'center',
    marginBottom: height * 0.04,
    borderWidth: 1,
    borderColor: '#111',
  },

  loginButton: {
    backgroundColor: '#FEF28A', 
    width: '60%',
  },
  backButton: {
    backgroundColor: '#7CC3FD',
    width: '40%',
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.044,
  },
});

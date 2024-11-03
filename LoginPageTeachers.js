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

  /////////////////////////////////////////////////////////////////
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
        where('Usuario', '==', nombre),
        where('Contraseña', '==', contrasena)
      );
  
      const querySnapshot = await getDocs(q);
  
      // Verifica si se encontró un documento que coincida
      if (!querySnapshot.empty) {
        alert('Inicio de sesión exitoso.');
        //navigation.navigate('Login')
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
  };
  
   /////////////////////////////////////////////////////////////////

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
        
        <Button title="AvanzarPantalla" onPress={() => navigation.navigate('teachersMainScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#D9EFFF', 
  },

  logoImage: {
    position: 'absolute',
    top: 50,
    width: width*0.55,
    height: undefined,
    aspectRatio: 5,
    marginBottom: 80, 
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: height*0.05,
    color: '#222', 
  },

  input: {
    height: 40,
    borderColor: '#888', 
    borderWidth: 1,
    marginBottom: height*0.05,
    paddingHorizontal: 10,
    width: '85%',
    borderRadius: 2, 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: height*0.03, 
    borderRadius: 30, 
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
    color: '#000', // Color de texto blanco
    fontWeight: 'bold',
    fontSize: 16,
  },
});

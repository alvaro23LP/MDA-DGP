import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const userImages = [
  require('./images/user1.png'),
  require('./images/user2.png'),
];

export default function HomeScreen({ navigation }) {
  const handleStudentLogin = () => {
    navigation.navigate('LoginUser');
  };

  const handleAdminLogin = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Inicio de sesión de usuario',  // Cambia el título
      headerStyle: { backgroundColor: '#1565C0',  height: 100 }, // Color de fondo y tamaño del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 }, // Estilo del título

    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.selectUserText}>Elige tu usuario</Text>
      
      {/* Contenedor para englobar todas las imágenes de usuarios */}
      <View style={styles.userContainer}>
        <View style={styles.userGrid}>
          {userImages.map((image, index) => (
            <TouchableOpacity key={index} style={styles.userIcon} onPress={handleStudentLogin}>
              <Image source={image} style={styles.userImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Boton login de profesores */}
      <TouchableOpacity style={styles.loginButton} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión Administrador/Profesor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  selectUserText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  userContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  userGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  userIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  loginButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

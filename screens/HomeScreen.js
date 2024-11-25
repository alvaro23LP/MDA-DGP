import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image,button, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default function HomeScreen({ navigation}) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Inicio de sesión de usuario',
      headerStyle: { backgroundColor: '#1565C0', height: 100 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
    });

    // Función para obtener todos los estudiantes
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'Estudiantes');
        const studentSnapshot = await getDocs(studentsCollection);
        const studentsList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsList);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [navigation]);

  const handleStudentLogin = (studentId) => {
    navigation.navigate('LoginUser', { studentId });
  };

  const handleAdminLogin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectUserText}>Elige tu usuario</Text>

      <View style={styles.userContainer}>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.userIcon}
              onPress={() => handleStudentLogin(student.id)}
            >
              <Image 
                source={
                  student.fotoAvatar && typeof student.fotoAvatar === 'string'
                    ? { uri: student.fotoAvatar }
                    : require('../images/avatar_1.png')
                }
                style={styles.userImage}
              />

            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión Administrador/Profesor</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('TaskFotocopias')}>
        <Text style={styles.buttonText}>prueba</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ShowFotocopia', { idAlumno: 'valorIdAlumno', idTarea: 'ykR7kuaIs1ps8aj5o03f' })}>
        <Text style={styles.buttonText}>prueba2</Text>
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
    padding: 40,
  },
  selectUserText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    marginTop: 100,
  },
  userContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginBottom: 200,
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
    top: 15,
    right: 15,
    backgroundColor: '#1565C0',
    textShadowColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    shadowColor: '#000',
    textShadowColor: '#000', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 3, 
  },
});
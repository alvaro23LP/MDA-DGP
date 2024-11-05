import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default function HomeScreen({ navigation }) {
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
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectUserText}>Elige tu usuario</Text>

      <View style={styles.userContainer}>
        <ScrollView contentContainerStyle={styles.userGrid}>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.userIcon}
              onPress={() => handleStudentLogin(student.id)}
            >
              <Image source={{ uri: student.fotoAvatar }} style={styles.userImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

// Función de escalado en función del ancho de pantalla
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function HomeScreen({ navigation}) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Inicio de sesión de usuario',
      headerStyle: { backgroundColor: '#1565C0', height: 100 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
      headerTitleAlign: 'center',
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

  // mostrar contenido de la lista de estudiantes
  // useEffect(() => {
  //   console.log(students);
  // }, [students]);

  const handleStudentLogin = (studentId) => {
    navigation.navigate('LoginUser', { studentId });
  };

  const handleAdminLogin = () => {
    navigation.navigate('LoginPage');
  };

  const getFontSize = (name) => { //Funcion para ajustar nombre en funcion de su longitud
    if (name.length > 20) {       // para que no se salga del cuadro
        return scale(9);
    } else if (name.length > 10) {
        return scale(11);
    } else {
        return scale(12);
    }
};

  return (
    <View style={styles.container}>
      {/* <Text style={styles.selectUserText}>Elige tu usuario</Text> */}

      <View style={styles.userContainer}>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.userIcon}
              onPress={() => handleStudentLogin(student.id)}
            >
              <View style={styles.userIconContent}>
                <Image
                  source={
                    student.fotoAvatar && typeof student.fotoAvatar === 'string'
                      ? { uri: student.fotoAvatar }
                      : require('../images/avatar_1.png')
                  }
                  style={styles.userImage}
                />

                <Text style={[styles.userName, { fontSize: getFontSize(student.nombre) }]}>{student.nombre}</Text>

              </View>

            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión Administrador/Profesor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ExtraButton2} onPress={() => navigation.navigate('ShowFotocopia', { idAlumno: 'valorIdAlumno', idTarea: 'ykR7kuaIs1ps8aj5o03f' })}>
        <Text style={styles.buttonText}>Pantalla Tarea Fotocopias</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.ExtraButton3} onPress={() => navigation.navigate('UserMenuTask', { idTarea: 'kyPBZo38maFbjVwcWupy' })}>
        <Text style={styles.buttonText}>Pantalla Menus</Text>
      </TouchableOpacity>
      

      {/* estudiante PruebaDavid y tarea por pasos */}
      <TouchableOpacity style={styles.ExtraButton4} onPress={() => navigation.navigate('UserStepsTask', { idAlumno: 'JNPHNDw2nCF9vbqVdcEN', idTarea: 'OReKtR3EGKxb8oWSBKwc' })}> 
        <Text style={styles.buttonText}>Pantalla Tarea por pasos</Text>
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
    paddingTop: largeScale(200),
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
    borderColor: '#1565C0',
    borderWidth: 1,
  },
  userIcon: {
    width: scale(75),
    height: scale(90),
    backgroundColor: '#e8e8e8',
    padding: 4,
    borderRadius: 15,
    margin: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    width: scale(50),
    height: scale(50),  
    borderRadius: 10,
    borderColor: '#1565C0',
    borderWidth: 3,
  },
  userName: {
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
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

  ExtraButton2: {
    position: 'absolute',
    top: 20,
    left: 15,
    backgroundColor: '#1565C0',
    textShadowColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  ExtraButton3: {
    position: 'absolute',
    top: 70,
    left: 15,
    backgroundColor: '#1565C0',
    textShadowColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  ExtraButton4: {
    position: 'absolute',
    top: 120,
    left: 15,
    backgroundColor: '#1565C0',
    textShadowColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import avatar from './images/avatar_1.png';
import editIcon from './images/edit.png';


// Inicializa Firebase
initializeApp(firebaseConfig);

export default function UsersManagement({ navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Lista de usuarios',  // Cambia el título
      headerStyle: { backgroundColor: '#1565C0',  height: 80 }, // Color de fondo y tamaño del encabezado
      headerTintColor: '#fff', // Color del texto
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 }, // Estilo del título

    });
  }, [navigation]);

  const [usuarios, setUsuarios] = useState([]);

  const db = getFirestore();
  
  const getUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Usuarios'));
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(usuariosData);
      console.log('Usuarios obtenidos:', usuariosData); // Log para verificar los datos obtenidos
    } catch (error) {
      console.error('Error al obtener los usuarios: ', error);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.addButtonText}>Agregar Usuario</Text>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image style={styles.avatar} source={avatar} />
            <Text style={styles.userText}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userId: item.id })}>
              <Image source={editIcon} style={styles.editIcon} />
            </TouchableOpacity>
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
  backgroundColor: '#fff',
  padding: 20,
  overflow: 'hidden',
},
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFE0', // Amarillo claro
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#000', // Texto negro
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Centra el texto
  },
  userItem: {
    backgroundColor: '#ADD8E6', // Azul claro
    padding: 20,
    marginVertical: 8,
    borderRadius: 50, // Aumenta el valor para bordes más redondeados
    flexDirection: 'row', // Alinea los elementos en fila
    alignItems: 'center', // Centra verticalmente los elementos
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userText: {
    color: '#000', // Texto negro
    fontSize: 18,
  },
  editIcon: {
    width: 32,
    height: 32,
    marginLeft: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
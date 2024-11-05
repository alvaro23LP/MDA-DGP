import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import editIcon from './images/edit.png';


// Inicializa Firebase
initializeApp(firebaseConfig);

export default function UsersManagement({ navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Lista de usuarios', 
      headerStyle: { backgroundColor: '#1565C0',  height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },

    });
  }, [navigation]);

  const [usuarios, setUsuarios] = useState([]);
  
  const getUsuarios = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'Estudiantes'));
      const usuariosData = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al obtener los usuarios: ', error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      getUsuarios();
    }, [])
  );

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
            <Image source={{ uri: item.fotoAvatar }} style={styles.avatar} />

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
  backgroundColor: '#D9EFFF',
  padding: 20,
  overflow: 'hidden',
},
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFE0', 
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderRadius: 50,
  },
  addButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#87CEEB',
    padding: 20,
    marginVertical: 8,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userText: {
    color: '#000',
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
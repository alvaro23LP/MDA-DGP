import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

//Esto es una prueba de commit

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');

  // Inicializa Firestore
  const db = getFirestore();

  // Función para obtener usuarios de Firestore
  const getUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, 'Usuarios'));
    const usuariosData = [];
    querySnapshot.forEach((doc) => {
      usuariosData.push({ id: doc.id, ...doc.data() });
    });
    setUsuarios(usuariosData);
  };

  // Función para agregar un nuevo usuario
  const handleAddUsuario = async () => {
    if (nombre.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

    try {
      await addDoc(collection(db, 'Usuarios'), {
        nombre: nombre,
      });
      Alert.alert('Éxito', 'Nombre agregado con éxito.');
      setNombre(''); // Limpiar el campo de texto
      getUsuarios(); // Volver a obtener la lista de usuarios
    } catch (error) {
      console.error('Error al agregar el nombre: ', error);
      Alert.alert('Error', 'No se pudo agregar el nombre.');
    }
  };

  useEffect(() => {
    getUsuarios(); // Llama a la función al cargar el componente
  }, []);

  return (
    <View style={styles.container}>
      <Text>Lista de Usuarios:</Text>
      <FlatList
        data={usuarios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{item.nombre}</Text> // Muestra el campo "nombre"
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="Agregar Usuario" onPress={handleAddUsuario} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%', // Ocupar el ancho completo
  },
});

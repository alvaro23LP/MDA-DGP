import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function EditUser({ route, navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Editar usuario', 
      headerStyle: { backgroundColor: '#1565C0',  height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },

    });
  }, [navigation]);
  
  const { userId } = route.params;
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [contrasena1, setContrasena1] = useState('0');
  const [contrasena2, setContrasena2] = useState('0');
  const [tipoDiscapacidad, setTipoDiscapacidad] = useState([]);
  const [preferenciasVista, setPreferenciasVista] = useState([]);
  const [fotoAvatar, setFotoAvatar] = useState(null);

  const [originalData, setOriginalData] = useState({});

  const db = getFirestore();
  const storage = getStorage();


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Estudiantes', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNombre(userData.nombre);
          setEdad(userData.edad);
          setContrasena1(userData.contrasenaVisual[0]);
          setContrasena2(userData.contrasenaVisual[1]);
          setTipoDiscapacidad(userData.tipoDiscapacidad);
          setPreferenciasVista(userData.preferenciasVista);
          setFotoAvatar(userData.fotoAvatar);
          setOriginalData(userData);
        } else {
          Alert.alert('Error', 'No se encontró el usuario');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario: ', error);
        Alert.alert('Error', 'No se pudo cargar los datos del usuario');
      }
    };

    loadUserData();
  }, [userId]);

  const handleFileChange = async () => {
    launchImageLibrary({}, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setFotoAvatar(source.uri);

        // Subir la imagen a Firebase Storage
        const responseBlob = await fetch(source.uri);
        const blob = await responseBlob.blob();
        const storageRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(storageRef, blob);

        // Obtener la URL de descarga de la imagen
        const downloadURL = await getDownloadURL(storageRef);
        setFotoAvatar(downloadURL);
      }
    });
  };

  const handleUpdateUser = async () => {
    if (nombre === '' || edad === '' || tipoDiscapacidad.length === 0 || preferenciasVista.length === 0) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    const updatedData = {};

    if (nombre !== originalData.nombre) updatedData.nombre = nombre;

    if (edad !== originalData.edad) updatedData.edad = edad;

    if (contrasena1 !== originalData.contrasenaVisual[0] || contrasena2 !== originalData.contrasenaVisual[1]) updatedData.contrasenaVisual = [contrasena1, contrasena2];

    if (tipoDiscapacidad !== originalData.tipoDiscapacidad) updatedData.tipoDiscapacidad = tipoDiscapacidad;

    if (preferenciasVista !== originalData.preferenciasVista) updatedData.preferenciasVista = preferenciasVista;

    if (fotoAvatar !== originalData.fotoAvatar) updatedData.fotoAvatar = fotoAvatar;
    


    if (Object.keys(updatedData).length === 0) {
      Alert.alert('Info', 'No se han realizado cambios');
      return;
    }

    try {
      await updateDoc(doc(db, 'Estudiantes', userId), updatedData);
      Alert.alert('Éxito', 'Alumno actualizado exitosamente');
      navigation.navigate('UsersManagement');
    } catch (error) {
      console.error('Error al actualizar el alumno: ', error);
      Alert.alert('Error', 'No se pudo actualizar el alumno');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, 'Estudiantes', userId));
      Alert.alert('Éxito', 'Alumno eliminado exitosamente');
      navigation.navigate('UsersManagement');
    } catch (error) {
      console.error('Error al eliminar el alumno: ', error);
      Alert.alert('Error', 'No se pudo eliminar el alumno');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Alumno</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
      </View>

      <MultiSelect
        items={[
          { id: 'Visual', name: 'Visual' },
          { id: 'Auditiva', name: 'Auditiva' },
          { id: 'Motriz', name: 'Motriz' },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => setTipoDiscapacidad(selectedItems)}
        selectedItems={tipoDiscapacidad}
        selectText="Selecciona Discapacidades"
        submitButtonText="Seleccionar"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
      />
      
      <MultiSelect
        items={[
          { id: 'Normal', name: 'Normal' },
          { id: 'Pictograma', name: 'Pictograma' },
          { id: 'Sonido', name: 'Sonido' },
          { id: 'Texto', name: 'Texto' },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => setPreferenciasVista(selectedItems)}
        selectedItems={preferenciasVista}
        selectText="Selecciona Preferencias de Vista"
        submitButtonText="Seleccionar"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
      />

    <View style={styles.pickerContainer}>
      <Button title="Select File"/>
    </View>

      <View style={styles.inputContainer}>
        <Text>Contraseña:</Text>
        <Picker
          selectedValue={contrasena1}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena1(itemValue)}
        >
          {[...Array(10).keys()].map((num) => (
            <Picker.Item key={num} label={num.toString()} value={num.toString()} />
          ))}
        </Picker>
        <Picker
          selectedValue={contrasena2}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena2(itemValue)}
        >
          {[...Array(10).keys()].map((num) => (
            <Picker.Item key={num} label={num.toString()} value={num.toString()} />
          ))}
        </Picker>
      </View>
      <Button title="Actualizar Alumno" onPress={handleUpdateUser} />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
        <Text style={styles.deleteButtonText}>Eliminar Alumno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    backgroundColor: '#fff',
  },
  fileInputContainer: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  MultiSelect: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
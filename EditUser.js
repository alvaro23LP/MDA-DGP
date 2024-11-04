import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';

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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

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

      <View style={styles.fileInputContainer}>
        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      </View>

      <View style={styles.pickerContainer}>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    backgroundColor: '#FFDDC1',
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
  MultiSelect: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  fileInputContainer: {
    marginBottom: 20,
  },
  fileInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  picker: {
    height: 50,
    width: 100,
  },
});
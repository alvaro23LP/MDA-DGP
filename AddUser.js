import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';


// Inicializa Firebase
initializeApp(firebaseConfig);

export default function AddUser({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [contrasena1, setContrasena1] = useState('0');
  const [contrasena2, setContrasena2] = useState('0');
  const [tipoDiscapacidad, setTipoDiscapacidad] = useState([]);
  const [preferenciasVista, setPreferenciasVista] = useState([]);
  const [fotoAvatar, setFotoAvatar] = useState(null);

  const items = [
    { id: 'Visual', name: 'Visual' },
    { id: 'Auditiva', name: 'Auditiva' },
    { id: 'Motriz', name: 'Motriz' },
  ];

  const preferenciasItems = [
    { id: 'Normal', name: 'Normal' },
    { id: 'Pictograma', name: 'Pictograma' },
    { id: 'Sonido', name: 'Sonido' },
    { id: 'Texto', name: 'Texto' },
  ];
  
  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Añadir usuario',
      headerStyle: { backgroundColor: '#1565C0',  height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
    });
  }, [navigation]);

  const db = getFirestore();

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

  const handleAddUser = async () => {
    if (nombre === ''){
      alert('El nombre no puede estar vacío', '');
      return;
    }
    else if (edad === ''){
      alert('La edad no puede estar vacía', '');
      return;
    }
    else if (tipoDiscapacidad.length === 0){
      alert('Debes seleccionar al menos un tipo de discapacidad', '');
      return;
    }
    else if (preferenciasVista.length === 0){
      alert('Debes seleccionar al menos una preferencia de vista', '');
      return;
    }
    else if (fotoAvatar === null){
      alert('Debes seleccionar una foto de avatar', '');
      return;
    }

    if (isNaN(edad)) {
      alert('La edad debe ser un número', '');
      return;
    }

    const contrasenaVisual = [contrasena1, contrasena2];

    try {
      await addDoc(collection(getFirestore(), 'Estudiantes'), {
        nombre,
        edad,
        tipoDiscapacidad,
        preferenciasVista,
        fotoAvatar,
        historialTareas: [],
        contrasenaVisual,
      });
      Alert.alert('Éxito', 'Alumno agregado exitosamente');
      // Limpiar el formulario después de agregar el usuario
      setNombre('');
      setEdad('');
      setTipoDiscapacidad([]);
      setPreferenciasVista([]);
      setContrasena1('0');
      setContrasena2('0');
      setFotoAvatar(null);

      navigation.navigate('UsersManagement');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el alumno');
      console.error('Error al agregar el alumno: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      />

    <MultiSelect
        items={items}
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
        items={preferenciasItems}
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

    
      <Button title="Agregar Alumno" onPress={handleAddUser} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
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
    marginBottom: 20,
  },
  picker: {
    height: 40,
    width: 80,
  },
});
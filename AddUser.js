import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
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
    { id: 'Por defecto', name: 'Por defecto' },
    { id: 'Visual', name: 'Visual' },
    { id: 'Auditiva', name: 'Auditiva' },
    { id: 'Motriz', name: 'Motriz' },
  ];

  const preferenciasItems = [
    { id: 'Por defecto', name: 'Por defecto' },
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
    <View style={styles.container}>
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
          />
      </View>

    <Text style={styles.label}>Diversidad funcional</Text>
    <MultiSelect
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => setTipoDiscapacidad(selectedItems)}
        selectedItems={tipoDiscapacidad}
        selectText="Selecciona diversidad funcional"
        submitButtonText="Seleccionar"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
      />
      
      <Text style={styles.label}>Preferencia de vista</Text>
      <MultiSelect
        items={preferenciasItems}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => setPreferenciasVista(selectedItems)}
        selectedItems={preferenciasVista}
        selectText="Selecciona Preferencias de vista"
        submitButtonText="Seleccionar"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
      />
      <View style={styles.fileInputContainer}>
        <Button title="Select File"/>
      </View>

      <View style={styles.pickerContainer}>
      <Text style={styles.label}>Contraseña</Text>
      <Picker
          selectedValue={contrasena1}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena1(itemValue)}
          itemStyle={styles.pickerItem} // Añade esta línea
        >
          {[...Array(9).keys()].map((num) => (
            <Picker.Item key={num} label={num.toString()} value={num.toString()} />
          ))}
        </Picker>
        <Picker
          selectedValue={contrasena2}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena2(itemValue)}
          itemStyle={styles.pickerItem} // Añade esta línea
        >
          {[...Array(9).keys()].map((num) => (
            <Picker.Item key={num} label={num.toString()} value={num.toString()} />
          ))}
        </Picker>
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.addButtonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#D9EFFF', 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    backgroundColor: '#fff',
    fontSize: 20,
    marginBottom: 12,
  },
  MultiSelect: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  fileInputContainer: {
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
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
    width: 90,
    backgroundColor: '#ffff',
    marginHorizontal: 10,
  },
  pickerItem: {
    color: '#000', // Asegúrate de que el color del texto sea visible
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#FEF28A', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
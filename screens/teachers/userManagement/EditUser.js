import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatarToCloudinary } from '../../../services/cloudinary';


// Inicializa Firebase
initializeApp(firebaseConfig);


const fruitOptions = [
  { id: '0', name: 'Uvas' },
  { id: '1', name: 'Pina' },
  { id: '2', name: 'Sandia' },
  { id: '3', name: 'Fresa' },
  { id: '4', name: 'Limon' },
  { id: '5', name: 'Manzana' },
  { id: '6', name: 'Pimiento' },
  { id: '7', name: 'Naranja' },
  { id: '8', name: 'Aguacate' },
];


export default function EditUser({route, navigation }) {

  useEffect(() => {
    // Configura las opciones del encabezado
    navigation.setOptions({
      title: 'Editar alumno', 
      headerStyle: { backgroundColor: '#1565C0',  height: 80 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },

    });

    // Solicita permisos para acceder a la galería de imágenes
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Se requieren permisos para acceder a la galería de imágenes.');
          }
        })();

  }, [navigation]);
  
  const { userId } = route.params;
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [contrasena1, setContrasena1] = useState('0');
  const [contrasena2, setContrasena2] = useState('0');
  const [tipoDiscapacidad, setTipoDiscapacidad] = useState([]);
  const [preferenciasVista, setPreferenciasVista] = useState([]);
  const [fotoAvatar, setSelectedImage] = useState(null);

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
          setTipoDiscapacidad(
            userData.tipoDiscapacidad 
              ? userData.tipoDiscapacidad.split(',').map(item => item.trim()) 
              : []
          );
          setPreferenciasVista(
            userData.preferenciasVista 
              ? userData.preferenciasVista.split(',').map(item => item.trim()) 
              : []
          );          
          setSelectedImage(userData.fotoAvatar);
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

  

  const pickImage = async () => {
      console.log('Opening image picker...');
      // Solicitar permiso para acceder a la galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permissionResult.granted) {
        alert('Se requiere permiso para acceder a la galería');
        return;
      }
  
      // Abrir la galería para seleccionar una imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
        allowsEditing: true, // Permitir recortar la imagen
        aspect: [1, 1], // Relación de aspecto opcional
        quality: 1, // Calidad de la imagen (1 = máxima calidad)
      });
  
      if (!result.canceled) {
        // Almacenar la URI de la imagen seleccionada
        setSelectedImage(result.assets[0].uri);
        console.log(result.assets[0].uri);
      } else {
        console.log('Selección de imagen cancelada');
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

    if (tipoDiscapacidad !== originalData.tipoDiscapacidad) 
      updatedData.tipoDiscapacidad = Array.isArray(tipoDiscapacidad) ? tipoDiscapacidad.join(', ') : tipoDiscapacidad; // Convierte array a string  

    if (preferenciasVista !== originalData.preferenciasVista) 
      updatedData.preferenciasVista = Array.isArray(preferenciasVista) ? preferenciasVista.join(', ') : preferenciasVista;

    if (fotoAvatar !== originalData.fotoAvatar){
      const uploadResult = await uploadAvatarToCloudinary(fotoAvatar);
      let fotoAvatarUrl = null;
      fotoAvatarUrl = uploadResult.secure_url;
      updatedData.fotoAvatar = fotoAvatarUrl;
    }
    

    if (Object.keys(updatedData).length === 0) {
      Alert.alert('Info', 'No se han realizado cambios');
      navigation.navigate('UsersManagement');
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

  const handleSelectionChange = (selectedItems) => {
    // Solo mantenemos el último seleccionado
    selectedItems = selectedItems.slice(-1);
    setPreferenciasVista(selectedItems);
  };

  const handleSelectionChange2 = (selectedItems) => {
    // Solo mantenemos el último seleccionado
    selectedItems = selectedItems.slice(-1);
    setTipoDiscapacidad(selectedItems);
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
          keyboardType="numeric"
        />
      </View>
      
      <Text style={styles.labelS1}>Diversidad funcional</Text>
      <MultiSelect
        items={[
          { id: 'Por defecto', name: 'Por defecto' },
          { id: 'Visual', name: 'Visual' },
          { id: 'Cognitiva', name: 'Cognitiva' },
          { id: 'Motriz', name: 'Motriz' },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => handleSelectionChange2(selectedItems)}
        selectedItems={tipoDiscapacidad}
        selectText="Selecciona diversidad funcional"
        submitButtonText="Seleccionar"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
        fontSize={20}
      />

      <Text style={styles.labelS2}>Preferencia de vista</Text>
      <MultiSelect
        items={[
          { id: 'Por defecto', name: 'Por defecto' },
          { id: 'Pictograma', name: 'Pictograma' },
          { id: 'Imagenes reales', name: 'Imagenes reales' },
          { id: 'Texto', name: 'Texto' },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={selectedItems => handleSelectionChange(selectedItems)}
        selectedItems={preferenciasVista}
        selectText="Selecciona Preferencias de Vista"
        styleDropdownMenuSubsection={styles.MultiSelect}
        styleTextDropdown={{ color: '#000' }}
        styleTextDropdownSelected={{ color: '#000' }}
        submitButtonColor="#90EE90"
        submitButtonTextColor="#000"
        fontSize={20}
      />

    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{ marginRight: 50 }}>
              <Text style={styles.label}>Foto Avatar</Text>
              <Button title="Seleccionar Imagen" onPress={pickImage} />
            </View>
            {fotoAvatar && (
              <Image source={{ uri: fotoAvatar }} style={styles.avatarImage} />
            )}
    </View>

      <View style={styles.pickerContainer}>
      <Text style={styles.label}>Contraseña</Text>
        <Picker
          selectedValue={contrasena1}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena1(itemValue)}
        >
          {fruitOptions.map((fruit) => (
            <Picker.Item key={fruit.id} label={fruit.name} value={fruit.id} />
          ))}
        </Picker>
        <Picker
          selectedValue={contrasena2}
          style={styles.picker}
          onValueChange={(itemValue) => setContrasena2(itemValue)}
        >
          {fruitOptions.map((fruit) => (
            <Picker.Item key={fruit.id} label={fruit.name} value={fruit.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUser}>
          <Text style={styles.updateButtonText}>Aceptar</Text>
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
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    fontSize: 22,
    marginBottom: 12,
  },
  MultiSelect: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 3,
    paddingLeft: 8,
    marginBottom: 20,
  },
  fileInputContainer: {
    marginBottom: 20,
    marginTop: 40,
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
    marginBottom: 50,
    marginTop: 30,
  },
  picker: {
    height: 60,
    width: 200,
    backgroundColor: '#ffff',
    marginHorizontal: 10,
  },
  pickerItem: {
    color: '#000',
  },
  label: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labelS1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  labelS2: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: '#FEF28A', 
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 50,
  },
  updateButtonText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 100,
    height: 100,
    marginTop: 30,
    borderRadius: 10,
  },
});
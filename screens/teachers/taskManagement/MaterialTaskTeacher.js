import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));



export default function MaterialTaskTeacher({navigation}) {
    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Crear Tarea de Material', 
          headerStyle: { backgroundColor: '#1565C0',  height: scale(50) }, 
          headerTintColor: '#fff', // Color del texto
          headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, 
          headerLeft: () => (
            <TouchableOpacity
                style={{ marginLeft: scale(20) }}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={scale(20)} color="#fff" />
            </TouchableOpacity>
            ),
          
        });
      }, [navigation]);

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [materialsMap, setMaterialsMap] = useState(new Map());

    const predefinedMaterials = ['Lapices', 'Pinceles', 'Gomas', 'Celo', 'Témpera', 'Pegamento', 'Tijeras', 
                                  'Plastilina', 'Cartulina', 'Anillas'];

    const addMaterial = () => {
        if (selectedMaterial && quantity && descripcion) {
            const newMaterialsMap = new Map(materialsMap);
            newMaterialsMap.set(selectedMaterial, { quantity: parseInt(quantity), descripcion });
            setMaterialsMap(newMaterialsMap);
            setSelectedMaterial('');
            setQuantity('');
            setDescripcion('');
            console.log('Materials Map:', newMaterialsMap);
        } else {
            console.log('Por favor, complete todos los campos antes de añadir el material.');
        }
    };

    const saveTaskInDB = async () => {
        if (materialsMap.size === 0) {
            console.log('No hay materiales para guardar.');
            return;
        }

        const materials = {};
        materialsMap.forEach((value, key) => {
            materials[key] = {
                Cantidad: value.quantity,
                Descripcion: value.descripcion
            };
        });

        const taskData = {
            materiales: materials,
            tipoTarea: 'Recogida de material',
            titulo: 'Recogida de material'
        };

        try {
            const docRef = await addDoc(collection(db, 'Tareas'), taskData);
            console.log('Tarea guardada correctamente');
            return docRef;
        } catch (error) {
            console.error('Error al guardar la tarea:', error);
        }

        
    };

    const createAndAssignTask = async () => {
        const docRef = await saveTaskInDB();
        navigation.navigate('TaskAssignment', { taskId: docRef.id });
    };

    const createTask = async () => {
        await saveTaskInDB();
        navigation.navigate('ShowTasks');
    };

    return(
        <View style={{backgroundColor:'#D9EFFF', flex:1 }}>
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedMaterial}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedMaterial(itemValue)}
                    >
                        <Picker.Item label="Seleccione un material" value="" />
                        {predefinedMaterials.map((material, index) => (
                            <Picker.Item key={index} label={material} value={material} style={styles.pickerItem} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, styles.inputCantidad]}
                        placeholder="Cantidad"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <TextInput
                        style={[styles.input, styles.inputDescripcion]}
                        placeholder="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={addMaterial}>
                    <Text style={styles.textButton}>Añadir Material</Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer2}>
                    <TouchableOpacity style={styles.button} onPress={createAndAssignTask}>
                        <Text style={styles.textButton}>Crear y asignar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={createTask}>
                        <Text style={styles.textButton}>Crear tarea</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D9EFFF',
      margin: scale(20),
      borderRadius: scale(10),
      borderWidth: 4,
      borderColor: '#1565C0',
      height: height * 0.35, 
    },
    inputContainer: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: '#D9EFFF',
      borderColor: '#1565C0',
      height: height * 0.17, 
      width: '70%',
    },
    input: {
      height: 60,
      borderColor: '#1565C0',
      borderWidth: 2,
      marginVertical: 30,
      paddingHorizontal: 18,
      borderRadius: 10,
      backgroundColor: '#fff',
      fontSize: scale(14),
    },
    inputCantidad: {
      width: '40%', 
    },
    inputDescripcion: {
      width: '100%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 13,
      margin: 10,
      borderStyle: 'solid',
      borderWidth: 3,
      borderRadius: 30,
      marginTop: 50,
      backgroundColor: '#FEF28A',
      borderColor: '#424242',
      width: '55%', 
    },
    textButton:{
        fontSize: scale(15),
        fontColor: '#424242',
        fontWeight: 'bold',
    },
    pickerContainer: {
      borderColor: '#1565C0',
      borderWidth: 3,
      borderRadius: 10,
      backgroundColor: '#fff',
      marginBottom: scale(20),
      width: '80%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        width: '100%',
    },
    pickerItem: {
      fontSize: scale(14), // Tamaño de letra más grande para los elementos del Picker
   },
  });




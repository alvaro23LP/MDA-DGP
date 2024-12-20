import { View,Text,TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React from 'react';
import {useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import DropDownPicker from 'react-native-dropdown-picker';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));



export default function TaskFotocopias({navigation})
{
    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Tarea de fotocopias',  // Cambia el título
          headerStyle: { backgroundColor: '#1565C0',  height: scale(50) }, // Color de fondo y tamaño del encabezado
          headerTintColor: '#fff', // Color del texto
          headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título
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

      const [selectedFotocopias, setSelectedFotocopias] = useState('');
      const [selectedColor, setSelectedColors] = useState(''); 
      const [openFotocopias, setOpenFotocopias] = useState(false);
      const [openColor, setOpenColor] = useState(false);
      const [quantity, setQuantity] = useState('');



      const saveTaskInDB = async () => {

        if (!quantity || selectedFotocopias === '' || selectedColor === '') {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }

        //Datos de la tarea
        const taskData = {
            cantidad: parseInt(quantity) ,
            tipo: selectedFotocopias,
            tipoColor: selectedColor,
            tipoTarea: 'Fotocopias',
            titulo: 'Fotocopias/Plastificado',
        };
  

        // Guarda la tarea en la base de datos
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

      

    return (
        <View style={{backgroundColor:'#D9EFFF', flex:1,  alignItems: 'center' }}>
            <View style={styles.container}>

            
                <DropDownPicker
                    style={styles.pickers}
                    placeholder="Selecciona un tipo"
                    open={openFotocopias}
                    value={selectedFotocopias}
                    items={[
                        { label: 'Fotocopia', value: 'Fotocopia' },
                        { label: 'Plastificado', value: 'Plastificado' },
                    ]}
                    setOpen={setOpenFotocopias}
                    setValue={setSelectedFotocopias}
                    textStyle={{ color: '#424242', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic' }}
                />
                
                

                <TextInput
                    style={styles.textInput}
                    placeholder='Cantidad de fotocopias'
                    value={quantity}
                    keyboardType="numeric"
                    onChangeText={setQuantity} 
                    onFocus={() => setQuantity('')}
                />

                
                <DropDownPicker
                    style={styles.pickers}
                    placeholder="Selecciona blanco y negro o color"
                    open={openColor}
                    value={selectedColor}
                    items={[
                        { label: 'Color', value: 'Color' },
                        { label: 'Blanco y negro', value: 'Blanco y negro' },
                    ]}
                    setOpen={setOpenColor}
                    setValue={setSelectedColors}
                    textStyle={{ color: '#424242', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic' }}
                />
                
            </View>

        
            <View style={{marginVertical:scale(100), width: '70%'}}>
                
                <TouchableOpacity style={styles.button} onPress={createAndAssignTask} >
                    <Text style={styles.textButton}> Crear y asignar </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={createTask}>
                    <Text style={styles.textButton}> Crear Tarea </Text>
                </TouchableOpacity>
                
            </View>
            
        </View> 

        
    );

}

const styles = StyleSheet.create({
    container: {
        marginTop: scale(20),
        width: '90%',
        backgroundColor: '#D9EFFF',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        borderWidth: 4,
        borderColor:'#1565C0',
        
    },

    textInput:{
        marginVertical:10,
        backgroundColor: '#D9EFFF',
        padding:10,
        height: 70, 
        width: '50%',
        borderRadius: 10,
        borderWidth: 3,
        borderColor:'#1565C0',
        fontSize: 18, 
        fontWeight: 'bold', 
        fontStyle: 'italic', 
        color: '#424242'
    },

    pickers:{
        marginVertical:20,
        backgroundColor: '#D9EFFF',
        color: '#424242',
        height: scale(30),
        width: 'auto',
        borderColor: '#1565C0',
        borderWidth: 3,
        borderRadius: 10,
        fontSize: 18, // Tamaño del texto
        fontWeight: 'bold', // Estilo del texto (negrita)
        fontStyle: 'italic'
    },



    button: {
        backgroundColor: '#FEF28A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(30),
        width: '100%', 
        height: scale(30), 
        padding: 10,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#424242',
    },

    textButton: {
        fontSize: scale(10), // Ajusta el tamaño del texto del botón
        color: '#424242',
        fontWeight: 'bold',
    }

    
});
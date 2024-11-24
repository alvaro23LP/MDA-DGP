import { View,Text,TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React from 'react';
import {useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

import DropDownPicker from 'react-native-dropdown-picker';

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

      const saveTask = async () => {
        // Aquí debes agregar la lógica para guardar la tarea en la base de datos
        // Por ejemplo, si estás usando Firebase:
        // await firebase.firestore().collection('tasks').add({
        //     text,
        //     selectedFotocopias,
        //     selectedColor,
        // });

        // Después de guardar la tarea, navega de regreso a la página anterior
        navigation.goBack();
    };

    const assingnSaveTask = async () => {
        // Aquí debes agregar la lógica para asignar la tarea a un alumno y guardarla en la base de datos
        // Por ejemplo, si estás usando Firebase:
        // await firebase.firestore().collection('tasks').add({
        //     text,
        //     selectedFotocopias,
        //     selectedColor,
        //     assignedTo: selectedUser,
        // });
        navigation.goBack();
    };

      const [selectedFotocopias, setSelectedFotocopias] = useState('0');
      const [selectedColor, setSelectedColors] = useState('0'); 
      const [openFotocopias, setOpenFotocopias] = useState(false);
      const [openColor, setOpenColor] = useState(false);
      const [text, setText] = useState('Cantidad de fotocopias');

    return (
        <View style={{backgroundColor:'#D9EFFF', flex:1,  alignItems: 'center' }}>
            <View style={styles.container}>

            
                <DropDownPicker
                    style={styles.pickers}
                    placeholder="Selecciona una tipo"
                    open={openFotocopias}
                    value={selectedFotocopias}
                    items={[
                        { label: 'Fotocopia', value: '1' },
                        { label: 'Plastificado', value: '2' },
                    ]}
                    setOpen={setOpenFotocopias}
                    setValue={setSelectedFotocopias}
                    textStyle={{ color: '#424242', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic' }}
                />
                
                


                <TextInput
                    style={styles.textInput}
                    value={text}
                    onChangeText={setText} 
                    onFocus={() => setText('')}
                />

                
                <DropDownPicker
                    style={styles.pickers}
                    placeholder="Selecciona blanco y negro o color"
                    open={openColor}
                    value={setOpenColor}
                    items={[
                        { label: 'Color', value: '1' },
                        { label: 'Blanco y negro', value: '2' },
                    ]}
                    setOpen={setOpenColor}
                    setValue={setSelectedColors}
                    textStyle={{ color: '#424242', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic' }}
                />
                
            </View>

        
            <View style={{marginVertical:scale(100), width: '70%'}}>
                
                <TouchableOpacity style={styles.button} onPress={assingnSaveTask} >
                    <Text style={styles.textButton}> Asignar y Crear </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={saveTask}>
                    <Text style={styles.textButton}> Crear Tarea </Text>
                </TouchableOpacity>
                
            </View>
            
        </View> 

        
    );

}

const styles = StyleSheet.create({
    container: {
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
        fontSize: 18, // Tamaño del texto
        fontWeight: 'bold', // Estilo del texto (negrita)
        fontStyle: 'italic', // Estilo del texto (cursiva)
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
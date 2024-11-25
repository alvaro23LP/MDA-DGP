import { View,Text,Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React from 'react';
import {useState, useEffect } from 'react';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

const fotocopiaImage = require('../../images/fotocopia.png'); 
const plastificarImage = require('../../images/plastificar.png');


// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));






export default function ShowFotocopia({navigation,route}){
    const [cantidad, setCantidad] = useState('');
    const [tipo, setTipo] = useState('');
    const [tipoColor, setTipoColor] = useState('');
    const { idTarea } = route.params;
    console.log(idTarea);


    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Fotocopias',  // Cambia el título
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

        const getTaskData = async () => {
            try {
                const taskDoc = await getDoc(doc(db, 'Tareas', idTarea));
                if (taskDoc.exists()) {
                    const taskData = taskDoc.data();
                    setCantidad(taskData.cantidad);
                    setTipo(taskData.tipo);
                    setTipoColor(taskData.tipoColor);
                } else {
                    console.log('No se encontró la tarea');
                    Alert.alert('Error', 'No se encontró la tarea con el ID proporcionado.');
                }
            } catch (error) {
                console.error('Error al obtener los datos de la tarea:', error);
                Alert.alert('Error', 'Hubo un problema al obtener los datos de la tarea. Inténtalo de nuevo.');
            }
        };
    
        getTaskData();
           
      }, [navigation, idTarea]);


      const selectedImage = tipo === 'Fotocopia' ? fotocopiaImage : plastificarImage;

      

      

      return(
        <View style={{backgroundColor:'#D9EFFF', flex:1 }}>

            <View style={styles.container}>
                {/* Pictograma fotocopia y plastificar https://arasaac.org/pictograms/search/fotocopia  https://arasaac.org/pictograms/search/plastificar*/}
                <Image source={selectedImage} style={{width: scale(200), height: scale(200), marginVertical:scale(20)}}/>
                <View style={styles.textContainer}><Text style={styles.text}>{tipo}</Text></View>
                <View style={styles.textContainer}><Text style={styles.text}>{cantidad}</Text></View>

                <View style={styles.textContainer}><Text style={styles.text}>{tipoColor}</Text></View>

            </View>



        </View>

      );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: scale(10),
        marginVertical: scale(20),
        alignItems: 'center',
        backgroundColor: '#D9EFFF',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        borderWidth: 4,
        borderColor:'#1565C0',
        
    },
    textContainer: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#1565C0',
        margin: 20,
    },

    text: {
        marginVertical: scale(10),
        marginHorizontal: scale(30),
        fontSize: scale(20), 
        color: '#424242',
        fontWeight: 'bold'
    },
});
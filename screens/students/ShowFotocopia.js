import { View,Text,Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React from 'react';
import {useState, useEffect } from 'react';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import AceptButton from '../../componentes/AceptButton';

const fotocopiaImage = require('../../images/fotocopias/fotocopia.png'); 
const plastificarImage = require('../../images/fotocopias/plastificar.png');
const okImage = require('../../images/fotocopias/hecho.png');
const colorImage = require('../../images/fotocopias/color.png');
const blancoNegroImage = require('../../images/fotocopias/blancoNegro.png');


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
    const {studentId} = route.params;
    const [studentData, setStudentData] = useState({});
    const [prefTexto, setPrefTexto] = useState(false);
    const [prefPictograma, setPrefPictograma] = useState(false);
    const [prefImagenesReales, setPrefImagenesReales] = useState(false);
    
    

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

        const getStudentData = async () => 
        {
            try{
                const studentDoc = await getDoc(doc(db, 'Estudiantes', studentId));
                if(studentDoc.exists()){
                    const data = studentDoc.data();
                    setStudentData(data);
                    
                    if(data.preferenciasVista === 'Pictograma' || data.preferenciasVista === 'Por defecto' || data.preferenciasVista === 'Imagenes reales'){
                        setPrefPictograma(true);
                    }
                    else if(data.preferenciasVista === 'Texto'){
                        setPrefTexto(true);
                    }

                    
                }else{
                    console.log('No se encontró al alumno');
                    Alert.alert('Error', 'No se encontró al alumno con el ID proporcionado.');
                }
    
            }catch(error){
                console.error('Error al obtener los datos del alumno:', error);
                Alert.alert('Error', 'Hubo un problema al obtener los datos del alumno. Inténtalo de nuevo.');
            }
        
        };
    
        getStudentData();
        getTaskData();

           
    }, [navigation, idTarea, studentId]);

   


    

    const selectedImage = tipo === 'Fotocopia' ? fotocopiaImage : plastificarImage;
    const selectedColor = tipoColor === 'Color' ? colorImage : blancoNegroImage;
    
      return(
        <View style={{backgroundColor:'#D9EFFF', flex:1 }}>

            <View style={styles.container}>
                {/* Pictograma fotocopia y plastificar https://arasaac.org/pictograms/search/fotocopia  https://arasaac.org/pictograms/search/plastificar*/}
                
                <View style={styles.container1}>
                    {prefPictograma &&
                        <Image source={selectedImage} style={{width: scale(140), height: scale(140)}}/>
                    }
                    
                    <View style={styles.textContainer}><Text style={styles.text}>{tipo}</Text></View>
                    
                </View>

                
                <View style={styles.textContainer}><Text style={styles.text}>{cantidad}</Text></View>

                <View style={styles.container2}>

                    {prefPictograma &&
                        <Image source={selectedColor} style={{width: scale(110), height: scale(110), marginHorizontal:scale(20)}}/>
                    }
                    
                    <View style={styles.textContainer2}><Text style={styles.text}>{tipoColor}</Text></View>
                    
                </View>

                <View style={styles.containerButton}>

                    <AceptButton
                        prefPictograma={prefPictograma}
                        navigate={navigation}
                        idStudent={studentId}
                        idTarea={idTarea}
                        buttonstyle={styles.aceptButton}
                        imageStyle={styles.imageButton}
                        textStyle={styles.textAceptButton}
                    />

                </View>
                

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

    container1: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#424242',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: scale(10),
    },

    container2: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#424242',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: scale(10),
    },

    textContainer: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#1565C0',
        marginHorizontal: scale(15),
    },
    textContainer2: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#1565C0',
        marginHorizontal: scale(20),
    },

    text: {
        marginVertical: scale(10),
        marginHorizontal: scale(20),
        fontSize: scale(15), 
        color: '#424242',
        fontWeight: 'bold'
    }, 

    containerButton: {
        justifyContent: 'flex-end',
        marginBottom: scale(20),
        alignItems: 'center',
    },

    aceptButton: {
        
        flexDirection: 'row',
        backgroundColor: '#9df4a5',
        borderWidth: 3,
        borderColor: '#424242',
        borderRadius: 10, 
        alignItems: 'center'
        
    },

    textAceptButton: {
        marginHorizontal: scale(20),
        fontSize: scale(20), 
        color: '#424242', 
        fontWeight: 'bold'
        
    },

    imageButton: {
        width: scale(100),
        height: scale(100),
        marginHorizontal: scale(5)
    }

    

});
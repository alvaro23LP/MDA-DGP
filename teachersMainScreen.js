import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');
console.log(width);

const scale = (size) => (width < 375 ? size : size * (width / 375));



export default function teachersMainScreen({navigation})
{

    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Inicio',  // Cambia el título
          headerStyle: { backgroundColor: '#1565C0',  height: scale(50) }, // Color de fondo y tamaño del encabezado
          headerTintColor: '#fff', // Color del texto
          headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título

          headerRight: () => (
            <TouchableOpacity
                style={styles.buttonExit}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={{color: '#fff', fontSize: scale(10), marginRight: scale(10)}}>Cerar Sesión</Text>
                <Icon name="exit" size={scale(20)} color="#fff" /> {}
            </TouchableOpacity>
            ),  
          
        });
      }, [navigation]);


    return(

        <View style={{backgroundColor:'#C0E8F1', flex:1 }}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton}> Gestion de Alumnos </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton} onPress={() => navigation.navigate('taskManagement')}> Gestion de Tareas </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor: '#C0E8F1',
      padding: 20,
      margin: 30,
      borderRadius: 10,
      borderWidth: 4,
      borderColor:'#1565C0'

    },

    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },

    button: {
      backgroundColor: '#FEF28A',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: '10%', 
      width:'80%',
      height: '20%',
      padding: 10,
      margin: 10,

      borderStyle: 'solid',
      borderWidth: 3,
      borderRadius: 10,
      borderBlockColor:'#424242',
      
    },

    textButton:{
        fontSize: scale(20),
        fontColor: '#424242',
        fontWeight: 'bold',
    },

    buttonExit: { 
        marginRight: scale(20), 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: 'red',
        padding: scale(5),
        borderRadius:5,
        borderColor: 'black',
        borderWidth: 2,

    }
    
  });


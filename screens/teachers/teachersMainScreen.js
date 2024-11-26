import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));



export default function TeachersMainScreen({navigation})
{

    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Inicio',  // Cambia el título
          headerStyle: { backgroundColor: '#1565C0',  height: scale(60) }, // Color de fondo y tamaño del encabezado
          headerTintColor: '#fff', // Color del texto
          headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título

          headerRight: () => (
            <TouchableOpacity
                style={styles.buttonExit}
                onPress={() => navigation.navigate('LoginPage')}
            >
                <Text style={{color: '#fff', fontSize: scale(10), marginRight: scale(10)}}>Cerar Sesión</Text>
                <Icon name="exit" size={scale(20)} color="#fff" /> 
            </TouchableOpacity>
            ),  
          
        });
      }, [navigation]);


    return(

        <View style={{backgroundColor:'#D9EFFF', flex:1 }}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton} onPress={() => navigation.navigate('UsersManagement')}> Gestión de usuarios </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShowTasks')}>
                    <Text style={styles.textButton}> Gestión de Tareas </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskAssignment')}>
                    <Text style={styles.textButton} > Asignar tareas </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#D9EFFF',
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
      borderRadius: 35,
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


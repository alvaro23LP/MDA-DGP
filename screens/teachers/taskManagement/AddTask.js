import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React from 'react';
import { useEffect } from 'react';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function TaskManagement({navigation})
{

    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Seleciona tipo de tarea',  // Cambia el título
          headerStyle: { backgroundColor: '#1565C0',  height: scale(60) }, // Color de fondo y tamaño del encabezado
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


    return(

        <View style={{backgroundColor:'#D9EFFF', flex:1 }}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StepsTask')}>
                    <Text style={styles.textButton}> Tarea por pasos </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MaterialTaskTeacher')}>
                    <Text style={styles.textButton}> Tarea de material </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskFotocopias')}>
                    <Text style={styles.textButton}> Tarea de fotocopias </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskMenu')}>
                    <Text style={styles.textButton}> Tarea de menú </Text>
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
      backgroundColor: '#D9EFFF',
      padding: 45,
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
      marginVertical: '5%', 
      width:'83%',
      height: '18%',
      padding: 10,
      margin: 0,
      borderStyle: 'solid',
      borderWidth: 3,
      borderRadius: 35,
      borderBlockColor:'#424242',
      
    },

    textButton:{
        fontSize: scale(20),
        fontColor: '#424242',
        fontWeight: 'bold',
    }
    
  });


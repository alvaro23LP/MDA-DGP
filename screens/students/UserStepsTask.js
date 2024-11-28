import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

// Función de escalado en función del ancho de pantalla
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function UserMaterialTask({ navigation, route }) {

    useEffect(() => {
        navigation.setOptions({
            title: 'Tarea de Pasos',
            headerStyle: { backgroundColor: '#1565C0',  height: scale(70) }, // Color de fondo y tamaño del encabezado
            headerTintColor: '#fff', // Color del texto
            headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título
            headerLeft: () => null,
            headerRight: () => (
                <TouchableOpacity
                    style={styles.buttonExit}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonExitText}>Salir</Text>
                </TouchableOpacity>
            )
          });
    }, [navigation]);

    

    return (
        <View style={styles.container}>
            
                
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9EFFF',
        padding: largeScale(10),
    },
    title: {
        fontSize: largeScale(35),
        fontWeight: 'bold',
        color: '#424242',
        marginTop: largeScale(30),
    },
    buttonExitText: {
        color: '#fff',
        fontSize: scale(10),
    },
    contenedorTarea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9EFFF',
        width: width,
    },
    contendorMaterialesVista: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        paddingHorizontal: largeScale(5),
        borderRadius: largeScale(10),
        width: width * 0.70,
        height: height * 0.80,
    },
    unidadMaterial: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        paddingHorizontal: 30,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: '#1565C0',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    textoMaterial: {
        flexDirection: 'column',
    },
    tituloMaterial: {
        fontSize: largeScale(28),
        color: '#111',
        marginLeft: scale(10),
        fontWeight: 'bold', 
    },
    descripcionMaterial: {
        fontSize: largeScale(26),
        color: '#222',
        marginLeft: scale(10),
    },

    buttonExit: { 
        position: 'absolute',
        top: largeScale(20),
        right: largeScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        padding: largeScale(10),
        borderColor: 'black',
        borderWidth: 1,
        width: '30%',
        height: '60%',
    },
    materialSwitch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
    materialTextCompleted: {
        textDecorationLine: 'line-through',
    },
    showMoreButton: {
        position: 'absolute',
        alignItems: 'center',
        marginTop: largeScale(10),
        backgroundColor: '#FEF28A', 
        borderRadius: largeScale(30),
        padding: largeScale(10),
        borderWidth: 1,
        borderColor: '#1565C0', 
    },
    buttonRight: {
        right: largeScale(30),
    },
    buttonLeft: {
        left: largeScale(30),
    },
});

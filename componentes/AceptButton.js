import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { getFirestore, getDoc, doc,updateDoc,increment } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const okImage = require('../images/fotocopias/hecho.png');

const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));




//Se le pasan los buleando de las preferencias de vista del usuraio
const AceptButton = ({ prefPictograma, navigate, idStudent, idTarea, styles }) => {
    
    // Función para formatear la fecha: dd/mm/yyyy hora:minutos:segundos
    const formatFechaSimple = (date) => {
        const dia = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos (getMonth inicia en 0)
        const año = date.getFullYear(); // Año
        const horas = String(date.getHours()).padStart(2, '0'); // Hora
        const minutos = String(date.getMinutes()).padStart(2, '0'); // Minutos
        const segundos = String(date.getSeconds()).padStart(2, '0'); // Segundos

        return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
    };

    const markTaskAsDone = async () => {
        try {
            //Obtener los datos del estudiante
            const studentDoc = await getDoc(doc(db, 'Estudiantes', idStudent));
            if (!studentDoc.exists()) {
                console.error('El estudiante no existe');
                return;
            }
            //Obtener la agenda de tareas del estudiante
            const agendaTareas = studentDoc.data().agendaTareas

            
            const updatedAgenda = agendaTareas.map((tarea) => {
                if (tarea.idTarea.id === idTarea) { 
                    return {
                        ...tarea,
                        fechaCompletada: formatFechaSimple(new Date()), // Fecha actual formateada
                    };
                }
                return tarea; // Devolver la tarea sin cambios si no coincide
            });

            await updateDoc(doc(db, 'Estudiantes', idStudent), { 
                agendaTareas: updatedAgenda,
                tareasCompletadas: increment(1) // Incrementa en 1 el contador de tareas completadas
            });
            console.log('Tarea marcada como completada');
            
        } catch (error) {
            console.error('Error al marcar la tarea como hecha: ', error);
        }
    };

    const handleButtonPress = async () => {
        await markTaskAsDone();

        navigate.navigate('RefuerzoPositivo');
        setTimeout(() => {
            navigate.pop(2);
        }, 3000); // Espera 3 segundos antes de regresar a la página anterior

    };


    return (
        <TouchableOpacity style={styles.aceptButton} onPress={() => handleButtonPress(navigate)}>
            {prefPictograma && (
                <Image source={okImage} style={styles.imageButton} />
            )}
            
            <Text style={styles.textAceptButton}>Hecho</Text>
            
        </TouchableOpacity>
    );
};

/*const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: '#9df4a5',
        borderWidth: 3,
        borderColor: '#424242',
        borderRadius: 10, 
        alignItems: 'center'
        
    },

    textButton: {
        marginHorizontal: scale(20),
        fontSize: scale(20), 
        color: '#424242', 
        fontWeight: 'bold'
        
    }
});*/

export default AceptButton;
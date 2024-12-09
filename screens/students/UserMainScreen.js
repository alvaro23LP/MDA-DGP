import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
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

export default function UserScreen({ navigation, route }) {
    const { studentId } = route.params; 
    const [preferenciasVista, setPreferenciasVista] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        navigation.setOptions({
          headerShown: false, // Oculta el encabezado
        });
    }, [navigation]);

    useEffect(() => {
        const fetchPreferences = async () => {
            const userDoc = await getDoc(doc(db, 'Estudiantes', studentId));
            const userData = userDoc.data();
            setStudentName(userData.nombre); 
            setPreferenciasVista(userData.preferenciasVista);

            // Obtener las tareas del campo agenteTareas
            const tareasMap = userData.agendaTareas || {};
            const tareasList = [];

            for (const key in tareasMap) {
                if (tareasMap.hasOwnProperty(key)) {
                    // Obtener los datos de la agendaTareas del alumno
                    const tarea = tareasMap[key];
                    const tareaDocRef = tarea.idTarea; 
                    console.log('tareaDocRef:', tareaDocRef);

                    // Obtener los datos de la tarea
                    const tareaDoc = await getDoc(tareaDocRef);
                    const tareaData = tareaDoc.data();
                    const tareaObj = {
                        ...tarea,
                        titulo: tareaData.titulo,
                        //descripcion: tareaData.descripcion,
                        //imagenes: tareaData.imagenes,
                        fechaInicio: tarea.fechaInicio.toDate().toLocaleDateString(),
                        fechaLimite: tarea.fechaLimite.toDate().toLocaleDateString(),
                        //fechaCompletada: tarea.fechaCompletada ? tarea.fechaCompletada.toDate().toLocaleDateString() : null,
                        //completada: completada,
                        tipoTarea: tareaData.tipoTarea,
                    
                    };

                    tareasList.push(tareaObj);
                }
            }
            setTareas(tareasList);
        };
        fetchPreferences();
    }, [studentId]);


    const getImageForTaskType = (tipoTarea) => {
        switch (tipoTarea) {
            case 'Recogida de material':
                return require('../../images/tijeras.png'); // Ruta a la imagen para "Recogida de material"
            case 'Tarea por pasos':
                return require('../../images/pasosLogo.png'); // Ruta a la imagen para "Tarea por pasos"
            case 'Tarea de fotocopias':
                return require('../../images/plastificar.png'); // Ruta a la imagen para "Tarea de fotocopias"
            case 'Tarea de menú':
                return require('../../images/menú.png'); // Ruta a la imagen para "Tarea de menú"
            default:
                return require('../../images/user1.png'); // Ruta a una imagen por defecto
        }
    };

    const getNavigationRouteForTaskType = (tipoTarea,tareaId) => {
        switch (tipoTarea) {
            case 'Recogida de material':
                return'Recoger Material';
            case 'Tarea por pasos':
                return 'UserStepsTask';
            case 'Tarea de fotocopias':
                return 'ShowFotocopia';
            case 'Tarea de menú':
                return 'UserMenuTask';
            default:
                return 'Home'; // Ruta por defecto
        }
    };
    const renderTareas = () => {
        if (tareas.length <= 0) {
            return (
                <View style={styles.noTareasContainer}>
                    <Image
                        source={require('../../images/sí.png')}
                        style={styles.noTareaImage}
                    />
                    <Text style={styles.noTareasText}>¡¡ Enhorabuena {studentName} !! {"\n"} No hay tareas</Text>;
                </View>
            );
        } else {
            return tareas.map((tarea, index) => {
                const navigationRoute = getNavigationRouteForTaskType(tarea.tipoTarea);
                return (
                    <TouchableOpacity key={index} style={styles.tareaContainer} onPress={() => navigation.navigate(navigationRoute, { studentId, tareaId: tarea.id })}>
                        <Image
                            source={getImageForTaskType(tarea.tipoTarea)}
                            style={styles.tareaImage}
                        />
                        <View style={styles.tareaTexto}>
                            <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                            <Text style={styles.tareaFecha}>Inicio: {tarea.fechaInicio}</Text>
                            <Text style={styles.tareaFecha}>Límite: {tarea.fechaLimite}</Text>
                        </View>
                    </TouchableOpacity>
                );
            });

        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>TAREAS</Text>

            <TouchableOpacity style={styles.buttonExit} onPress={() => navigation.navigate('Home')}>
                <Text style={{ color: '#fff', fontSize: largeScale(20), marginRight: scale(10) }}>SALIR</Text>
                <Icon name="exit" size={largeScale(30)} color="#fff" />
            </TouchableOpacity>
            {renderTareas()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9EFFF',
        padding: largeScale(25),
    },
    title: {
        position: 'absolute',
        top: largeScale(50),
        fontSize: largeScale(28),
        fontWeight: 'bold',
        color: '#424242',
        padding: largeScale(20),
        backgroundColor: '#FFFA9C',
        borderRadius: largeScale(10),
        borderWidth: 2,
        borderColor: '#1565C0',
        width: '50%',
        textAlign: 'center',
    },
    buttonExit: { 
        position: 'absolute',
        top: largeScale(50),
        right: largeScale(20),
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: 'red',
        padding: largeScale(20),
        borderRadius: largeScale(10),
        borderColor: 'black',
        borderWidth: 2,
    },

    tareaContainer: {
        flexDirection: 'row',
        padding: largeScale(12),
        backgroundColor: '#fff',
        borderRadius: largeScale(10),
        borderWidth: 2,
        borderColor: '#aaa',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tareaTexto: {
        padding: largeScale(10),
        backgroundColor: '#fff',
        borderRadius: largeScale(10),
        alignSelf: 'center',
        width: '70%',
    },
    tareaImage: {
        width: largeScale(120),
        aspectRatio: 1,
        marginRight: largeScale(10),
    },
    tareaTitulo: {
        fontSize: largeScale(30),
        fontWeight: 'bold',
        color: '#000',
    },
    tareaFecha: {
        fontSize: largeScale(25),
        color: '#000',
    },

    noTareasContainer: {
        flex: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: largeScale(35),
        borderRadius: largeScale(20),
        borderWidth: 2,
    },
    noTareasText: {
        fontSize: largeScale(30),
        color: '#000',
        textAlign: 'center',
        backgroundColor: '#FFF',
        padding: largeScale(25),
    },
    noTareaImage: {
        padding: largeScale(5),
        width: largeScale(350),
        height: largeScale(350),
    },

});
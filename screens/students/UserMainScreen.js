import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import { format, differenceInDays } from 'date-fns';

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
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setStudentName(userData.nombre); 
                setPreferenciasVista(userData.preferenciasVista);

                // Obtener las tareas del campo agenteTareas
                const tareasMap = userData.agendaTareas || {};
                const tareasList = [];

                //for (const key in tareasMap) {
                const tareasPromises = Object.keys(tareasMap).map(async (key) => {
                    if (tareasMap.hasOwnProperty(key)) {
                        // Obtener los datos de la agendaTareas del alumno
                        const tarea = tareasMap[key];
                        const tareaDocRef = tarea.idTarea; 
                        const fechaInicio = tarea.fechaInicio.toDate();
                        const fechaLimite = tarea.fechaLimite.toDate();
                        const diasRestantes = differenceInDays(fechaLimite, new Date());                        

                        // Obtener los datos de la tarea
                        const tareaDoc = await getDoc(tareaDocRef);
                        if (tareaDoc.exists()) {
                            const tareaData = tareaDoc.data();
                            const tareaObj = {
                                id: tareaDoc.id,
                                ...tarea,
                                titulo: tareaData.titulo,
                                fechaInicio: format(fechaInicio, 'dd/MM/yyyy'), 
                                fechaLimite: `${format(fechaLimite, 'dd/MM/yyyy')}`, 
                                restante: `(${diasRestantes} días restantes)`, 
                                tipoTarea: tareaData.tipoTarea,
                            };
                            tareasList.push(tareaObj);
                        } else {
                        }
                    }
                });

                await Promise.all(tareasPromises);
                setTareas(tareasList);
            } else {
                console.log('No se encontró el documento del estudiante.');
            }
        };
        fetchPreferences();
    }, [studentId]);


    const getImageForTaskType = (tipoTarea) => {
        const preferencia = Array.isArray(preferenciasVista) ? preferenciasVista[0] : preferenciasVista;

        if (preferencia === 'texto') {
            return null; 
        } else if (preferencia === 'pictograma') {
            switch (tipoTarea) {
                case 'Recogida de material':
                    return require('../../images/tijeras.png');
                case 'Tarea por pasos':
                    return require('../../images/pasosLogo.png'); 
                case 'Fotocopias':
                    return require('../../images/plastificar.png'); 
                case 'Tarea de menú':
                    return require('../../images/menú.png'); 
                default:
                    return require('../../images/user1.png'); 
            }
        } else {
            switch (tipoTarea) {
                case 'Recogida de material':
                    return require('../../images/materialReal.jpg');
                case 'Tarea por pasos':
                    return require('../../images/pasosLogo.png'); 
                case 'Fotocopias':
                    return require('../../images/impresoraReal.jpg'); 
                case 'Tarea Menu':
                    return require('../../images/menú.png'); 
                default:
                    return require('../../images/user1.png'); 
            }
        }
    };

    const getNavigationRouteForTaskType = (tipoTarea) => {
        switch (tipoTarea) {
            case 'Recogida de material':
                return'Recoger Material';
            case 'Tarea por pasos':
                return 'UserStepsTask';
            case 'Tarea de fotocopias':
                return 'ShowFotocopia';
            case 'Tarea Menu':
                return 'UserMenuTask';
            default:
                return 'Home'; // Ruta por defecto
        }
    };
    const renderTareas = () => {
        //console.log('tareasLARGO:', tareas.length);
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
                const preferencia = Array.isArray(preferenciasVista) ? preferenciasVista[0] : preferenciasVista;
                console.log('preferencia:', preferencia);
                return (
                    <View style={styles.listaTareas}>
                        <TouchableOpacity key={index} style={styles.tareaContainer} onPress={() => navigation.navigate(navigationRoute, { studentId: studentId, idTarea: tarea.id })}>
                            <Image
                                source={getImageForTaskType(tarea.tipoTarea)}
                                style={styles.tareaImage}
                            />
                            <View style={styles.tareaTexto}>
                                <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                                {(preferencia === 'Normal' || preferencia === 'texto') ? (
                                    <>
                                        <Text style={styles.tareaFecha}>Inicio: {tarea.fechaInicio}</Text>
                                        <Text style={styles.tareaFecha}>Límite: {tarea.fechaLimite + ' ' + tarea.restante}</Text>
                                    </>
                                ) : (
                                    <Text style={styles.tareaFecha}>{tarea.restante}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
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

    listaTareas: {
        paddingBottom: largeScale(50),
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
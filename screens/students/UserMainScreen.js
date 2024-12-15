import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
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

        const resetTareasCompletadas = async () => {
            try {
                console.log('Iniciando reset de tareas completadas');
                const studentsSnapshot = await getDocs(collection(db, 'Estudiantes'));
                
                for (const doc of studentsSnapshot.docs) {
                    const studentData = doc.data();
                    const studentRef = doc.ref;
                    await updateDoc(studentRef, { tareasCompletadas: 5 });
                    console.log(`Actualizando tareasCompletadas para el documento ${doc.id}`);
    

                }
                
            } catch (error) {
                console.error('Error reseteando tareas completadas:', error);
            }
        };
  
        const intervalId = setInterval(resetTareasCompletadas, 100);
  
        return () => clearInterval(intervalId);
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

            if(tareasMap == undefined) console.log('No hay tareas');

            for (const key in tareasMap) {
                if (tareasMap.hasOwnProperty(key)) {
                    // Obtener los datos de la agendaTareas del alumno
                    const tarea = tareasMap[key];
                    const tareaDocRef = tarea.idTarea; 
                    const completada = tarea.completada;
                    const tipoTarea = tarea.tipoTarea;
                    // Obtener los datos de la tarea
                    const tareaDoc = await getDoc(tareaDocRef);
                    const tareaData = tareaDoc.data();
                    const tareaObj = {
                        ...tarea,
                        titulo: tareaData.titulo,
                        descripcion: tareaData.descripcion,
                        imagenes: tareaData.imagenes,
                        fechaInicio: tarea.fechaInicio.toDate().toLocaleDateString(),
                        fechaLimite: tarea.fechaLimite.toDate().toLocaleDateString(),
                        fechaCompletada: tarea.fechaCompletada ? tarea.fechaCompletada.toDate().toLocaleDateString() : null,
                        //completada: completada,
                        tipoTarea: tareaData.tipoTarea,
                    
                    };

                    if (tareaData.tipoTarea === 'Tarea por pasos') {
                        const pasos = tareaData.Pasos || {};
                        tareaObj.Pasos = pasos;
                    }
                    tareasList.push(tareaObj);
                }
            }
            

            setTareas(tareasList);
        };
        fetchPreferences();
    }, [studentId]);


    const renderTareas = () => {
        /*  if (tareas.length === 0) {
            return <Text style={styles.noTareasText}>¡¡ Enhorabuena {studentName} !! {"\n"} No hay tareas</Text>;
        } */
        if (preferenciasVista == "Normal") {
            return tareas.map((tarea, index) => {
                if (tarea.tipoTarea == 'Recogida de material') {
                    return (
                        <View key={index} style={styles.tareaContainer}>
                            <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                            <Text style={styles.tareaDescripcion}>{tarea.descripcion}</Text>
                            <Text style={styles.tareaFecha}>Inicio: {tarea.fechaInicio}</Text>
                            <Text style={styles.tareaFecha}>Límite: {tarea.fechaLimite}</Text>
                            { tarea.completada && <Text style={styles.tareaFecha}>Completada: {tarea.fechaCompletada}</Text>}
                        </View>
                    );
                } else if (tarea.tipoTarea == 'Tarea por pasos') {
                    return (
                        <View key={index} style={styles.tareaContainer}>
                            <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                            {tarea.Pasos && Object.keys(tarea.Pasos).map((pasoKey, pasoIndex) => {
                                const paso = tarea.Pasos[pasoKey];
                                console.log('paso:', paso);
                                return (
                                    <View key={pasoIndex} style={styles.pasoContainer}>
                                        <Text style={styles.pasoTitulo}>Paso {pasoIndex + 1}: {paso.Descripción}</Text>
                                        {paso.imagenPictograma && <Image source={{ uri: paso.imagenPictograma }} style={styles.pasoImagen} />}
                                        {paso.imagenReal && <Image source={{ uri: paso.imagenReal }} style={styles.pasoImagen} />}
                                    </View>
                                );
                            })}
                            <Text style={styles.tareaFecha}>Inicio: {tarea.fechaInicio}</Text>
                            <Text style={styles.tareaFecha}>Límite: {tarea.fechaLimite}</Text>
                            {tarea.fechaCompletada && <Text style={styles.tareaFecha}>Completada: {tarea.fechaCompletada}</Text>}
                        </View>
                    );
                }
            });
        } else if (preferenciasVista == 'Pictograma') {
            return tareas.map((tarea, index) => (
                <View key={index} style={styles.tareaContainer}>
                    <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                    {tarea.imagenes && tarea.imagenes.map((imagen, imgIndex) => (
                        <Image key={imgIndex} source={{ uri: imagen }} style={styles.tareaImagen} />
                    ))}
                    <Text style={styles.tareaFecha}>Inicio: {tarea.fechaInicio}</Text>
                    <Text style={styles.tareaFecha}>Límite: {tarea.fechaLimite}</Text>
                    { tarea.completada && <Text style={styles.tareaFecha}>Completada: {tarea.fechaCompletada}</Text>}
                </View>
            ));
        }
        return <Text style={styles.noTareasText}>¡¡ Enhorabuena {studentName} !! {"\n"} No hay tareas</Text>;;
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>TAREAS</Text>

            <TouchableOpacity style={styles.buttonExit} onPress={() => navigation.navigate('Home')}>
                <Text style={{ color: '#fff', fontSize: largeScale(20), marginRight: scale(10) }}>SALIR</Text>
                <Icon name="exit" size={largeScale(30)} color="#fff" />
            </TouchableOpacity>
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

    tareaTitulo: {
        fontSize: largeScale(30),
        fontWeight: 'bold',
        color: '#424242',
    },
    tareaDescripcion: {
        fontSize: largeScale(20),
        color: '#424242',
    },
    tareaFecha: {
        fontSize: largeScale(25),
        color: '#666',
    },
    tareaContainer: {
        marginBottom: largeScale(20),
        padding: largeScale(10),
        backgroundColor: '#fff',
        borderRadius: largeScale(10),
        borderWidth: 1,
        borderColor: '#ddd',
        width: '90%',
        alignSelf: 'center',
    },
    tareaCompletada: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    tareaImagen: {
        width: largeScale(30),
        height: largeScale(30),
        marginTop: largeScale(5),
    },
    pasoContainer: {
        marginTop: largeScale(10),
    },
    pasoTitulo: {
        fontSize: largeScale(25),
        fontWeight: 'bold',
        color: '#424242',
    },
    pasoDescripcion: {
        fontSize: largeScale(14),
        color: '#666',
    },
    pasoImagen: {
        width: largeScale(30),
        height: largeScale(30),
        marginTop: largeScale(5),
    },
    noTareasText: {
        fontSize: largeScale(18),
        color: '#424242',
        textAlign: 'center',
        marginTop: largeScale(20),
    },

});
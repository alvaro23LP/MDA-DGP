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
    const { studentId } = route.params; 
    const [tareas, setTareas] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [showAllMaterials, setShowAllMaterials] = useState(false);
    const [buttonPosition, setButtonPosition] = useState('right'); // Definir buttonPosition en el estado


    useEffect(() => {
        navigation.setOptions({
            title: 'Recoger Material',
            headerStyle: { backgroundColor: '#1565C0', height: 120 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 40, marginLeft: 30 },
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

    useEffect(() => {
        const fetchPreferences = async () => {
            const userDoc = await getDoc(doc(db, 'Estudiantes', studentId));
            const userData = userDoc.data();
            setStudentName(userData.nombre);

            // Obtener las tareas del campo agendaTareas
            const tareasMap = userData.agendaTareas || {};
            const tareasList = [];

            for (const key in tareasMap) {
                if (tareasMap.hasOwnProperty(key)) {
                    const tarea = tareasMap[key];
                    const tareaDocRef = tarea.idTarea; // Referencia al documento de la tarea
                    const tareaDoc = await getDoc(tareaDocRef);
                    const tareaData = tareaDoc.data();

                    if (tareaData.tipoTarea === 'Recogida de material') {
                        tareasList.push({
                            id: tareaDoc.id,
                            ...tareaData,
                            completada: tarea.completada || false,
                        });
                    }
                }
            }

            setTareas(tareasList);
        };
        fetchPreferences();
    }, [studentId]);

    const toggleMaterialCompletion = async (tareaId, materialKey) => {
        const updatedTareas = tareas.map(tarea => {
            if (tarea.id === tareaId) {
                const updatedMateriales = { ...tarea.materiales };
                updatedMateriales[materialKey].completada = !updatedMateriales[materialKey].completada;
                return { ...tarea, materiales: updatedMateriales };
            }
            return tarea;
        });

        setTareas(updatedTareas);

        // Actualizar en Firestore
        const tareaToUpdate = updatedTareas.find(tarea => tarea.id === tareaId);
        await updateDoc(doc(db, 'Tareas', tareaId), { materiales: tareaToUpdate.materiales });
    };

    const toggleShowAllMaterials = () => {
        setShowAllMaterials(!showAllMaterials);
        setButtonPosition(buttonPosition === 'right' ? 'left' : 'right');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{studentName}</Text>
            <View style={styles.contenedorTarea}>
                {tareas.map(tarea => (
                    <View key={tarea.id} style={styles.contendorMaterialesVista}>
                        {Object.keys(tarea.materiales).slice(showAllMaterials ? 7 : 0, showAllMaterials ? undefined : 7).map((materialKey, index) => (
                            <View key={index} style={styles.unidadMaterial}>
                                <View style={styles.textoMaterial}>
                                    <Text 
                                        style={[styles.tituloMaterial, 
                                        tarea.materiales[materialKey].completada && styles.materialTextCompleted]}>
                                        {materialKey}:
                                    </Text>
                                    <Text style={[
                                        styles.descripcionMaterial,
                                        tarea.materiales[materialKey].completada && styles.materialTextCompleted]}>
                                        {tarea.materiales[materialKey].Descripcion}
                                    </Text>
                                </View>

                                <Switch
                                      style={styles.materialSwitch}
                                      value={tarea.materiales[materialKey].completada || false}
                                      onValueChange={() => toggleMaterialCompletion(tarea.id, materialKey)}
                                      thumbColor={tarea.materiales[materialKey].completada ? "#01f00f" : "#ee0f0f"}
                                      trackColor={{ false: "#af0000", true: "#0fa00f" }}
                                />
                            </View>
                        ))}
                    </View>
                ))}
                {tareas.some(tarea => Object.keys(tarea.materiales).length > 7) && (
                    <TouchableOpacity onPress={toggleShowAllMaterials} style={[styles.showMoreButton, buttonPosition === 'right' ? styles.buttonRight : styles.buttonLeft]}>
                        <Icon name={showAllMaterials ? "chevron-back" : "chevron-forward"} size={largeScale(40)} color="#050500" />
                    </TouchableOpacity>
                )}
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
        padding: largeScale(8),
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

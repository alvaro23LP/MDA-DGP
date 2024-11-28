import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { getFirestore, doc, collection, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function StepsTask({route, navigation }) {
    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
            title: 'Editar Tarea por Pasos',
            headerStyle: { backgroundColor: '#1565C0', height: scale(50) },
            headerTintColor: '#fff', // Color del texto
            headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
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

    const { taskId } = route.params;
    const [stepMap, setStepMap] = useState(new Map());
    const [stepNumber, setStepNumber] = useState(1);
    const [stepDescription, setStepDescription] = useState('');
    const [stepImage, setStepImage] = useState('');
    const [currentStepNumber, setCurrentStepNumber] = useState(1);

    const selectImage = () => {
        console.log('Entra en la funcion seleccionar imagen');
        launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: response.assets[0].uri };
                setStepImage(source.uri);
            }
        });
    };

    useEffect(() => {
        const loadTaskData = async () => {
            try {
                const taskDoc = await getDoc(doc(db, 'Tareas', taskId));
                if (taskDoc.exists()) {
                    const taskData = taskDoc.data();
                        setStepMap(Object.keys(taskData.pasos).length);
                        setCurrentStepNumber(1);
                        setStepDescription(taskData.pasos[currentStepNumber].Instrucciones);
                        setStepImage(taskData.pasos[1].Imagen);
                } 
            } catch (error) {
                console.error('Error al cargar los datos de la tarea: ', error);
            }
        };

    loadTaskData();
        

    }, [taskId]);

    const editStep = async () => {
        if (!stepDescription) { // ***************   || !stepImage
            alert('Por favor, agrega una descripción y una imagen para el paso.');
            return;
        }
    
        try {
            // Actualiza solo el paso actual en la base de datos
            await updateDoc(doc(db, 'Tareas', taskId), {
                [`pasos.${currentStepNumber}.Instrucciones`]: stepDescription,
                [`pasos.${currentStepNumber}.Imagen`]: stepImage
            });
            console.log('Paso actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el paso:', error);
        }

        setCurrentStepNumber((prevCurrentStepNumber) => prevCurrentStepNumber + 1);

        const loadTaskData = async () => {
            try {
                const taskDoc = await getDoc(doc(db, 'Tareas', taskId));
                if (taskDoc.exists()) {
                    const taskData = taskDoc.data();
                        setStepDescription(taskData.pasos[currentStepNumber+1].Instrucciones);
                        setStepImage(taskData.pasos[currentStepNumber].Imagen);
                } 
            } catch (error) {
                console.error('Error al cargar los datos de la tarea: ', error);
            }
        };

        loadTaskData();
    };

    const saveTask = async () => {
        if (!stepDescription) { // ***************   || !stepImage
            alert('Por favor, agrega una descripción y una imagen para el paso.');
            return;
        }
    
        try {
            // Actualiza solo el paso actual en la base de datos
            await updateDoc(doc(db, 'Tareas', taskId), {
                [`pasos.${currentStepNumber}.Instrucciones`]: stepDescription,
                [`pasos.${currentStepNumber}.Imagen`]: stepImage
            });
            navigation.navigate('ShowTasks');
            
        } catch (error) {
            console.error('Error al actualizar el paso:', error);
        }
    };

    const showPreviousStep = () => {
        if (currentStepNumber > 1) {
            const previousStepNumber = currentStepNumber - 1;
            const previousStep = stepMap.get(previousStepNumber);
            if (previousStep) {
                setStepDescription(previousStep.description);
                setStepImage(previousStep.image);
                setCurrentStepNumber(previousStepNumber);
            }
        }
    };

    const showNextStep = () => {
        const nextStepNumber = currentStepNumber + 1;
        const nextStep = stepMap.get(nextStepNumber);
        if (nextStep) {
            setStepDescription(nextStep.description);
            setStepImage(nextStep.image);
            setCurrentStepNumber(nextStepNumber);
        } else {
            setStepDescription('');
            setStepImage('');
            setCurrentStepNumber(nextStepNumber);
        }
    };

    return (
        <View style={{ backgroundColor: '#D9EFFF', flex: 1 }}>
            <View style={styles.informationContainer}>
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={styles.title}>Paso {currentStepNumber}</Text>
                        <Text style={styles.title}>Totales {stepMap}</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={selectImage}>
                        <Text style={styles.textButton}>Agregar Imagen</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, styles.inputDescripcion]}
                        placeholder="Instrucciones"
                        value={stepDescription}
                        onChangeText={setStepDescription}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.arrowButtonContainer}>
                    {/* <TouchableOpacity
                        style={styles.arrowLeft}
                        onPress={showPreviousStep}
                        disabled={currentStepNumber === 1}
                    >
                        <Icon
                            name="arrow-back-circle"
                            size={scale(50)}
                            color={currentStepNumber === 1 ? '#ccc' : '#1565C0'}
                        />
                    </TouchableOpacity> */}
                    {currentStepNumber < stepMap ? (
                        <TouchableOpacity style={styles.button2} onPress={editStep}>
                            <Text style={styles.textButton}>Siguiente paso</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button2} onPress={saveTask}>
                            <Text style={styles.textButton}>Confirmar edición</Text>
                        </TouchableOpacity>
                    )}
                    {/* <TouchableOpacity
                        style={styles.arrowRight}
                        onPress={showNextStep}
                        disabled={currentStepNumber === stepMap.size}
                    >
                        <Icon
                            name="arrow-forward-circle"
                            size={scale(50)}
                            color={currentStepNumber === stepMap.size ? '#ccc' : '#1565C0'}
                        />
                    </TouchableOpacity> */}
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    informationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9EFFF',
        margin: scale(20),
        borderRadius: scale(10),
        borderWidth: 4,
        borderColor: '#1565C0',
        height: height * 0.35,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#D9EFFF',
        borderColor: '#1565C0',
        height: height * 0.17,
        width: '80%',
    },
    input: {
        height: 60,
        borderColor: '#1565C0',
        borderWidth: 2,
        marginVertical: 30,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: scale(14),
    },
    inputDescripcion: {
        width: '100%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 13,
        margin: 10,
        borderStyle: 'solid',
        borderWidth: 3,
        borderRadius: 30,
        backgroundColor: '#FEF28A',
        borderColor: '#424242',
        width: '55%',
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 13,
        margin: 10,
        borderStyle: 'solid',
        borderWidth: 3,
        borderRadius: 30,
        backgroundColor: '#FEF28A',
        borderColor: '#424242',
        width: '40%',
    },
    textButton: {
        fontSize: scale(15),
        fontColor: '#424242',
        fontWeight: 'bold',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        width: '100%',
    },
    arrowButtonContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#D9EFFF',
    },
});

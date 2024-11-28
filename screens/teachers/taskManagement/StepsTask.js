import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function StepsTask({ navigation }) {
    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
            title: 'Crear Tarea de Pasos',
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

    const addStep = () => {
        if (!stepDescription) { // ***************   || !stepImage
            alert('Por favor, agrega una descripción y una imagen para el paso.');
            return;
        }

        setStepMap((prevStepMap) => {
            prevStepMap.set(currentStepNumber, { description: stepDescription, image: stepImage });
            return prevStepMap;
        });

        setStepNumber((prevStepNumber) => prevStepNumber + 1);
        setCurrentStepNumber((prevCurrentStepNumber) => prevCurrentStepNumber + 1);

        setStepDescription('');
        setStepImage('');
    };

    // useEffect(() => {
    //     console.log('Cambia stepNumber:', stepNumber);
    // }, [stepNumber]);

    // useEffect(() => {
    //     console.log('Cambia currentStepNumber:', currentStepNumber);
    // }, [currentStepNumber]);

    const saveTaskInDB = async () => {
        if (stepMap.size === 0) {
            console.log('Introduce al menos un paso para guardar la tarea.');
            return;
        }

        const parsedSteps = {};
        stepMap.forEach((value, key) => {
            parsedSteps[key] = {
                Instrucciones: value.description,
                Imagen: value.image
            };
        });

        const taskData = {
            pasos: parsedSteps,
            tipoTarea: 'Tarea por pasos',
            titulo: 'Tarea por pasos',
        };

        try {
            const docRef = await addDoc(collection(db, 'Tareas'), taskData);
            console.log('Tarea guardada correctamente');
            return docRef;            
        } catch (error) {
            console.error('Error al guardar la tarea:', error);
        }
    };

    const createAndAssignTask = async () => {
        const docRef = await saveTaskInDB();
        navigation.navigate('TaskAssignment', { taskId: docRef.id });
    };

    const createTask = async () => {
        await saveTaskInDB();
        navigation.navigate('ShowTasks');
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
                        <Text style={styles.title}>Totales {stepNumber}</Text>
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
                    <TouchableOpacity
                        style={styles.arrowLeft}
                        onPress={showPreviousStep}
                        disabled={currentStepNumber === 1}
                    >
                        <Icon
                            name="arrow-back-circle"
                            size={scale(50)}
                            color={currentStepNumber === 1 ? '#ccc' : '#1565C0'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={addStep}>
                        <Text style={styles.textButton}>Añadir Paso</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.arrowRight}
                        onPress={showNextStep}
                        disabled={currentStepNumber === stepNumber}
                    >
                        <Icon
                            name="arrow-forward-circle"
                            size={scale(50)}
                            color={currentStepNumber === stepNumber ? '#ccc' : '#1565C0'}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={createAndAssignTask}>
                    <Text style={styles.textButton}>Crear y asignar</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer2}>
                    <TouchableOpacity style={styles.button} onPress={createTask}>
                        <Text style={styles.textButton}>Crear tarea</Text>
                    </TouchableOpacity>
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
        marginTop: 50,
        backgroundColor: '#FEF28A',
        borderColor: '#424242',
        width: '55%',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        backgroundColor: '#D9EFFF',
    },
});

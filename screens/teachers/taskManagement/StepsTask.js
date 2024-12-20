import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import { uploadStepImageToCloudinary } from '../../../services/cloudinary';

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
            title: 'Crear Tarea por Pasos',
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

    const imgPorDefecto = Image.resolveAssetSource(require('../../../images/no-image-icon.png')).uri;
    const [stepMap, setStepMap] = useState(new Map());
    const [stepNumber, setStepNumber] = useState(1);
    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');
    const [stepImage, setStepImage] = useState(imgPorDefecto);
    const [currentStepNumber, setCurrentStepNumber] = useState(1);

    const pickImage = async () => {
        console.log('Opening image picker...');
        // Solicitar permiso para acceder a la galería
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
          alert('Se requiere permiso para acceder a la galería');
          return;
        }
    
        // Abrir la galería para seleccionar una imagen
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'], // Solo imágenes
          allowsEditing: true, // Permitir recortar la imagen
          aspect: [1, 1], // Relación de aspecto opcional
          quality: 1, // Calidad de la imagen (1 = máxima calidad)
        });
    
        if (!result.canceled) {
          // Almacenar la URI de la imagen seleccionada
          setStepImage(result.assets[0].uri);
          console.log(result.assets[0].uri);
        } else {
          console.log('Selección de imagen cancelada');
        }
      };

    const addStep = () => {
        if (!stepDescription) { // ***************   || !stepImage
            alert('Por favor, agrega una descripción y una imagen para el paso.');
            return;
        }
        if (!stepTitle) {
            alert('Por favor, agrega un título para el paso.');
            return;
        }

        setStepMap((prevStepMap) => {
            prevStepMap.set(currentStepNumber, { title: stepTitle, description: stepDescription, image: stepImage });
            return prevStepMap;
        });

        setStepNumber((prevStepNumber) => prevStepNumber + 1);
        setCurrentStepNumber((prevCurrentStepNumber) => prevCurrentStepNumber + 1);

        setStepTitle('');
        setStepDescription('');
        setStepImage(imgPorDefecto);
    };

    const getStepURL = async (imageUri) => {
        try {
            let fotoPasoUrl = null;
            if (imageUri === imgPorDefecto) {
                console.log('No image URI provided');
                return '';
            }
            const uploadResult = await uploadStepImageToCloudinary(imageUri);
            fotoPasoUrl = uploadResult.secure_url;
            return fotoPasoUrl;
        } catch (error) {
            Alert.alert('Error', 'Ha habido un error al subir las imagenes');
            console.error('Error al subir la imagen:', error);
        }
    };

    const saveTaskInDB = async () => {
        if (stepMap.size === 0) {
            console.log('Introduce al menos un paso para guardar la tarea.');
            return;
        }

        const parsedSteps = {};
        // stepMap.forEach(async (value, key) => {
        //     parsedSteps[key] = {
        //         Titulo: value.title,
        //         Instrucciones: value.description,
        //         Imagen: await getStepURL(value.image),
        //     };
        // });

        for (const [key, value] of stepMap) {
            parsedSteps[key] = {
                Titulo: value.title,
                Instrucciones: value.description,
                Imagen: await getStepURL(value.image),
            };
        }

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
        <View style={{ backgroundColor: '#D9EFFF', flex: 1, alignItems: 'center' }}>
            <View style={styles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                    <Text style={styles.title}>Paso {currentStepNumber}</Text>
                    <Text style={styles.title}>Totales {stepNumber}</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.inputDescripcion]}
                    placeholder="Titulo"
                    value={stepTitle}
                    onChangeText={setStepTitle}
                />
                <TextInput
                    style={[styles.input2, styles.inputDescripcion, { height: 150 }]}
                    placeholder="Instrucciones"
                    value={stepDescription}
                    onChangeText={setStepDescription}
                    multiline={true}
                    numberOfLines={4}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button2} onPress={pickImage}>
                        <Text style={styles.textButton}>Agregar Imagen</Text>
                    </TouchableOpacity>
                    {stepImage && (
                        <Image source={{ uri: stepImage }} style={styles.avatarImage} />
                    )}
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

                
                <View style={styles.buttonContainer2}>
                    <TouchableOpacity style={styles.button} onPress={createAndAssignTask}>
                        <Text style={styles.textButton}>Crear y asignar</Text>
                    </TouchableOpacity>
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
        justifyContent: 'flex-start',
        alignItems: 'center', 
        backgroundColor: '#D9EFFF',
        margin: scale(10),
        borderRadius: scale(10),
        borderWidth: 4,
        borderColor: '#1565C0',
        height: height * 0.45, 
        width: '90%', 
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
    },
    input: {
        height: 60,
        borderColor: '#1565C0',
        borderWidth: 2,
        marginVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: scale(14),
    },
    input2: {
        height: 60,
        borderColor: '#1565C0',
        borderWidth: 2,
        marginVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: scale(12),
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
    button2: {
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
        marginRight: 50,
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
    avatarImage: {
        width: 150,
        height: 150,
        marginTop: 16,
        borderRadius: 10,
        borderColor: '#1565C0',
        borderWidth: 3,
    },
});

import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import { uploadStepImageToCloudinary, deleteImageFromCloudinary } from '../../../services/cloudinary';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function StepsTask({ navigation, route }) {
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

    const { taskId } = route.params;
    const imgPorDefecto = Image.resolveAssetSource(require('../../../images/no-image-icon.png')).uri;
    const [stepMap, setStepMap] = useState(new Map());
    const [totalStepNumber, setTotalStepNumber] = useState(1);
    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');
    const [stepImage, setStepImage] = useState(imgPorDefecto);
    const [stepPictogram, setStepPictogram] = useState(imgPorDefecto);
    const [currentStepNumber, setCurrentStepNumber] = useState(1);
    const titleInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    //let oldStepMap = new Map();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Buscando tarea:', taskId);
                const taskDoc = await getDoc(doc(db, 'Tareas', taskId));
                if (taskDoc.exists()) {
                    return taskDoc.data();
                } else {
                    console.log('No se encontró la tarea');
                    return null;
                }
            } catch (error) {
                console.error('Error al obtener los datos de la tarea:', error);
                return null;
            }
        };
        const loadTaskData = async () => {
            const taskData = await fetchData();
            if (taskData) {
                const pasos = taskData.pasos;
                const pasosMap = new Map();
                let totalSteps = 0;
                for (const key in pasos) {
                    if (Object.hasOwnProperty.call(pasos, key)) {
                        const paso = pasos[key];
                        pasosMap.set(Number(key), {
                            title: paso.Titulo,
                            description: paso.Instrucciones,
                            image: paso.Imagen || imgPorDefecto,
                            pictogram: paso.Pictograma || imgPorDefecto,
                        });
                        totalSteps++;
                    }
                }
                setStepMap(pasosMap);
                //oldStepMap = pasosMap;
                setTotalStepNumber(totalSteps+1);
                setCurrentStepNumber(1);
                updateStepFields(1, pasosMap);                
            }
            setIsLoading(false);
        };

        loadTaskData();                 

    }, [taskId]);

    const updateStepFields = (stepNumber, stepsMap) => {
        const step = stepsMap.get(stepNumber);
        if (step) {
            setStepTitle(step.title);
            setStepDescription(step.description);
            setStepImage(step.image);
            setStepPictogram(step.pictogram);
        } else {
            setStepTitle('');
            setStepDescription('');
            setStepImage(imgPorDefecto);
            setStepPictogram(imgPorDefecto);
        }
    };


    const pickImage = async (isPicto) => {
        // console.log('Opening image picker...');
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
            if (isPicto) {
                setStepPictogram(result.assets[0].uri);
            } else {
                setStepImage(result.assets[0].uri);
            }
            // console.log(result.assets[0].uri);
        } else {
            console.log('Selección de imagen cancelada');
        }
    };

    const addStep = () => {
        if (!stepTitle) {
            alert('Por favor, agrega un título para el paso.');
            return;
        }
        if (!stepDescription) {
            alert('Por favor, agrega una descripción para el paso.');
            return;
        }        
        if (stepImage === imgPorDefecto || stepPictogram === imgPorDefecto) {
            alert('Por favor, agrega una imagen y un pictograma para el paso.');
            return;
        }

        setStepMap((prevStepMap) => {
            prevStepMap.set(currentStepNumber, { title: stepTitle, description: stepDescription, image: stepImage, pictogram: stepPictogram });
            return prevStepMap;
        });
        
        if (currentStepNumber === totalStepNumber) {
            setTotalStepNumber((prevTotalStepNumber) => prevTotalStepNumber + 1);
            setStepTitle('');
            setStepDescription('');
            setStepImage(imgPorDefecto);
            setStepPictogram(imgPorDefecto);
        }else{
            const nextStep = stepMap.get(currentStepNumber + 1);
            if (nextStep) {
                setStepTitle(nextStep.title);
                setStepDescription(nextStep.description);
                setStepImage(nextStep.image);
                setStepPictogram(nextStep.pictogram);
            }else{
                setStepTitle('');
                setStepDescription('');
                setStepImage(imgPorDefecto);
                setStepPictogram(imgPorDefecto);
            }
        }
        setCurrentStepNumber((prevCurrentStepNumber) => prevCurrentStepNumber + 1);
        
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
        
    };

    const getStepURL = async (imageUri) => {
        try {
            if (imageUri === imgPorDefecto) {
                console.log('No image URI provided');
                return '';
            }
            // Comprobar si la URI ya es una URL
            if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
                // console.log('La URI ya es una URL:', imageUri);
                return imageUri;
            }
            // console.log('Subiendo imagen a Cloudinary:', imageUri);
            const uploadResult = await uploadStepImageToCloudinary(imageUri);
            return uploadResult.secure_url;
        } catch (error) {
            Alert.alert('Error', 'Ha habido un error al subir las imagenes');
            console.error('Error al subir la imagen:', error);
        }
    };    

    const updateTaskInDB = async () => {
        if (stepMap.size === 0) {
            console.log('Introduce al menos un paso para actualizar la tarea.');
            return;
        }
    
        const parsedSteps = {};
    
        for (const [key, value] of stepMap) {
            parsedSteps[key] = {
                Titulo: value.title,
                Instrucciones: value.description,
                Imagen: await getStepURL(value.image),
                Pictograma: await getStepURL(value.pictogram),
            };
        }

        // eliminar imagenes sustituidas en cloudinary (no funciona)
        // for (const [key, value] of stepMap) {
        //     const oldImage = oldStepMap.get(key)?.image;
        //     const oldPictogram = oldStepMap.get(key)?.pictogram;
    
        //     const newImageURL = await getStepURL(value.image);
        //     const newPictogramURL = await getStepURL(value.pictogram);
    
        //     // Eliminar la imagen anterior si es diferente de la nueva
        //     if (oldImage && oldImage !== newImageURL) {
        //         const publicId = oldImage.split('/').pop().split('.')[0];
        //         await deleteImageFromCloudinary(publicId);
        //     }
    
        //     // Eliminar el pictograma anterior si es diferente del nuevo
        //     if (oldPictogram && oldPictogram !== newPictogramURL) {
        //         const publicId = oldPictogram.split('/').pop().split('.')[0];
        //         await deleteImageFromCloudinary(publicId);
        //     }
    
        //     parsedSteps[key] = {
        //         Titulo: value.title,
        //         Instrucciones: value.description,
        //         Imagen: newImageURL,
        //         Pictograma: newPictogramURL,
        //     };
        // }
    
        const taskData = {
            pasos: parsedSteps,
            tipoTarea: 'Tarea por pasos',
            titulo: 'Tarea por pasos',
        };
    
        try {
            const taskRef = doc(db, 'Tareas', taskId);
            await updateDoc(taskRef, taskData);
            console.log('Tarea actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };




    const updateTask = async () => {
        await updateTaskInDB();
        navigation.navigate('ShowTasks');
    };


    const showPreviousStep = () => {
        if (currentStepNumber > 1) {
            const previousStepNumber = currentStepNumber - 1;
            const previousStep = stepMap.get(previousStepNumber);
            if (previousStep) {
                setStepTitle(previousStep.title);
                setStepDescription(previousStep.description);
                setStepImage(previousStep.image);
                setStepPictogram(previousStep.pictogram);
                setCurrentStepNumber(previousStepNumber);
            }
        }
    };

    const showNextStep = () => {
        const nextStepNumber = currentStepNumber + 1;
        const nextStep = stepMap.get(nextStepNumber);
        if (nextStep) {
            setStepTitle(nextStep.title);
            setStepDescription(nextStep.description);
            setStepImage(nextStep.image);
            setStepPictogram(nextStep.pictogram);
            setCurrentStepNumber(nextStepNumber);
        } else {
            setStepTitle('');
            setStepDescription('');
            setStepImage(imgPorDefecto);
            setStepPictogram(imgPorDefecto);
            setCurrentStepNumber(nextStepNumber);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1565C0" />
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: '#D9EFFF', flex: 1, alignItems: 'center' }}>
            <View style={styles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 0 }}>
                    <Text style={styles.title}>Paso {currentStepNumber}</Text>
                    <Text style={styles.title}>Totales {totalStepNumber}</Text>
                </View>
                <TextInput
                    ref={titleInputRef}
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
                    <TouchableOpacity style={styles.button2} onPress={() => pickImage(false)}>
                        <Text style={styles.textButton}>Agregar Imagen</Text>
                    </TouchableOpacity>
                    {stepImage && (
                        <Image source={{ uri: stepImage }} style={styles.avatarImage} />
                    )}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button2} onPress={() => pickImage(true)}>
                        <Text style={styles.textButton}>Agregar Pictograma</Text>
                    </TouchableOpacity>
                    {stepPictogram && (
                        <Image source={{ uri: stepPictogram }} style={styles.avatarImage} />
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
                        <Text style={styles.textButton}>{currentStepNumber === totalStepNumber ? 'Añadir Paso' : 'Actualizar Paso'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.arrowRight}
                        onPress={showNextStep}
                        disabled={currentStepNumber === totalStepNumber}
                    >
                        <Icon
                            name="arrow-forward-circle"
                            size={scale(50)}
                            color={currentStepNumber === totalStepNumber ? '#ccc' : '#1565C0'}
                        />
                    </TouchableOpacity>
                </View>

                
                <View style={styles.buttonContainer2}>                    
                    <TouchableOpacity style={styles.button} onPress={updateTask}>
                        <Text style={styles.textButton}>Finalizar edición</Text>
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
        height: height * 0.5, 
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
        marginBottom: 5,
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
        marginVertical: 15,
        borderStyle: 'solid',
        borderWidth: 3,
        borderRadius: 30,
        backgroundColor: '#FEF28A',
        borderColor: '#424242',
        width: '40%',
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        margin: 10,
        borderStyle: 'solid',
        borderWidth: 3,
        borderRadius: 30,
        backgroundColor: '#FEF28A',
        borderColor: '#424242',
        width: '55%',
        marginRight: 60,
    },
    textButton: {
        fontSize: scale(15),
        fontColor: '#424242',
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        width: '100%',
        // backgroundColor: 'red',
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
        width: 120,
        height: 120,
        marginTop: 16,
        borderRadius: 10,
        borderColor: '#1565C0',
        borderWidth: 3,
    },
});

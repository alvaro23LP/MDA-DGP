import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../services/firebaseConfig';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Inicializa Firebase
initializeApp(firebaseConfig);

export default function GraphicUser({route, navigation }) {

    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Gráfico de tareas',
          headerStyle: { backgroundColor: '#1565C0', height: 100 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
        });
        
      }, [navigation]);
  
  const { userId } = route.params;
  const [tareasCompletadas, setTareasCompletadas] = useState(0);
  const [mediaTareasCompletadas, setMediaTareasCompletadas] = useState(0)
  const [nombre, setNombre] = useState('')


  const db = getFirestore();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Estudiantes', userId));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTareasCompletadas(userData.tareasCompletadas);
          setNombre(userData.nombre)

        const usersInfo = await getDocs(collection(db, 'Estudiantes'))
        let totalTareasCompletadas = 0;
        let count = 0;

        usersInfo.forEach((doc) => {
            const userData = doc.data();
            totalTareasCompletadas += userData.tareasCompletadas;
            count++;
        });

        const mediaTareasCompletadas = totalTareasCompletadas / count;
        setMediaTareasCompletadas(mediaTareasCompletadas)
        console.log("Media", mediaTareasCompletadas)
        } else {
          Alert.alert('Error', 'No se encontró el usuario');
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario: ', error);
        Alert.alert('Error', 'No se pudo cargar los datos del usuario');
      }
    };

    loadUserData();
  }, [userId]);

  const reiniciarValores = async () => {
    try {
        const usersInfo = await getDocs(collection(db, 'Estudiantes'));

        usersInfo.forEach(async (doc) => {
            const studentRef = doc.ref;
            await updateDoc(studentRef, { tareasCompletadas: 0 });
        });
        console.log('Valores de tareasCompletadas reiniciados a 0 para todos los estudiantes');
        navigation.navigate('UsersManagement');
    } catch (error) {
        console.error('Error al reiniciar los valores:', error);
    }
};

    const data = {
        labels: [nombre, 'Alumnos'],
        datasets: [
            {
                data: [tareasCompletadas, mediaTareasCompletadas]
            }
        ]
    };

    const chartConfig = {
        backgroundColor: '#D9EFFF',
        backgroundGradientFrom: '#D9EFFF',
        backgroundGradientTo: '#D9EFFF',
        color: (opacity = 1) => `rgba(255, 43, 255, 1)`,
        strokeWidth: 10, // optional, default 3
        barPercentage: 2.5,
        useShadowColorFromDataset: false, // optional
        decimalPlaces: 0, // optional, default 2
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color de las etiquetas
        style: {
            borderRadius: 22,
        },
        propsForBackgroundLines: {
            strokeWidth: 2, // Elimina las líneas de fondo
        },
        propsForLabels: {
            fontSize: 16, // Tamaño de fuente más grande para las etiquetas
            fontWeight: 'bold'
        },
        propsForVerticalLabels: {
            fontSize: 28, // Tamaño de fuente más pequeño para las etiquetas verticales
            fontWeight: 'normal',
            color: 'black',
        }
    };

    return (
        <View style={styles.container}>
            <BarChart
                data={data}
                width={screenWidth}
                height={screenHeight/1.4}
                chartConfig={chartConfig}
                fromZero={true} // Start the chart from zero
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={reiniciarValores}>
                    <Text style={styles.userText}>Reiniciar Valores</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    marginTop: 2,
  },
    button: {
        backgroundColor: '#FF3E00', 
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
    },
    userText: {
        color: '#000',
        fontSize: 28,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        marginLeft: 1
      },
  });

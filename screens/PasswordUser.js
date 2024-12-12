import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getApp } from 'firebase/app';


// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

// Función de escalado en función del ancho de pantalla
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

const fruitImages = {
  Uvas: require('../images/uva.png'),
  Pina: require('../images/pina.png'),
  Sandia: require('../images/sandia.png'),
  Fresa: require('../images/fresa.png'),
  Limon: require('../images/limon.png'),
  Manzana: require('../images/manzana.png'),
  Pimiento: require('../images/pimiento.png'),
  Naranja: require('../images/naranja.png'),
  Aguacate: require('../images/aguacate.png'),
};

// Lista de opciones de frutas con sus respectivos IDs
const fruitOptions = [
  { id: '0', name: 'Uvas' },
  { id: '1', name: 'Pina' },
  { id: '2', name: 'Sandia' },
  { id: '3', name: 'Fresa' },
  { id: '4', name: 'Limon' },
  { id: '5', name: 'Manzana' },
  { id: '6', name: 'Pimiento' },
  { id: '7', name: 'Naranja' },
  { id: '8', name: 'Aguacate' },
];

export default function PasswordUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params; // ID del estudiante pasado como parámetro

  const [selectedFruits, setSelectedFruits] = useState([]);
  const [password, setPassword] = useState([]); // Contraseña visual del estudiante
  const [firstSelectedFruit, setFirstSelectedFruit] = useState(null);

  useEffect(() => {
    const fetchPassword = async () => {
      const app = getApp();
      const db = getFirestore(app);
      try {
        const studentRef = doc(db, 'Estudiantes', studentId);
        const studentDoc = await getDoc(studentRef);
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          setPassword(studentData.contrasenaVisual); // Asigna la contraseña visual del estudiante
          console.log('Contraseña visual cargada:', studentData.contrasenaVisual);
        } else {
          console.error('No se encontró el estudiante');
        }
      } catch (error) {
        console.error('Error obteniendo la contraseña visual:', error);
      }
    };

    fetchPassword();

    navigation.setOptions({
      title: 'Selecciona la contraseña',
      headerStyle: { backgroundColor: '#1565C0', height: 100 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
    });
  }, [navigation, studentId]);

  const handleFruitSelection = (fruitId) => {
    if (selectedFruits.length < 2) {
      const newSelection = [...selectedFruits, fruitId];
      setSelectedFruits(newSelection);

      if (newSelection.length === 1) {
        setFirstSelectedFruit(fruitId);
      }

      if (newSelection.length === 2) {
        console.log('Contraseña almacenada:', password);
        console.log('Frutas seleccionadas:', newSelection);

        // Compara la selección del usuario con la contraseña almacenada, respetando el orden
        if (
          newSelection[0] === password[0] &&
          newSelection[1] === password[1]
        ) {
          Alert.alert('¡Contraseña correcta!');
          navigation.navigate('UserScreen', { studentId }); 
        } else {
          Alert.alert('Ups, contraseña incorrecta.');
        }
        setSelectedFruits([]); // Reinicia la selección
        setFirstSelectedFruit(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectPasswordText}>Selecciona la contraseña</Text>
      
      <View style={styles.fruitContainer}>
        <View style={styles.fruitGrid}>
          {fruitOptions.map((fruit) => (
            <TouchableOpacity
              key={fruit.id}
              style={[
                styles.fruitIcon,
                firstSelectedFruit === fruit.id && styles.selectedFruitIcon
              ]}
              onPress={() => handleFruitSelection(fruit.id)}
            >
              <Image 
                source={fruitImages[fruit.name]} 
                style={styles.fruitImage} 
                onError={() => console.log(`Error loading image for: ${fruit.name}`)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  selectPasswordText: {
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  fruitContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    width: '100%',
  },
  fruitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  selectedFruitIcon: {
    backgroundColor: '#88dd99',
    borderColor: 'lightgreen',
  },
  fruitIcon: {
    width: scale(100),
    height: scale(85),
    backgroundColor: '#FFDDC1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 10,
  },
  fruitImage: {
    width: '60%',            // Tamaño reducido para que se vea completa
    height: undefined,       // Altura ajustada automáticamente
    aspectRatio: 1,          // Mantiene proporción cuadrada
    borderRadius: 10,        // Redondeo de esquinas
    resizeMode: 'contain',   // Ajusta la imagen al contenedor sin recortarla
},

});
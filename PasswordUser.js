import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fruitImages = {
  Uvas: require('./images/uvas.png'),
  Pina: require('./images/pina.png'),
  Sandia: require('./images/sandia.png'),
  Fresa: require('./images/fresa.png'),
  Pera: require('./images/pera.png'),
  Manzana: require('./images/manzana.png'),
  Banana: require('./images/banana.png'),
  Papaya: require('./images/papaya.png'),
  Aguacate: require('./images/aguacate.png'),
};

const fruitOptions = [
  { id: 'Uvas', name: 'Uvas' },
  { id: 'Pina', name: 'Pina' },
  { id: 'Sandia', name: 'Sandia' },
  { id: 'Fresa', name: 'Fresa' },
  { id: 'Pera', name: 'Pera' },
  { id: 'Manzana', name: 'Manzana' },
  { id: 'Banana', name: 'Banana' },
  { id: 'Papaya', name: 'Papaya' },
  { id: 'Aguacate', name: 'Aguacate' },
];

export default function PasswordUser() {
  const navigation = useNavigation();
  const [selectedFruits, setSelectedFruits] = useState([]);

  const handleFruitSelection = (fruitId) => {
    if (selectedFruits.length < 2) {
      setSelectedFruits([...selectedFruits, fruitId]);
    }
    if (selectedFruits.length === 1) {
      Alert.alert('Contraseña seleccionada', `Frutas seleccionadas: ${[...selectedFruits, fruitId].join(', ')}`);
      setSelectedFruits([]);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Selecciona la contraseña',
      headerStyle: { backgroundColor: '#1565C0', height: 100 },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 35 },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.selectPasswordText}>Selecciona la contraseña</Text>
      
      <View style={styles.fruitContainer}>
        <View style={styles.fruitGrid}>
          {fruitOptions.map((fruit) => (
            <TouchableOpacity
              key={fruit.id}
              style={styles.fruitIcon}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
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
  fruitIcon: {
    width: '30%', // Cada ícono ocupará el 30% del ancho del contenedor
    aspectRatio: 1, // Mantener la relación de aspecto cuadrada
    backgroundColor: '#FFDDC1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 10,
    padding: 5, // Un poco de espacio dentro del ícono
  },
  fruitImage: {
    width: '60%', // Cambiado a 60% para hacer la imagen más pequeña
    height: '60%', // Cambiado a 60% para hacer la imagen más pequeña
    borderRadius: 10,
  },
});

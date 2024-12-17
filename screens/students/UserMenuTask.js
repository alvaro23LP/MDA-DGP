import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Mapa estático de imágenes
const imageMap = {
  Menu1: require('../../images/Menu.png'),
  Menu2: require('../../images/NoCarne.png'),
  Menu3: require('../../images/Triturado.png'),
  Menu4: require('../../images/FrutaTriturada.png'),
  Menu5: require('../../images/yogur_natillas.png'),
  Menu6: require('../../images/Fruta.png'),
};

// Dimensiones para escalado
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function UserMenuTask({ route, navigation }) {
  const { studentId, idTarea, className, onComplete } = route.params || {};

  const [classData, setClassData] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: className || 'Clase',
      headerStyle: { backgroundColor: '#1565C0', height: scale(60) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
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
  }, [navigation, className]);

  useEffect(() => {
    if (!idTarea || !className) {
      alert('No se ha proporcionado la información necesaria.');
      return;
    }
    fetchClassData();
  }, [idTarea, className]);

  const fetchClassData = async () => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const menus = Object.entries(taskData.Clases[className] || {}).sort((a, b) => a[0].localeCompare(b[0]));
        setClassData({ className, menus });
      } else {
        setClassData(null);
      }
    } catch (error) {
      console.error('Error al obtener datos de la base de datos:', error);
    }
  };

  const handleCounterChange = async (menuKey, change) => {
    const updatedMenus = classData.menus.map(([key, menuData]) => {
      if (key === menuKey) {
        const updatedMenuData = [...menuData];
        updatedMenuData[2] += change;
        return [key, updatedMenuData];
      }
      return [key, menuData];
    });

    setClassData({ ...classData, menus: updatedMenus });

    const taskDocRef = doc(db, 'Tareas', idTarea);

    try {
      const menuToUpdate = updatedMenus.find(([key]) => key === menuKey);
      const updatedMenuData = menuToUpdate[1];

      await updateDoc(taskDocRef, {
        [`Clases.${className}.${menuKey}`]: updatedMenuData,
      });
    } catch (error) {
      console.error('Error actualizando el contador en la base de datos:', error);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(className); // Pasa el nombre de la clase completada
    }
    navigation.goBack();
  };

  const renderMenuItem = ({ item }) => {
    const [menuKey, menuData] = item;

    const imageSource = imageMap[menuKey] || require('../../images/Menu.png');

    return (
      <View style={styles.menuItem}>
        <Image
          source={imageSource}
          style={styles.menuImage}
          resizeMode="contain"
        />
        <Text style={styles.menuDescription}>{menuData[1]}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => handleCounterChange(menuKey, -1)}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{menuData[2]}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => handleCounterChange(menuKey, 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classData ? classData.className : 'Cargando...'}</Text>

      <FlatList
        data={classData ? classData.menus : []}
        keyExtractor={(item) => item[0]}
        renderItem={renderMenuItem}
        style={styles.menuList}
      />

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF',
    padding: scale(15),
  },
  title: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: scale(10),
    textAlign: 'center',
  },
  menuList: {
    flex: 1,
    marginTop: scale(5),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(4),
    marginBottom: scale(4),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    borderWidth: 2,
    borderColor: '#1565C0',
  },
  menuImage: {
    width: scale(50),
    height: scale(50),
  },
  menuDescription: {
    flex: 1,
    marginLeft: scale(10),
    fontSize: scale(14),
    color: '#424242',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#FEF28A',
    padding: scale(5),
    borderRadius: scale(4),
    borderWidth: 2,
    borderColor: '#1565C0',
  },
  counterText: {
    fontSize: scale(16),
    color: '#424242',
  },
  counterValue: {
    fontSize: scale(16),
    marginHorizontal: scale(10),
    color: '#424242',
  },
  buttonExit: { 
    position: 'absolute',
    top: largeScale(20),
    right: largeScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: largeScale(10),
    borderColor: 'black',
    borderWidth: 1,
    width: '30%',
    height: '60%',
  },
  buttonExitText: {
      color: '#fff',
      fontSize: scale(15),
      fontWeight: 'bold',
      fontshadowColor: 'black',
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 3,
  },
  completeButton: {
    marginTop: scale(10), // Ajuste del margen superior
    paddingVertical: scale(7), // Ajuste de altura
    paddingHorizontal: scale(10), // Ajuste horizontal
    backgroundColor: '#FFF59D', // Amarillo claro
    borderRadius: scale(4), // Esquinas más pequeñas
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200), // Ancho similar al del botón Aceptar
    borderWidth: 2, // Borde más grueso, similar al de las clases
    borderColor: '#000', // Borde negro
  },
  completeButtonText: {
    color: '#000', // Texto negro
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});

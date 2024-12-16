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

export default function UserMenuTask({ route, navigation }) {
  const { studentId, idTarea, className, onComplete } = route.params || {};

  const [classData, setClassData] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: className || 'Clase',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
      headerRight: () => (
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonBackText}>Atrás</Text>
        </TouchableOpacity>
      ),
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
        <Text style={styles.completeButtonText}>Completar</Text>
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
    padding: scale(5),
    marginBottom: scale(4),
    backgroundColor: '#fff',
    borderRadius: scale(10),
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
    borderRadius: scale(5),
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
  buttonBack: {
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: '#FF7043',
    borderRadius: scale(5),
  },
  buttonBackText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: scale(20), // Ajuste del margen superior
    paddingVertical: scale(15), // Ajuste de altura
    paddingHorizontal: scale(10), // Ajuste horizontal
    backgroundColor: '#FFF59D', // Amarillo claro
    borderRadius: scale(5), // Esquinas más pequeñas
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(300), // Ancho similar al del botón Aceptar
    borderWidth: 2, // Borde más grueso, similar al de las clases
    borderColor: '#000', // Borde negro
  },
  completeButtonText: {
    color: '#000', // Texto negro
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Mapas de imágenes
const pictogramas = {
  Menu1: require('../../images/Menu.png'),
  Menu2: require('../../images/NoCarne.png'),
  Menu3: require('../../images/Triturado.png'),
  Menu4: require('../../images/FrutaTriturada.png'),
  Menu5: require('../../images/yogur_natillas.png'),
  Menu6: require('../../images/Fruta.png'),
};

const imagenes_reales = {
  Menu1: require('../../images/Menu.png'),
  Menu2: require('../../images/NoCarne.png'),
  Menu3: require('../../images/Triturado.png'),
  Menu4: require('../../images/FrutaTriturada.png'),
  Menu5: require('../../images/yogur_natillas.png'),
  Menu6: require('../../images/Fruta.png'),
};

const dedos = {
  1: require('../../images/pictograma_mano/uno.png'),
  2: require('../../images/pictograma_mano/dos.png'),
  3: require('../../images/pictograma_mano/tres.png'),
  4: require('../../images/pictograma_mano/cuatro.png'),
  5: require('../../images/pictograma_mano/cinco.png'),
  6: require('../../images/pictograma_mano/seis.png'),
  7: require('../../images/pictograma_mano/siete.png'),
};

// Escalado de diseño
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function UserMenuTask({ route, navigation }) {
  const { idTarea, className, onComplete } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [visualPreference, setVisualPreference] = useState('Por defecto');

  useEffect(() => {
    navigation.setOptions({
      title: 'Tarea Menu',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: scale(20) }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={scale(40)} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!idTarea || !className) {
      alert('No se ha proporcionado la información necesaria.');
      return;
    }
    fetchTaskPreferences();
    fetchClassData();
  }, [idTarea, className]);

  const fetchTaskPreferences = async () => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);
      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        setVisualPreference(taskData.preferenciasVista?.[0]);
      } else {
        console.warn('No se encontraron datos de la tarea.');
      }
    } catch (error) {
      console.error('Error al obtener las preferencias de la tarea:', error);
    }
  };

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
      console.error('Error al obtener datos de la clase:', error);
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
      console.error('Error al actualizar el contador:', error);
    }
  };

  const renderMenuItem = ({ item }) => {
    const [menuKey, menuData] = item;
    const contador = menuData[2];
    let imageSource = null;
    let contadorImage = null;

    // Configuración según la preferencia visual
    if (visualPreference === 'Pictograma' || visualPreference === 'Imagenes reales') {
      imageSource = visualPreference === 'Pictograma' ? pictogramas[menuKey] : imagenes_reales[menuKey];
      contadorImage = dedos[contador];
    } else if (visualPreference === 'Por defecto') {
      imageSource = pictogramas[menuKey];
    }

    return (
      <View style={styles.menuItem}>
        {visualPreference !== 'Solo texto' && imageSource && (
          <Image source={imageSource} style={styles.menuImage} resizeMode="contain" />
        )}
        <Text style={styles.menuDescription}>{menuData[1]}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterButton} onPress={() => handleCounterChange(menuKey, -1)}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{menuData[2]}</Text>
          {contadorImage && (
            <Image source={contadorImage} style={styles.counterImage} resizeMode="contain" />
          )}
          <TouchableOpacity style={styles.counterButton} onPress={() => handleCounterChange(menuKey, 1)}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(className);
    }
    navigation.goBack();
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

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
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
    fontSize: scale(20),
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
  counterImage: {
    width: scale(30),
    height: scale(30),
    marginLeft: scale(10),
  },
  completeButton: {
    marginTop: scale(10),
    paddingVertical: scale(7),
    paddingHorizontal: scale(10),
    backgroundColor: '#FFF59D',
    borderRadius: scale(4),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200),
    borderWidth: 2,
    borderColor: '#000',
  },
  completeButtonText: {
    color: '#000',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});

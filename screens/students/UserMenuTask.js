import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const { idTarea } = route.params || {};

  const [classData, setClassData] = useState(null);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [classNames, setClassNames] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: '      Menu',
      headerStyle: { backgroundColor: '#1565C0', height: scale(70) },
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
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!idTarea) {
      alert('No se ha proporcionado el ID de la tarea.');
      return;
    }
    fetchClassesAndMenus(0);
  }, [idTarea]);

  const fetchClassesAndMenus = async (classIndex) => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const classKeys = Object.keys(taskData.Clases).sort();
        setClassNames(classKeys);

        if (classKeys.length > 0) {
          const sortedMenuData = Object.entries(taskData.Clases[classKeys[classIndex]])
            .sort((a, b) => a[0].localeCompare(b[0]));

          setClassData({ className: classKeys[classIndex], menus: sortedMenuData });
        } else {
          setClassData(null);
        }
      } else {
        setClassData(null);
      }
    } catch (error) {
      console.error('Error al obtener datos de la base de datos:', error);
    }
  };

  const handlePreviousClass = () => {
    if (currentClassIndex > 0) {
      const newIndex = currentClassIndex - 1;
      setCurrentClassIndex(newIndex);
      fetchClassesAndMenus(newIndex);
    }
  };

  const handleNextClass = () => {
    if (currentClassIndex < classNames.length - 1) {
      const newIndex = currentClassIndex + 1;
      setCurrentClassIndex(newIndex);
      fetchClassesAndMenus(newIndex);
    }
  };

  const handleCounterChange = async (menuKey, change) => {
    const updatedMenus = classData.menus.map(([key, menuData]) => {
      if (key === menuKey) {
        const updatedMenuData = [...menuData];
        updatedMenuData[2] = updatedMenuData[2] + change;
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
        [`Clases.${classNames[currentClassIndex]}.${menuKey}`]: updatedMenuData,
      });
    } catch (error) {
      console.error('Error actualizando el contador en la base de datos:', error);
    }
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
      <Text style={styles.title}>{classData ? classData.className : 'Clase no encontrada'}</Text>

      <View style={styles.mainContent}>
        <TouchableOpacity
          style={styles.arrowLeft}
          onPress={handlePreviousClass}
          disabled={currentClassIndex === 0}
        >
          <Icon
            name="arrow-back-circle"
            size={largeScale(70)}
            color={currentClassIndex === 0 ? '#ccc' : '#1565C0'}
          />
        </TouchableOpacity>

        <FlatList
          data={classData ? classData.menus : []}
          keyExtractor={(item) => item[0]}
          renderItem={renderMenuItem}
          style={styles.menuList}
        />

        <TouchableOpacity
          style={styles.arrowRight}
          onPress={handleNextClass}
          disabled={currentClassIndex === classNames.length - 1}
        >
          <Icon
            name="arrow-forward-circle"
            size={largeScale(70)}
            color={currentClassIndex === classNames.length - 1 ? '#ccc' : '#1565C0'}
          />
        </TouchableOpacity>
      </View>
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
    fontSize: largeScale(30),
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: scale(10),
    textAlign: 'center',
  },
  buttonExit: {
    marginRight: scale(10),
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: 'red',
    borderRadius: scale(5),
  },
  buttonExitText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuList: {
    flex: 1,
    marginHorizontal: scale(10),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
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
  arrowLeft: {
    marginRight: scale(10),
  },
  arrowRight: {
    marginLeft: scale(10),
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Dimensiones para escalado
const { width, height } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function UserMenuTask({ route, navigation }) {
  const { idTarea } = route.params || {};

  const [classData, setClassData] = useState(null);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [classNames, setClassNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: 'Menu',
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
    fetchClassesAndMenus(0); // Inicializa en la primera clase
  }, [idTarea]);

  const fetchClassesAndMenus = async (classIndex) => {
    setIsLoading(true);
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const classKeys = Object.keys(taskData.Clases).sort(); // Ordena alfabéticamente las clases
        setClassNames(classKeys);

        // Ordena los menús por su posición y asigna los datos de la clase
        const sortedMenuData = Object.entries(taskData.Clases[classKeys[classIndex]])
          .sort((a, b) => a[1][3] - b[1][3]); // Ordena por el cuarto elemento (posición)
        setClassData({ className: classKeys[classIndex], menus: sortedMenuData });
      } else {
        console.error('No se encontró la tarea en la base de datos.');
      }
    } catch (error) {
      console.error('Error al obtener datos de la base de datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousClass = () => {
    if (currentClassIndex > 0) {
      const newIndex = currentClassIndex - 1;
      setCurrentClassIndex(newIndex);
      fetchClassesAndMenus(newIndex); // Carga la clase anterior
    }
  };

  const handleNextClass = () => {
    if (currentClassIndex < classNames.length - 1) {
      const newIndex = currentClassIndex + 1;
      setCurrentClassIndex(newIndex);
      fetchClassesAndMenus(newIndex); // Carga la siguiente clase
    }
  };

  const updateMenuCounter = async (menuKey, increment) => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        if (taskData.Clases[classNames[currentClassIndex]][menuKey]) {
          const updatedCount = taskData.Clases[classNames[currentClassIndex]][menuKey][2] + increment;

          if (updatedCount < 0) return;

          taskData.Clases[classNames[currentClassIndex]][menuKey][2] = updatedCount;

          await updateDoc(taskDocRef, {
            [`Clases.${classNames[currentClassIndex]}`]: taskData.Clases[classNames[currentClassIndex]],
          });

          setClassData((prevData) => ({
            ...prevData,
            menus: prevData.menus.map((menuItem) =>
              menuItem[0] === menuKey ? [menuItem[0], [...menuItem[1].slice(0, 2), updatedCount, menuItem[1][3]]] : menuItem
            ),
          }));
        }
      }
    } catch (error) {
      console.error('Error al actualizar el contador en la base de datos:', error);
    }
  };

  const renderMenuItem = ({ item }) => {
    const [menuKey, menuData] = item;

    return (
      <View style={styles.menuItem}>
        <Image
          source={
            menuData[0] === '../images/Menu.png'
              ? require('../../images/Menu.png')
              : { uri: menuData[0] }
          }
          style={styles.menuImage}
        />
        <Text style={styles.menuDescription}>{menuData[1]}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={() => updateMenuCounter(menuKey, -1)} style={styles.counterButton}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{menuData[2]}</Text>
          <TouchableOpacity onPress={() => updateMenuCounter(menuKey, 1)} style={styles.counterButton}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {classData.className}</Text>

      <FlatList
        data={classData.menus}
        keyExtractor={(item) => item[0]}
        renderItem={renderMenuItem}
        style={styles.menuList}
      />

      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePreviousClass} disabled={currentClassIndex === 0}>
          <Icon name="arrow-back-circle" size={50} color={currentClassIndex === 0 ? '#ccc' : '#1565C0'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextClass}
          disabled={currentClassIndex === classNames.length - 1}
        >
          <Icon
            name="arrow-forward-circle"
            size={50}
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
    padding: scale(20),
  },
  title: {
    fontSize: largeScale(35),
    fontWeight: 'bold',
    color: '#424242',
    marginTop: largeScale(30),
    textAlign: 'center',
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
    fontSize: scale(10),
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(15),
    marginBottom: scale(10),
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
    fontSize: scale(16),
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
    fontSize: scale(18),
    color: '#424242',
  },
  counterValue: {
    fontSize: scale(18),
    marginHorizontal: scale(10),
    color: '#424242',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scale(18),
    color: '#424242',
  },
});

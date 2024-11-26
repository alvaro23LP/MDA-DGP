import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Dimensiones para escalado
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function UserMenuTask({ route, navigation }) {
  // Desestructuración segura de los parámetros
  const { idTarea } = route.params || {}; // Si no hay params, usamos un objeto vacío

  // Estado y variables
  const [classData, setClassData] = useState(null);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [classNames, setClassNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar que el idTarea esté disponible
  useEffect(() => {
    if (!idTarea) {
      alert('No se ha proporcionado el ID de la tarea.');
      return;
    }
    fetchClassesAndMenus();
  }, [idTarea]);

  const fetchClassesAndMenus = async () => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);  // Usa el idTarea pasado desde HomeScreen
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const classKeys = Object.keys(taskData.Clases);
        setClassNames(classKeys);  // Lista de nombres de las clases
        setClassData(taskData.Clases[classKeys[0]]);  // Configura la primera clase
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
      setCurrentClassIndex((prevIndex) => prevIndex - 1);
      setClassData(classNames[currentClassIndex - 1]);
    }
  };

  const handleNextClass = () => {
    if (currentClassIndex < classNames.length - 1) {
      setCurrentClassIndex((prevIndex) => prevIndex + 1);
      setClassData(classNames[currentClassIndex + 1]);
    }
  };

  const updateMenuCounter = async (menuKey, increment) => {
    try {
      const taskDocRef = doc(db, 'Tareas', idTarea);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const updatedCount = taskData.Clases[classNames[currentClassIndex]][menuKey][2] + increment;

        if (updatedCount < 0) return;

        taskData.Clases[classNames[currentClassIndex]][menuKey][2] = updatedCount;

        await updateDoc(taskDocRef, {
          [`Clases.${classNames[currentClassIndex]}`]: taskData.Clases[classNames[currentClassIndex]],
        });

        setClassData({
          ...classData,
          [menuKey]: [
            ...classData[menuKey].slice(0, 2),
            updatedCount,
          ],
        });
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
      <Text style={styles.classTitle}>{classNames[currentClassIndex]}</Text>

      <FlatList
        data={Object.entries(classData || {})}
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
  classTitle: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginVertical: scale(20),
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
    resizeMode: 'contain',
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
    fontWeight: 'bold',
    color: '#1565C0',
  },
  counterValue: {
    marginHorizontal: scale(10),
    fontSize: scale(16),
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
    backgroundColor: '#D9EFFF',
  },
  loadingText: {
    fontSize: scale(18),
    color: '#1565C0',
  },
});

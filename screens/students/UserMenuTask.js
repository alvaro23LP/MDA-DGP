import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../services/firebaseConfig';

// Inicializa Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Dimensiones para escalado
const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));

// Mapas de imágenes
const pictogramas = {
  Menu1: require('../../images/Menu.png'),
  Menu2: require('../../images/NoCarne.png'),
  Menu3: require('../../images/Triturado.png'),
  Menu4: require('../../images/FrutaTriturada.png'),
  Menu5: require('../../images/yogur_natillas.png'),
  Menu6: require('../../images/Fruta.png'),
};

const imagenesReales = {
  Menu1_R: require('../../images/menu_imagenes_reales/Menu.png'),
  Menu2_R: require('../../images/menu_imagenes_reales/NoCarne.png'),
  Menu3_R: require('../../images/menu_imagenes_reales/Triturado.png'),
  Menu4_R: require('../../images/menu_imagenes_reales/FrutaTriturada.png'),
  Menu5_R: require('../../images/menu_imagenes_reales/yogur_natillas.png'),
  Menu6_R: require('../../images/menu_imagenes_reales/Fruta.png'),
};

const dedos = {
  dedo1: require('../../images/dedos/dedo1.png'),
  dedo2: require('../../images/dedos/dedo2.png'),
  dedo3: require('../../images/dedos/dedo3.png'),
  dedo4: require('../../images/dedos/dedo4.png'),
  dedo5: require('../../images/dedos/dedo5.png'),
  dedo6: require('../../images/dedos/dedo6.png'),
};

export default function UserMenuTask({ route, navigation }) {
  const { idTarea, className, studentId, onComplete } = route.params || {};
  const [classData, setClassData] = useState(null);
  const [prefTexto, setPrefTexto] = useState(false);
  const [prefPictograma, setPrefPictograma] = useState(false);
  const [prefImagenesReales, setPrefImagenesReales] = useState(false);

  useEffect(() => {
      navigation.setOptions({
          title: 'Tarea Menu',
          headerStyle: { backgroundColor: '#1565C0', height: scale(70) }, // Color de fondo y tamaño del encabezado
          headerTintColor: '#fff', // Color del texto
          headerTitleStyle: { fontWeight: 'bold', fontSize: scale(20) }, // Estilo del título
          headerTitleAlign: 'center', // Centrar el título
          headerLeft: () => (
              <TouchableOpacity style={{ marginLeft: scale(20) }} onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={scale(40)} color="#fff" />
              </TouchableOpacity>
          ),
      });
    }, [navigation]);

  useEffect(() => {
    if (!idTarea || !className || !studentId) {
      alert('No se ha proporcionado la información necesaria.');
      return;
    }
    fetchTaskPreferences();
    fetchClassData();
  }, [idTarea, className, studentId]);

  const fetchTaskPreferences = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'Estudiantes', studentId));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const preference = studentData.preferenciasVista;

        if (preference === 'Texto') {
          setPrefTexto(true);
        } else if (preference === 'Pictograma') {
          setPrefPictograma(true);
        } else if (preference === 'Imagenes reales') {
          setPrefImagenesReales(true);
        } else {
          setPrefPictograma(true); // Por defecto
        }
      } else {
        console.warn('No se encontraron datos del estudiante.');
      }
    } catch (error) {
      console.error('Error al obtener las preferencias del estudiante:', error);
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
    const contador = menuData[2]; // Valor actual del contador (0-6)
    const dedoImage = contador > 0 ? dedos[`dedo${contador}`] : null; // Imagen según el contador
  
    let imageSource = null;
    if (prefPictograma) {
      imageSource = pictogramas[menuKey];
    } else if (prefImagenesReales) {
      imageSource = imagenesReales[`${menuKey}_R`];
    }
  
    return (
      <View style={styles.menuItem}>
        {!prefTexto && imageSource && (
          <Image source={imageSource} style={styles.menuImage} resizeMode="contain" />
        )}
        <Text style={styles.menuDescription}>{menuData[1]}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => {
              if (contador > 0) {
                handleCounterChange(menuKey, -1); // Reduce el contador
              }
            }}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          {prefPictograma || prefImagenesReales ? (
            <Image
              source={dedoImage || require('../../images/dedos/dedo1.png')} // Imagen para 0
              style={styles.dedoImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.counterValue}>{contador}</Text> // Fallback a números si es Texto
          )}
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => {
              if (contador < 6) {
                handleCounterChange(menuKey, 1); // Aumenta el contador
              }
            }}
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
        onPress={() => {
          if (onComplete) {
            onComplete(className);
          }
          navigation.goBack();
        }}
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
    fontSize: scale(18),
    color: '#000',
    fontWeight: 'bold',
  },

  dedoImage: {
    width: scale(50),
    height: scale(50),
  },
});
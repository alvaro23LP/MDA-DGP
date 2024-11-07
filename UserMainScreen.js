import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Obtener el ancho de la pantalla
const { width, height } = Dimensions.get('window');

// Función de escalado en función del ancho de pantalla
const scale = (size) => (width < 375 ? size : size * (width / 375));

// Función de escalado adicional para pantallas grandes
const largeScale = (size) => (width > 800 ? size * 1.5 : size);

export default function UserScreen({ navigation }) {

    useEffect(() => {
        // Configura las opciones del encabezado
        navigation.setOptions({
          title: 'Perfil de Usuario',
          headerStyle: { backgroundColor: '#1565C0', height: largeScale(60) },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: largeScale(24) },

          headerRight: () => (
            <TouchableOpacity
                style={styles.buttonExit}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={{ color: '#fff', fontSize: largeScale(14), marginRight: scale(10) }}>Cerrar Sesión</Text>
                <Icon name="exit" size={largeScale(24)} color="#fff" /> 
            </TouchableOpacity>
          ),  
        });
      }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a tu perfil</Text>
            <Text style={styles.subtitle}>Desarrollo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D9EFFF',
      padding: largeScale(30),
      margin: largeScale(40),
      borderRadius: largeScale(15),
      borderWidth: 4,
      borderColor: '#1565C0'
    },

    title: {
      fontSize: largeScale(28),
      fontWeight: 'bold',
      color: '#424242',
      marginBottom: largeScale(15),
    },

    subtitle: {
      fontSize: largeScale(18),
      color: '#424242',
    },

    buttonExit: { 
        marginRight: largeScale(20), 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: 'red',
        padding: largeScale(8),
        borderRadius: largeScale(5),
        borderColor: 'black',
        borderWidth: 2,
    }
});


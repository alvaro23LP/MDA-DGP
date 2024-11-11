import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image, Dimensions } from 'react-native';
import logo from '../images/Logo-sinFondo.png';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create by</Text>
        <Image style={styles.logoImage} source={logo} />
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9EFFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    marginBottom: 60,
  },

  logoImage: {
    width: width * 0.55,
    height: undefined,
    aspectRatio: 1,
    margin: 30, // Espacio entre la imagen y el texto
  },
  loader: {
    marginTop: 20, // Espacio entre el texto y el loader
  },
});

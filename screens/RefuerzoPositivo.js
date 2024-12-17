import React from 'react';
import { StyleSheet, Image, View, Text, Dimensions } from 'react-native';

const image = require('../images/muyBien.png');
// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

const scale = (size) => (width < 375 ? size : size * (width / 375));

export default function RefuerzoPositivo() {
  return (
    <View style={styles.container}>
        <View style={styles.contentImage}>  
            <Image source={image} />
        </View>


        <View style={styles.content}>
            <Text style={styles.title}>Muy Bien!!!</Text>
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
    backgroundColor: '#9df4a5',
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#1565C0',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(50),
    fontWeight: 'bold',
    margin: 60,
  },

  contentImage:{
    alignItems: 'center',
    margin: scale(20)

  }
});
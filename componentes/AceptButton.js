import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const okImage = require('../images/fotocopias/hecho.png');

const { width } = Dimensions.get('window');
const scale = (size) => (width < 375 ? size : size * (width / 375));




//Se le pasan los buleando de las preferencias de vista del usuraio
const AceptButton = ({ prefPictograma, prefTexto, navigate }) => {

    const handleButtonPress = (navigate) => {
        navigate.navigate('RefuerzoPositivo');
        setTimeout(() => {
            navigate.pop(2);
        }, 3000); // Espera 3 segundos antes de regresar a la página anterior
    };


    return (
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(navigate)}>
            {prefPictograma && (
                <Image source={okImage} style={{ width: scale(100), height: scale(100), marginVertical: scale(5) }} />
            )}
            {prefTexto && (
                <Text style={styles.textButton}>Hecho</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: '#9df4a5',
        borderWidth: 3,
        borderColor: '#424242',
        borderRadius: 10, 
        alignItems: 'center'
        
    },

    textButton: {
        marginHorizontal: scale(20),
        fontSize: scale(20), 
        color: '#424242', 
        fontWeight: 'bold'
        
    }
});

export default AceptButton;
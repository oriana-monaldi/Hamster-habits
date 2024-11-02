import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import HabitsList from '../screens/HabitsList';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.smallButton} 
                    onPress={() => navigation.navigate('AddHabit')}
                >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.smallButton} 
                    onPress={() => FIREBASE_AUTH.signOut()}
                >
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </View>
            <HabitsList />
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5e8c7',  
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 16, 
    },
    smallButton: {
        backgroundColor: '#b79452', 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 14, 
    },
});

import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any,any>;
}

const List = ({ navigation }: RouterProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button 
                    onPress={() => navigation.navigate('AddHabit')} 
                    title='Add New Habit' 
                />
                <View style={styles.spacer} />
                <Button 
                    onPress={() => FIREBASE_AUTH.signOut()} 
                    title='Logout' 
                />
            </View>
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    spacer: {
        height: 20,
    }
});
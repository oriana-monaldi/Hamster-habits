import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const EditHabit = ({ route, navigation }) => {
    const { habitId } = route.params;
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('medium');
    
    useEffect(() => {
        const fetchHabit = async () => {
            try {
                const habitDoc = await getDoc(doc(FIRESTORE_DB, 'habits', habitId));
                if (habitDoc.exists()) {
                    const habitData = habitDoc.data();
                    setTitle(habitData.title);
                    setDescription(habitData.description);
                    setLevel(habitData.level);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching habit:', error);
                Alert.alert('Error', 'Failed to fetch habit details');
                navigation.goBack();
            }
        };

        fetchHabit();
    }, [habitId]);

    const handleUpdateHabit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const habitRef = doc(FIRESTORE_DB, 'habits', habitId);
            await updateDoc(habitRef, {
                title: title.trim(),
                description: description.trim(),
                level
            });
            Alert.alert('Success', 'Habit updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating habit:', error);
            Alert.alert('Error', 'Failed to update habit');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Habit title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Habit description"
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Priority Level</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={level}
                    onValueChange={(itemValue) => setLevel(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="High" value="high" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Low" value="low" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdateHabit}>
                <Text style={styles.buttonText}>Update Habit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    button: {
        backgroundColor: '#0096FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EditHabit;
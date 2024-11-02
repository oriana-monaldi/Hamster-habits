import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
    route: {
        params: {
            habit: {
            id: string;
            title: string;
            description: string;
            level: string;
            }
        }
    }
}

const Detail = ({ navigation, route }: RouterProps) => {
const { habit } = route.params;
const [editedHabit, setEditedHabit] = useState({
title: habit.title,
description: habit.description,
level: habit.level,
});
const [loading, setLoading] = useState(false);

const updateHabit = async () => {
if (!editedHabit.title.trim() || !editedHabit.description.trim()) {
    Alert.alert('Error', 'Please complete all fields');
    return;
}

setLoading(true);
try {
    const habitRef = doc(FIRESTORE_DB, 'habits', habit.id);
    await updateDoc(habitRef, {
    title: editedHabit.title,
    description: editedHabit.description,
    level: editedHabit.level,
    });

    Alert.alert('Success', 'Habit updated successfully');
    navigation.goBack();
} catch (error) {
    console.error('Error updating habit:', error);
    Alert.alert('Error', 'Failed to update habit');
} finally {
    setLoading(false);
}
};

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <Text style={styles.title}>Edit Habit</Text>

    <Text style={styles.subtitle}>Title</Text>
    <TextInput
        value={editedHabit.title}
        onChangeText={(text) => setEditedHabit({ ...editedHabit, title: text })}
        style={styles.input}
        placeholder="Enter Habit Title"
    />

    <Text style={styles.subtitle}>Description</Text>
    <TextInput
        value={editedHabit.description}
        onChangeText={(text) => setEditedHabit({ ...editedHabit, description: text })}
        style={styles.input}
        placeholder="Enter Habit Description"
        multiline
    />

    <Text style={styles.subtitle}>Level</Text>
    <Picker
        selectedValue={editedHabit.level}
        onValueChange={(itemValue) => setEditedHabit({ ...editedHabit, level: itemValue })}
        style={styles.picker}
    >
        <Picker.Item label="High" value="High" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Low" value="Low" />
    </Picker>

    <TouchableOpacity 
        style={styles.button}
        onPress={updateHabit}
        disabled={loading}
    >
        <Text style={styles.buttonText}>
        {loading ? 'Updating...' : 'Update Habit'}
        </Text>
    </TouchableOpacity>
    </ScrollView>
</View>
);
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
    paddingBottom: 100,
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    },
    subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
    },
    input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    },
    picker: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    },
    button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    },
    buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    },
});

export default Detail;
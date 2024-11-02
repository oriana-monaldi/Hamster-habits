import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const EditHabit = ({ route, navigation }) => {
    const { habitId } = route.params;
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('Medium');
    const [modalVisible, setModalVisible] = useState(false);

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
                level,
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
                <ActivityIndicator size="large" color="#b97a3b" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Habit title"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Habit description"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Priority Level</Text>
                {Platform.OS === 'ios' ? (
                    <Picker
                        selectedValue={level}
                        onValueChange={(itemValue) => setLevel(itemValue)}
                        style={styles.pickerIOS}
                    >
                        <Picker.Item label="High Priority" value="High" />
                        <Picker.Item label="Medium Priority" value="Medium" />
                        <Picker.Item label="Low Priority" value="Low" />
                    </Picker>
                ) : (
                    <TouchableOpacity 
                        style={styles.pickerButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.pickerButtonText}>
                            {level} Priority
                        </Text>
                    </TouchableOpacity>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Priority Level</Text>
                                {['High', 'Medium', 'Low'].map((priorityLevel) => (
                                    <TouchableOpacity 
                                        key={priorityLevel}
                                        style={styles.modalButton}
                                        onPress={() => {
                                            setLevel(priorityLevel);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>{priorityLevel} Priority</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity 
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <TouchableOpacity style={styles.button} onPress={handleUpdateHabit}>
                    <Text style={styles.buttonText}>Update Habit</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
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
        color: '#5b3c2b',
    },
    input: {
        backgroundColor: '#f1d9b5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: '#a6855d',
        borderWidth: 1,
        fontSize: 16,
        color: '#3e2a15',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerButton: {
        backgroundColor: '#f1d9b5',
        borderRadius: 8,
        borderColor: '#a6855d',
        borderWidth: 1,
        padding: 10,
        alignItems: 'flex-start',
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#3e2a15',
        textAlign: 'left',
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#f1d9b5',
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'flex-start',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#3e2a15',
        textAlign: 'left',
        width: '100%',
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#b79452',
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#b79452',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerIOS: {
        height: '28%',
        width: '100%',
        backgroundColor: '#f1d9b5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: '#a6855d',
        borderWidth: 1,
        fontSize: 16,
    },
});

export default EditHabit;

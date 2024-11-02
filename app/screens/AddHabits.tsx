import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Alert, 
    TextInput, 
    ScrollView,
    ActivityIndicator,
    Modal,
    Platform 
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface HabitData {
    title: string;
    description: string;
    level: 'High' | 'Medium' | 'Low';
    createdAt: Date;
}

const AddHabit = ({ navigation }: RouterProps) => {
    const [newHabit, setNewHabit] = useState<HabitData>({
        title: '',
        description: '',
        level: 'High',
        createdAt: new Date(),
    });
    
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const validateInputs = (): boolean => {
        if (!newHabit.title.trim()) {
            Alert.alert('Error', 'Please enter a habit title');
            return false;
        }
        if (!newHabit.description.trim()) {
            Alert.alert('Error', 'Please enter a habit description');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setNewHabit({
            title: '',
            description: '',
            level: 'High',
            createdAt: new Date(),
        });
    };

    const saveHabit = async () => {
        if (!validateInputs()) return;

        try {
            setLoading(true);
            const user = FIREBASE_AUTH.currentUser;
            
            if (!user) {
                Alert.alert('Error', 'Please login to add habits');
                navigation.navigate('Login');
                return;
            }

            const habitData = {
                ...newHabit,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                completed: false,
                streak: 0,
                lastUpdated: new Date().toISOString(),
            };

            const habitsRef = collection(FIRESTORE_DB, 'habits');
            await addDoc(habitsRef, habitData);

            Alert.alert(
                'Success', 
                'Habit added successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            navigation.navigate('Habits');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving habit:', error);
            Alert.alert('Error', 'Failed to save habit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        value={newHabit.title}
                        onChangeText={(text) => setNewHabit({ ...newHabit, title: text })}
                        placeholder="Enter habit title"
                        style={styles.input}
                        placeholderTextColor="#999"
                        maxLength={50}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        value={newHabit.description}
                        onChangeText={(text) => setNewHabit({ ...newHabit, description: text })}
                        placeholder="Enter habit description"
                        style={[styles.input, styles.textArea]}
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        maxLength={200}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Priority Level</Text>
                    {Platform.OS === 'ios' ? (
                        <Picker
                            selectedValue={newHabit.level}
                            onValueChange={(itemValue) => 
                                setNewHabit({ ...newHabit, level: itemValue as 'High' | 'Medium' | 'Low' })
                            }
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
                                {newHabit.level} Priority
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Priority Level</Text>
                            {['High', 'Medium', 'Low'].map((level) => (
                                <TouchableOpacity 
                                    key={level}
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setNewHabit({ ...newHabit, level: level as 'High' | 'Medium' | 'Low' });
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>{level} Priority</Text>
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
                </Modal>

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={saveHabit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Habit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#b97a3b',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#5b3c2b',
        borderColor: '#a6855d',
    },
    input: {
        backgroundColor: '#f1d9b5',
        borderRadius: 8,
        padding: 12,
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
        height: 60, 
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
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerContainer: {
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden', 
        borderColor: '#a6855d',
        height: 40, 
    },
    pickerIOS: {
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

export default AddHabit;

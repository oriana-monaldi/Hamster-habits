import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 

const HabitsList = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchHabits = () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            const habitsRef = collection(FIRESTORE_DB, 'habits');
            const userHabitsQuery = query(
                habitsRef,
                where('userId', '==', currentUser.uid)
            );

            const unsubscribe = onSnapshot(userHabitsQuery, (snapshot) => {
                const fetchedHabits = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHabits(fetchedHabits);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching habits:', error);
                Alert.alert('Error', 'Failed to fetch habits. Please try again.');
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchHabits();
    }, [currentUser]);

    const handleDeleteHabit = async (id) => {
        try {
            const habitRef = doc(FIRESTORE_DB, 'habits', id);
            await deleteDoc(habitRef);
            Alert.alert('Success', 'Habit deleted successfully');
        } catch (error) {
            console.error('Error deleting habit:', error);
            Alert.alert('Error', 'Failed to delete habit');
        }
    };

    const getPriorityColor = (level) => {
        switch (level.toLowerCase()) {
            case 'high':
            case 'hight':
                return '#FF0000';
            case 'medium':
                return '#FFD700';
            case 'low':
                return '#32CD32';
            default:
                return '#808080';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Cargando hábitos...</Text>
            </View>
        );
    }

    const renderHabitItem = ({ item }) => (
        <View style={styles.habitItem}>
            <View style={styles.habitLeftSection}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.level) }]} />
                <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>{item.title}</Text>
                    <Text style={styles.habitDescription}>{item.description}</Text>
                    <Text style={styles.habitLevel}>Level: {item.level}</Text>
                </View>
            </View>
            <View style={styles.habitActions}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EditHabit', { habitId: item.id })} 
                    style={styles.actionButton}
                >
                    <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => handleDeleteHabit(item.id)} 
                    style={styles.actionButton}
                >
                    <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={habits}
            renderItem={renderHabitItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
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
    listContainer: {
        padding: 16,
    },
    habitItem: {
        backgroundColor: '#f1d9b5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    habitLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    priorityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    habitInfo: {
        flex: 1,
    },
    habitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    habitDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    habitLevel: {
        fontSize: 12,
        color: '#0096FF',
    },
    habitActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    actionIcon: {
        fontSize: 20,
    },
});

export default HabitsList;
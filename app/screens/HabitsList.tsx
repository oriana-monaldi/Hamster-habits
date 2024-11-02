import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import {
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    query,
    where,
    QuerySnapshot,
    DocumentData,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Definir interfaces para los tipos
interface Habit {
    id: string;
    title: string;
    description: string;
    level: string;
    userId: string;
}

type NavigationProps = {
    navigate: (screen: string, params?: any) => void;
};

type PriorityLevel = 'high' | 'medium' | 'low' | 'hight';

const HabitsList: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const currentUser = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        const fetchHabits = () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            const habitsRef = collection(FIRESTORE_DB, "habits");
            const userHabitsQuery = query(
                habitsRef,
                where("userId", "==", currentUser.uid)
            );

            const unsubscribe = onSnapshot(
                userHabitsQuery,
                (snapshot: QuerySnapshot<DocumentData>) => {
                    const fetchedHabits = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Habit[];
                    setHabits(fetchedHabits);
                    setLoading(false);
                },
                (error: Error) => {
                    console.error("Error fetching habits:", error);
                    Alert.alert("Error", "Failed to fetch habits. Please try again.");
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        };

        fetchHabits();
    }, [currentUser]);

    const handleDeleteHabit = async (id: string): Promise<void> => {
        try {
            const habitRef = doc(FIRESTORE_DB, "habits", id);
            await deleteDoc(habitRef);
            Alert.alert("Success", "Habit deleted successfully");
        } catch (error) {
            console.error("Error deleting habit:", error);
            Alert.alert("Error", "Failed to delete habit");
        }
    };

    const getPriorityColor = (level: string): string => {
        switch (level.toLowerCase() as PriorityLevel) {
            case "high":
            case "hight":
                return "#FF0000";
            case "medium":
                return "#FFD700";
            case "low":
                return "#32CD32";
            default:
                return "#808080";
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

    const renderHabitItem: React.FC<{ item: Habit }> = ({ item }) => (
        <View style={styles.habitItem}>
            <View style={styles.habitLeftSection}>
                <View
                    style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(item.level) },
                    ]}
                />
                <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>{item.title}</Text>
                    <Text style={styles.habitDescription}>{item.description}</Text>
                    <Text style={styles.habitLevel}>Level: {item.level}</Text>
                </View>
            </View>
            <View style={styles.habitActions}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("EditHabit", { habitId: item.id })}
                    style={styles.actionButton}
                >
                    <Icon name="pencil" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteHabit(item.id)}
                    style={styles.actionButton}
                >
                    <Icon name="delete" size={24} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={habits}
            renderItem={renderHabitItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};
const styles = StyleSheet.create({
    loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    },
    loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    },
    listContainer: {
    padding: 16,
    },
    habitItem: {
    backgroundColor: "#f1d9b5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    },
    habitDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    },
    habitLevel: {
    fontSize: 12,
    color: "#0096FF",
    },
    habitActions: {
    flexDirection: "row",
    alignItems: "center",
    },
    actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    },
});

export default HabitsList;

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import AddHabits from './app/screens/AddHabits';
import List from './app/screens/List';
import EditHabit from './app/screens/EditHabits';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { View, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator 
      initialRouteName="Habits"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d1a671',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#f5e8c7', 
        },
      }}
    >
      <InsideStack.Screen 
        name="Habits" 
        component={List}
        options={{
          title: 'My Habits'
        }}
      />
      <InsideStack.Screen 
        name="AddHabit" 
        component={AddHabits}
        options={{
          title: 'Add New Habit'
        }}
      />
      <InsideStack.Screen 
        name="EditHabit" 
        component={EditHabit}
        options={{
          title: 'Edit Habit'
        }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#f5e8c7',
            },
          }}
        >
          {user ? (
            <Stack.Screen 
              name="Inside" 
              component={InsideLayout} 
              options={{ headerShown: false }} 
            />
          ) : (
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ headerShown: false }} 
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8c7', 
  },
});
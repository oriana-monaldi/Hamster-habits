import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('This account does not exist');
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Invalid email format. Try again (e.g., name@example.com)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Image source={require('../../assets/hamster.png')} style={styles.logo} />
                <Text style={styles.title}>Hamster Habits</Text>
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#a6855d"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        value={password}
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#a6855d"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#a6855d" />
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#b79452" />
                ) : (
                    <>
                        <TouchableOpacity style={styles.button} onPress={signIn}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={signUp}>
                            <Text style={styles.buttonText}>Create Account</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5e8c7',
    },
    innerContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#d1a671',
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        paddingBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        color: '#b97a3b',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f1d9b5',
        borderRadius: 8,
        color: '#3e2a15',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: '#a6855d',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f1d9b5',
        paddingRight: 10, 
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        color: '#3e2a15',
        borderRadius: 8,
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#b79452',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: '#a6855d',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});

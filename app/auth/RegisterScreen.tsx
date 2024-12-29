import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const router = useRouter();

    const scaleAnim = new Animated.Value(1);

    const handleRegisterButtonPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const handleRegisterButtonPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
            router.replace("/auth/LoginScreen");
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.formContainer}>
                    {/* Heading Text */}
                    <Text style={styles.heading}>Create Account</Text>

                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#ffffff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholderTextColor="#B0B0B0"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#ffffff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#B0B0B0"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#ffffff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#B0B0B0"
                        />
                    </View>

                    {/* Animated Register Button */}
                    <Animated.View style={[styles.registerButton, { transform: [{ scale: scaleAnim }] }]} >
                        <TouchableOpacity
                            onPressIn={handleRegisterButtonPressIn}
                            onPressOut={handleRegisterButtonPressOut}
                            onPress={handleRegister}
                        >
                            <Text style={styles.registerButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Login Link */}
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                        <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
                    </TouchableOpacity>
                </View>

                {/* Dialog for Registration Feedback */}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Registration Failed</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",  // Center content vertically
        alignItems: "center",      // Center content horizontally
        backgroundColor: "#6A82FB", // Soft purple background color
    },
    formContainer: {
        width: "90%",
        maxWidth: 380,   // Max width for larger screens
        alignItems: "center",
        position: "absolute",
        top: 180, // Adjust the form positioning lower to make room for the title
    },
    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 40,
        textAlign: "center", // Centered text
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 55,
        borderColor: "#FFFFFF",
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#4A4A4A",  // Darker background for input
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#ffffff",
        paddingVertical: 0,
    },
    registerButton: {
        width: "100%",
        height: 55,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#1E3A8A", // Vibrant blue for call-to-action
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    registerButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    loginButton: {
        marginTop: 16,
    },
    loginButtonText: {
        color: "#1E3A8A",  // Match the button color
        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
});

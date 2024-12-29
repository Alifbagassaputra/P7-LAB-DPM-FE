import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            setDialogMessage("Login successful!");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/(tabs)");
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                {/* Solid Blue Background */}
                <View style={styles.blueBackground}>
                    <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Log in to continue</Text>

                {/* Username Input with Icon */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color="#fff" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#fff"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Input with Icon */}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#fff"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* Login Button with Blue Background */}
                <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
                    <Text style={styles.registerButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Register Link */}
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/RegisterScreen")}>
                    <Text style={styles.loginButtonText}>Don't have an account? Register</Text>
                </TouchableOpacity>

                {/* Dialog for Login Feedback */}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
                        <Dialog.Title>{isSuccess ? "Success" : "Login Failed"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDialogDismiss}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#1E3A8A", // Solid Blue Background
    },
    blueBackground: {
        width: "100%",
        height: 250,
        backgroundColor: "#1E3A8A", // Solid Blue Background
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginBottom: 20, // Adjusted for better positioning
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 12,
        color: "#FFFFFF", // White title text for contrast against blue background
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        color: "#D1D5DB", // Light gray subtitle for contrast
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 55,
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#FFFFFF", // White background for input fields
        shadowColor: "#B4D1E7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    inputIcon: {
        marginRight: 10,
        color: "#4A4A4A", // Gray icon for input fields
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#4A4A4A", // Dark text color for inputs
    },
    registerButton: {
        width: "100%",
        height: 55,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#6A82FB", // Blue button color
        shadowColor: "#6A82FB",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    loginButton: {
        marginTop: 16,
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#6A82FB",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#6A82FB", // Blue text for Register link
        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
});

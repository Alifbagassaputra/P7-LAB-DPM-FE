import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import API_URL from '@/config/config';
import { ThemedView } from '@/components/ThemedView';
import { useTodos } from '@/context/TodoContext';

type Todo = {
    _id: string;
    title: string;
    description: string;
};

const TodoDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateTodo } = useTodos();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTodo();
    }, [id]);

    const fetchTodo = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: Todo }>(`${API_URL}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedTodo = response.data.data;
            setTodo(fetchedTodo);
            setTitle(fetchedTodo.title);
            setDescription(fetchedTodo.description);
        } catch (error) {
            console.error('Failed to fetch todo', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTodo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put<{ data: Todo }>(
                `${API_URL}/api/todos/${id}`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedTodo = response.data.data;
            setTodo(updatedTodo);
            updateTodo(updatedTodo);
            setVisible(true);
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    const hideDialog = () => {
        setVisible(false);
        router.back();
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator style={styles.loading} animating={true} color="#6200ee" size="large" />
                </ThemedView>
            </PaperProvider>
        );
    }

    if (!todo) {
        return null;
    }

    return (
        <PaperProvider>
            <Stack.Screen options={{ title: 'Todo Detail' }} />
            <ThemedView style={styles.container}>
                <Card style={styles.card} elevation={5}>
                    <Card.Content>
                        <TextInput
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            mode="outlined"
                            theme={{ colors: { primary: '#6200ee' } }}
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            mode="outlined"
                            multiline
                            theme={{ colors: { primary: '#6200ee' } }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleUpdateTodo}
                            style={styles.updateButton}
                            labelStyle={styles.buttonLabel}
                            buttonColor="#6200ee"
                        >
                            Update Todo
                        </Button>
                    </Card.Content>
                </Card>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Success</Dialog.Title>
                        <Dialog.Content>
                            <Text>Todo updated successfully</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog} mode="contained" buttonColor="#6200ee">OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    card: {
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 15,
        borderRadius: 8,
    },
    updateButton: {
        marginTop: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TodoDetailScreen;

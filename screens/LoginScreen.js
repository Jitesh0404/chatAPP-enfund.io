
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { setUsername } from '../utility/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsernameInput] = useState('');

  const handleSetUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    try {
      const response = await setUsername(username);
      console.log("Response setUsername :- ",response)
      navigation.navigate('Rooms', { username, userId: response.user_id });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to set username');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsernameInput}
        placeholder="Username"
      />
      <Button title="Set Username" onPress={handleSetUsername} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }
});
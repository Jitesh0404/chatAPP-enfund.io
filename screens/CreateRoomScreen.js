// screens/CreateRoomScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createRoom } from '../utility/api';

export default function CreateRoomScreen({ navigation, route }) {
  const { username, userId } = route.params;
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Room name cannot be empty');
      return;
    }

    try {
      const response = await createRoom(roomName);
      console.log('Room created:', response);
      // Navigate to Chat screen with the new room's ID
      if(response.name){
        navigation.navigate('Chat', {
          roomId: response.id, // Use 'id' from response
          username,
          userId,
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      const errorMessage = error.message || 'Failed to create room';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Room</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
        placeholder="Enter room name"
        autoCapitalize="none"
        onSubmitEditing={handleCreateRoom} // Allow submission via keyboard
      />
      <Button title="Create Room" onPress={handleCreateRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
});
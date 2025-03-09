// screens/RoomsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getRooms } from '../utility/api';

export default function RoomsScreen({ navigation, route }) {
  const { username, userId } = route.params;
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      console.log('Fetched rooms:', response);
      setRooms(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Error', error.message || 'Failed to fetch rooms');
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoom = ({ item }) => (
    <View style={styles.roomItem}>
      <View style={styles.roomNameContainer}>
        <Text style={styles.roomName}>{item.name}</Text>
      </View>
      <Button
        title="Join"
        onPress={() => navigation.navigate('Chat', { roomId: item.id, username, userId })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rooms</Text>
      {rooms.length === 0 ? (
        <Text>No rooms available</Text>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          extraData={rooms}
        />
      )}
      <Button
        title="Create New Room"
        onPress={() => navigation.navigate('CreateRoom', { username, userId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomNameContainer: {
    flex: 1, // Allow the container to take available space
    marginRight: 10, // Space between text and button
  },
  roomName: {
    fontSize: 16,
    flexWrap: 'wrap', // Enable text wrapping
  },
});
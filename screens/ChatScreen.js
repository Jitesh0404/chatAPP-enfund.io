// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getMessages } from '../utility/api';

export default function ChatScreen({ route }) {
  const { roomId, username, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const wsRef = useRef(null);
  const flatListRef = useRef(null);

  const fetchInitialMessages = async () => {
    try {
      const response = await getMessages(roomId);
      const lastTenMessages = Array.isArray(response) ? response.slice(-10) : [];
      setMessages(lastTenMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', error.message || 'Failed to fetch messages');
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchInitialMessages();

    const ws = new WebSocket(`wss://chat-api-k4vi.onrender.com/ws/${roomId}/${username}`); // Use wss://
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected to:', `wss://chat-api-k4vi.onrender.com/ws/${roomId}/${username}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'message') {
        // Handle nested message object
        const messageData = data.message || {}; // Fallback if message is missing
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              content: messageData.content || 'No content',
              username: messageData.username || 'Unknown',
              created_at: messageData.created_at || new Date().toISOString(),
              id: messageData.id?.toString() || Date.now().toString(),
              room_id: roomId,
              user_id: messageData.user_id || userId,
            },
          ];
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
          return newMessages;
        });
      } else if (data.event === 'join' || data.event === 'leave') {
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              content: `${data.username || 'Unknown'} has ${data.event}ed the room`,
              username: 'System',
              created_at: new Date().toISOString(),
              id: Date.now().toString(),
              system: true,
            },
          ];
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
          return newMessages;
        });
      }
    };

    ws.onerror = (error) => {
      Alert.alert('Error', 'WebSocket connection failed. Retrying...');
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          wsRef.current = new WebSocket(`wss://chat-api-k4vi.onrender.com/ws/${roomId}/${username}`);
        }
      }, 2000);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [roomId, username, userId]);

  const sendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    const payload = {
      event: 'message',
      content: message,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
      // setMessages((prev) => {
      //   const newMessages = [
      //     ...prev,
      //     {
      //       content: message,
      //       username,
      //       created_at: new Date().toISOString(),
      //       id: Date.now().toString(),
      //       room_id: roomId,
      //       user_id: userId,
      //     },
      //   ];
      //   setTimeout(() => {
      //     flatListRef.current?.scrollToEnd({ animated: true });
      //   }, 100);
      //   return newMessages;
      // });
      setMessage('');
    } else {
      Alert.alert('Error', 'WebSocket is not connected. Please try again.');
      console.log('WebSocket not open, state:', wsRef.current?.readyState);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.username === username;
    const isSystem = item.system;

    return (
      <View style={[
        styles.messageContainer,
        isSender ? styles.senderMessage : styles.receiverMessage,
        isSystem && styles.systemMessage,
      ]}>
        <View style={styles.messageContentWrapper}>
          <Text style={styles.messageHeader}>
            {item.username || 'Unknown'}: {item.created_at ? new Date(item.created_at).toLocaleTimeString() : ''}
          </Text>
          <Text style={styles.messageContent}>{item.content || 'No content'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        // inverted
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => {
            setMessage(text);
          }}
          placeholder="Type a message..."
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  messageList: { flex: 1 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '70%',
  },
  senderMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  receiverMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  systemMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
    fontStyle: 'italic',
    color: 'gray',
  },
  messageContentWrapper: {
    flexDirection: 'column',
  },
  messageHeader: {
    fontSize: 12,
    color: '#555',
  },
  messageContent: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: { flexDirection: 'row', padding: 10 },
  input: { flex: 1, borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5 },
});
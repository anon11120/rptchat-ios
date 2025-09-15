import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { RPTChat } from '../services/RPTChatService';

const MainScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setSettings(RPTChat.settings);
    
    RPTChat.on('settingChanged', (key, value) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    });

    return () => {
      RPTChat.removeAllListeners('settingChanged');
    };
  }, []);

  // Demo chat data
  const demoChats = [
    {
      id: 1,
      name: 'Saved Messages',
      message: 'Welcome to RPTChat!',
      time: '12:30'
    },
    {
      id: 2,
      name: 'Demo Chat',
      message: 'Ghost Mode and Anti-Recall are active',
      time: '11:45'
    }
  ];

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
      <Text style={styles.chatTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RPTChat</Text>
        <View style={styles.statusIndicators}>
          {settings.ghostMode && (
            <View style={styles.ghostIndicator}>
              <Text style={styles.indicatorText}>👻</Text>
            </View>
          )}
          {settings.antiRecall && (
            <View style={styles.antiRecallIndicator}>
              <Text style={styles.indicatorText}>🛡️</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={demoChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  statusIndicators: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  ghostIndicator: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  antiRecallIndicator: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  indicatorText: {
    color: 'white',
    fontSize: 10,
  },
  settingsButton: {
    padding: 5,
  },
  settingsButtonText: {
    fontSize: 18,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  chatTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default MainScreen;

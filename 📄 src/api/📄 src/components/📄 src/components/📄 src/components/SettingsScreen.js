import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Switch, 
  Alert 
} from 'react-native';
import { RPTChat } from '../services/RPTChatService';

const SettingsScreen = ({ navigation }) => {
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

  const toggleSetting = async (key) => {
    await RPTChat.saveSetting(key, !settings[key]);
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, description, value, onToggle }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onToggle}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
        thumbColor={value ? '#7c3aed' : '#d1d5db'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text

import { TelegramAPI } from '../api/TelegramAPI';
import { Database } from '../storage/Database';
import { EventEmitter } from 'events';

class RPTChatService extends EventEmitter {
  constructor() {
    super();
    this.api = new TelegramAPI();
    this.isConnected = false;
    this.currentUser = null;
    
    this.settings = {
      ghostMode: false,
      antiRecall: true,
      messageHistory: true,
      saveMedia: true,
      blockSpam: false
    };
  }

  async initialize() {
    try {
      const session = await Database.loadSession();
      if (session) {
        this.api.authKey = session.auth_key;
        this.api.sessionId = session.session_id;
        this.currentUser = { id: session.user_id };
        this.isConnected = true;
      }

      await this.loadSettings();
      this.emit('initialized');
    } catch (error) {
      console.error('RPTChat initialization error:', error);
    }
  }

  async loadSettings() {
    for (const key of Object.keys(this.settings)) {
      const value = await Database.getSetting(key);
      if (value !== null) {
        this.settings[key] = value;
      }
    }

    this.api.ghostMode = this.settings.ghostMode;
    this.api.antiRecall = this.settings.antiRecall;
    this.api.messageHistory = this.settings.messageHistory;
  }

  async saveSetting(key, value) {
    this.settings[key] = value;
    await Database.saveSetting(key, value);
    
    if (key === 'ghostMode') this.api.ghostMode = value;
    if (key === 'antiRecall') this.api.antiRecall = value;
    if (key === 'messageHistory') this.api.messageHistory = value;
    
    this.emit('settingChanged', key, value);
  }

  async sendCode(phoneNumber) {
    return await this.api.sendCode(phoneNumber);
  }

  async signIn(phoneNumber, phoneCodeHash, phoneCode) {
    const result = await this.api.signIn(phoneNumber, phoneCodeHash, phoneCode);
    
    if (result.success) {
      this.currentUser = result.user;
      this.isConnected = true;
      this.emit('authenticated', result.user);
    }
    
    return result;
  }

  async toggleGhostMode() {
    const newValue = !this.settings.ghostMode;
    await this.saveSetting('ghostMode', newValue);
    return newValue;
  }

  async toggleAntiRecall() {
    const newValue = !this.settings.antiRecall;
    await this.saveSetting('antiRecall', newValue);
    return newValue;
  }
}

export const RPTChat = new RPTChatService();

// Simplified database implementation for demo
class DatabaseManager {
  constructor() {
    this.storage = new Map();
    this.init();
  }

  async init() {
    console.log('RPTChat Database initialized');
  }

  async saveMessage(message) {
    const key = `message_${message.id}`;
    this.storage.set(key, message);
  }

  async getMessage(chatId, messageId) {
    const key = `message_${messageId}`;
    return this.storage.get(key) || null;
  }

  async markMessageDeleted(chatId, messageId) {
    const message = await this.getMessage(chatId, messageId);
    if (message) {
      message.is_deleted = true;
      message.deleted_at = Date.now();
      await this.saveMessage(message);
    }
  }

  async saveMessageHistory(historyData) {
    const key = `history_${historyData.id}_${Date.now()}`;
    this.storage.set(key, historyData);
  }

  async saveLocalStatus(isOnline, userId = 0) {
    const key = `status_${userId}`;
    this.storage.set(key, {
      is_online: isOnline,
      last_seen: Date.now(),
      updated_at: Date.now()
    });
  }

  async saveSetting(key, value) {
    const settingKey = `setting_${key}`;
    this.storage.set(settingKey, value);
  }

  async getSetting(key) {
    const settingKey = `setting_${key}`;
    return this.storage.get(settingKey) || null;
  }

  async saveSession(sessionData) {
    this.storage.set('session', sessionData);
  }

  async loadSession() {
    return this.storage.get('session') || null;
  }
}

export const Database = new DatabaseManager();

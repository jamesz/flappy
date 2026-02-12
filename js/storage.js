// Storage Manager - localStorage operations with error handling

export class StorageManager {
  static save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('localStorage save failed:', error);
      return false;
    }
  }

  static load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('localStorage load failed:', error);
      return defaultValue;
    }
  }

  static saveHighScore(score) {
    return this.save('flappyKiro_highScore', score);
  }

  static loadHighScore() {
    return this.load('flappyKiro_highScore', 0);
  }

  static saveAudioMuted(muted) {
    return this.save('flappyKiro_audioMuted', muted);
  }

  static loadAudioMuted() {
    return this.load('flappyKiro_audioMuted', false);
  }
}

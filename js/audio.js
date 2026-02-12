// Audio Manager - Audio playback with generated sounds

import { StorageManager } from './storage.js';

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.muted = StorageManager.loadAudioMuted();
    this.musicGainNode = null;
    this.musicOscillator = null;
  }

  async preload() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  playBeep(frequency, duration) {
    if (this.muted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(soundName) {
    if (this.muted || !this.audioContext) return;

    switch(soundName) {
      case 'jump':
        this.playBeep(440, 0.1);
        break;
      case 'score':
        this.playBeep(880, 0.15);
        break;
      case 'gameover':
        this.playDescendingTone();
        break;
      case 'explosion':
        this.playExplosion();
        break;
      case 'music':
        this.startMusic();
        break;
    }
  }

  playDescendingTone() {
    if (this.muted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(140, this.audioContext.currentTime + 0.5);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  playExplosion() {
    if (this.muted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  startMusic() {
    if (this.muted || !this.audioContext || this.musicOscillator) return;

    this.musicGainNode = this.audioContext.createGain();
    this.musicGainNode.gain.value = 0.1;
    this.musicGainNode.connect(this.audioContext.destination);

    this.musicOscillator = this.audioContext.createOscillator();
    this.musicOscillator.connect(this.musicGainNode);
    this.musicOscillator.type = 'sine';
    this.musicOscillator.frequency.value = 261.63; // C note

    this.musicOscillator.start();
    this.playMusicPattern();
  }

  playMusicPattern() {
    if (!this.musicOscillator || this.muted) return;

    const notes = [261.63, 329.63, 392.00, 329.63]; // C, E, G, E
    let noteIndex = 0;

    this.musicInterval = setInterval(() => {
      if (this.musicOscillator && !this.muted) {
        this.musicOscillator.frequency.value = notes[noteIndex % notes.length];
        noteIndex++;
      }
    }, 500);
  }

  stop(soundName) {
    if (soundName === 'music' && this.musicOscillator) {
      clearInterval(this.musicInterval);
      this.musicOscillator.stop();
      this.musicOscillator = null;
      this.musicGainNode = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    StorageManager.saveAudioMuted(this.muted);

    if (this.muted && this.musicOscillator) {
      this.stop('music');
    } else if (!this.muted && this.audioContext) {
      // Resume audio context if needed
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }

    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

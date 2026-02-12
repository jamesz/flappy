// Main Entry Point - Initialize and wire up all components

import { Game } from './game.js';
import { AudioManager } from './audio.js';
import { InputManager } from './input.js';
import { CanvasScaler } from './scaler.js';

async function init() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const loadingScreen = document.getElementById('loading-screen');
  const muteButton = document.getElementById('mute-button');
  const muteIcon = document.getElementById('mute-icon');

  // Initialize canvas scaler
  const scaler = new CanvasScaler(canvas, 800, 600);

  // Initialize audio manager and preload audio
  const audioManager = new AudioManager();
  try {
    await audioManager.preload();
  } catch (error) {
    console.warn('Audio preload failed, continuing without audio:', error);
  }

  // Update mute button icon
  muteIcon.textContent = audioManager.isMuted() ? '🔇' : '🔊';

  // Initialize game
  const game = new Game(canvas, ctx, audioManager);

  // Initialize input manager
  const inputManager = new InputManager(game, canvas);

  // Setup mute button
  muteButton.addEventListener('click', () => {
    const muted = audioManager.toggleMute();
    muteIcon.textContent = muted ? '🔇' : '🔊';
  });

  // Hide loading screen
  loadingScreen.classList.add('fade-out');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 300);
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Game Engine - Core game loop, state management, coordination

import { StorageManager } from './storage.js';
import { Physics } from './physics.js';
import { Renderer } from './renderer.js';

export class Game {
  constructor(canvas, ctx, audioManager) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.audioManager = audioManager;
    
    this.physics = new Physics(canvas.width, canvas.height);
    this.renderer = new Renderer(canvas, ctx);
    
    this.state = 'START';
    this.score = 0;
    this.highScore = StorageManager.loadHighScore();
    this.running = false;
    this.lastFrameTime = 0;
    
    this.initGameState();
    this.updateUI();
    this.renderInitialState();
  }

  initGameState() {
    this.ghosty = {
      x: 150,
      y: 100,
      width: 50,
      height: 50,
      velocity: 0,
      rotation: 0,
      flapTime: 0
    };
    this.walls = [];
    this.exploded = false;
  }

  start() {
    if (this.state !== 'START') return;
    
    this.state = 'FLOATING';
    this.score = 0;
    this.initGameState();
    this.running = true;
    this.updateUI();
    
    // Float for 2 seconds before starting
    setTimeout(() => {
      if (this.state === 'FLOATING') {
        this.state = 'PLAYING';
        this.audioManager.play('music');
        this.updateUI();
      }
    }, 2000);
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  jump() {
    if (this.state !== 'PLAYING') return;
    this.physics.jump(this.ghosty);
    this.audioManager.play('jump');
  }

  restart() {
    if (this.state !== 'GAME_OVER') return;
    this.state = 'START';
    this.updateUI();
  }

  gameLoop(currentTime) {
    if (!this.running) return;
    
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    this.update(deltaTime);
    this.render(deltaTime);
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(deltaTime) {
    if (this.state === 'FLOATING') {
      // During floating, just render but don't apply physics
      return;
    }
    
    if (this.state !== 'PLAYING') return;
    
    this.physics.updateGhosty(this.ghosty, deltaTime);
    this.walls = this.physics.updateWalls(this.walls, deltaTime, this.score);
    
    if (this.physics.checkCollisions(this.ghosty, this.walls)) {
      this.gameOver();
      return;
    }
    
    if (this.physics.checkScoring(this.ghosty, this.walls)) {
      this.score++;
      this.audioManager.play('score');
      this.renderer.triggerScoreFlash();
      this.updateUI();
    }
  }

  render(deltaTime) {
    this.renderer.render({
      ghosty: this.ghosty,
      walls: this.walls,
      groundY: this.physics.groundY,
      exploded: this.exploded
    }, deltaTime);
  }

  gameOver() {
    this.exploded = true;
    this.renderer.explode(this.ghosty);
    this.audioManager.play('explosion');
    this.state = 'GAME_OVER';
    this.running = false;
    this.audioManager.stop('music');
    
    setTimeout(() => {
      this.audioManager.play('gameover');
      this.updateUI();
    }, 1800); // Wait for explosion to complete
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      StorageManager.saveHighScore(this.highScore);
    }
  }

  updateUI() {
    const startScreen = document.getElementById('start-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const scoreDisplay = document.getElementById('score-display');
    const currentScore = document.getElementById('current-score');
    const highScore = document.getElementById('high-score');
    const finalScore = document.getElementById('final-score');
    const finalHighscore = document.getElementById('final-highscore');

    startScreen.classList.toggle('hidden', this.state !== 'START');
    gameoverScreen.classList.toggle('hidden', this.state !== 'GAME_OVER');
    scoreDisplay.classList.toggle('hidden', this.state !== 'PLAYING' && this.state !== 'FLOATING');

    if (currentScore) currentScore.textContent = this.score;
    if (highScore) highScore.textContent = this.highScore;
    if (finalScore) finalScore.textContent = this.score;
    if (finalHighscore) finalHighscore.textContent = this.highScore;
  }

  renderInitialState() {
    this.renderer.render({
      ghosty: this.ghosty,
      walls: this.walls,
      groundY: this.physics.groundY,
      exploded: this.exploded
    }, 0);
  }

  getState() {
    return this.state;
  }
}

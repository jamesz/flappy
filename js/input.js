// Input Manager - Keyboard and touch input handling

export class InputManager {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.spacePressed = false;

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  handleKeyDown(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!this.spacePressed) {
        this.spacePressed = true;
        this.handleJump();
      }
    }
  }

  handleKeyUp(e) {
    if (e.code === 'Space') {
      this.spacePressed = false;
    }
  }

  handleTouch(e) {
    e.preventDefault();
    this.handleJump();
  }

  handleClick(e) {
    e.preventDefault();
    this.handleJump();
  }

  handleJump() {
    const state = this.game.getState();
    
    if (state === 'START') {
      this.game.start();
    } else if (state === 'PLAYING') {
      this.game.jump();
    } else if (state === 'GAME_OVER') {
      this.game.restart();
    }
  }
}

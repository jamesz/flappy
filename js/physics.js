// Physics Engine - Game mechanics, collision detection, difficulty progression

export class Physics {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.GRAVITY = 0.0015;
    this.JUMP_VELOCITY = -0.5;
    this.SCROLL_SPEED = 0.2;
    this.INITIAL_GAP_SIZE = 180;
    this.MIN_GAP_SIZE = 120;
    this.GAP_DECREASE_RATE = 2;
    this.WALL_WIDTH = 60;
    this.WALL_SPACING = 300;
    
    this.groundY = canvasHeight - 50;
  }

  updateGhosty(ghosty, deltaTime) {
    ghosty.velocity += this.GRAVITY * deltaTime;
    ghosty.y += ghosty.velocity * deltaTime;
    
    // Update rotation based on velocity (tilt up when jumping, down when falling)
    ghosty.rotation = Math.max(-30, Math.min(30, ghosty.velocity * 50));
    
    // Update flap animation
    if (ghosty.flapTime > 0) {
      ghosty.flapTime -= deltaTime;
    }
  }

  jump(ghosty) {
    ghosty.velocity = this.JUMP_VELOCITY;
    ghosty.flapTime = 200; // Flap animation duration
  }

  updateWalls(walls, deltaTime, score) {
    walls.forEach(wall => {
      wall.x -= this.SCROLL_SPEED * deltaTime;
    });

    // Remove off-screen walls
    const filtered = walls.filter(wall => wall.x + this.WALL_WIDTH > 0);
    
    // Add new wall if needed
    if (filtered.length === 0 || filtered[filtered.length - 1].x < this.canvasWidth - this.WALL_SPACING) {
      filtered.push(this.createWall(score));
    }

    return filtered;
  }

  createWall(score) {
    const gapSize = this.calculateGapSize(score);
    const minGapY = gapSize / 2;
    const maxGapY = this.groundY - gapSize / 2;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);

    return {
      x: this.canvasWidth,
      gapY: gapY,
      gapSize: gapSize,
      width: this.WALL_WIDTH,
      scored: false
    };
  }

  calculateGapSize(score) {
    const gapSize = this.INITIAL_GAP_SIZE - (score * this.GAP_DECREASE_RATE);
    return Math.max(gapSize, this.MIN_GAP_SIZE);
  }

  checkCollisions(ghosty, walls) {
    // Ground collision
    if (ghosty.y + ghosty.height >= this.groundY) return true;
    
    // Ceiling collision
    if (ghosty.y <= 0) return true;

    // Wall collisions
    for (const wall of walls) {
      if (this.checkWallCollision(ghosty, wall)) return true;
    }

    return false;
  }

  checkWallCollision(ghosty, wall) {
    // Check if ghosty is in wall's x range
    if (ghosty.x + ghosty.width > wall.x && ghosty.x < wall.x + wall.width) {
      // Check if ghosty hits top or bottom pipe
      const topPipeBottom = wall.gapY - wall.gapSize / 2;
      const bottomPipeTop = wall.gapY + wall.gapSize / 2;
      
      if (ghosty.y < topPipeBottom || ghosty.y + ghosty.height > bottomPipeTop) {
        return true;
      }
    }
    return false;
  }

  checkScoring(ghosty, walls) {
    for (const wall of walls) {
      if (!wall.scored && ghosty.x > wall.x + wall.width) {
        wall.scored = true;
        return true;
      }
    }
    return false;
  }
}

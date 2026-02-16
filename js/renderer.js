// Renderer - Canvas rendering and visual feedback

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.scoreFlashTime = 0;
    this.particles = [];
  }

  render(gameState, deltaTime) {
    this.clear();
    this.drawBackground();
    this.drawGround(gameState.groundY);
    this.drawWalls(gameState.walls);
    
    if (!gameState.exploded) {
      this.drawGhosty(gameState.ghosty);
    }
    
    if (gameState.countdown !== null && gameState.countdown > 0) {
      this.drawCountdown(gameState.ghosty, gameState.countdown);
    }
    
    this.updateAndDrawParticles(deltaTime);
    
    if (this.scoreFlashTime > 0) {
      this.scoreFlashTime -= deltaTime;
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGround(groundY) {
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, groundY, this.canvas.width, this.canvas.height - groundY);
  }

  drawWalls(walls) {
    this.ctx.fillStyle = '#2E7D32';
    this.ctx.strokeStyle = '#1B5E20';
    this.ctx.lineWidth = 3;

    walls.forEach(wall => {
      const topPipeHeight = wall.gapY - wall.gapSize / 2;
      const bottomPipeY = wall.gapY + wall.gapSize / 2;
      const bottomPipeHeight = this.canvas.height - bottomPipeY;

      // Top pipe
      this.ctx.fillRect(wall.x, 0, wall.width, topPipeHeight);
      this.ctx.strokeRect(wall.x, 0, wall.width, topPipeHeight);

      // Bottom pipe
      this.ctx.fillRect(wall.x, bottomPipeY, wall.width, bottomPipeHeight);
      this.ctx.strokeRect(wall.x, bottomPipeY, wall.width, bottomPipeHeight);
    });
  }

  drawGhosty(ghosty) {
    this.ctx.save();
    
    // Translate to Ghosty center
    const centerX = ghosty.x + ghosty.width / 2;
    const centerY = ghosty.y + ghosty.height / 2;
    this.ctx.translate(centerX, centerY);
    
    // Rotate based on velocity
    this.ctx.rotate((ghosty.rotation * Math.PI) / 180);

    // Draw white circle as background/fallback
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, ghosty.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Flapping animation - scale vertically
    const flapScale = ghosty.flapTime > 0 ? 1.2 : 1.0;
    this.ctx.scale(1, flapScale);
    
    // Draw emoji
    const fontSize = ghosty.height * 1.2;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('👻', 0, 0);
    
    this.ctx.restore();
  }

  triggerScoreFlash() {
    this.scoreFlashTime = 300;
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
      scoreDisplay.classList.add('score-flash');
      setTimeout(() => scoreDisplay.classList.remove('score-flash'), 300);
    }
  }

  explode(ghosty) {
    const centerX = ghosty.x + ghosty.width / 2;
    const centerY = ghosty.y + ghosty.height / 2;
    const colors = ['#FF4500', '#FF6347', '#FFD700', '#FFA500', '#FF8C00', '#FFFFFF'];
    
    // Create 80 particles with high speeds for shrapnel effect
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.4;
      const speed = 0.4 + Math.random() * 0.6; // Much faster
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1200 + Math.random() * 600,
        maxLife: 1200 + Math.random() * 600,
        size: 6 + Math.random() * 10, // Larger particles
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  updateAndDrawParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += 0.0005 * deltaTime; // Gravity on particles
      p.life -= deltaTime;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        const alpha = p.life / p.maxLife;
        const size = p.size * alpha;
        
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawCountdown(ghosty, countdown) {
    const x = ghosty.x + ghosty.width / 2;
    const y = ghosty.y + ghosty.height + 30;
    
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    // Draw shadow
    this.ctx.fillStyle = '#000000';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillText(countdown, x + 2, y + 2);
    
    // Draw countdown number
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillText(countdown, x, y);
  }
}

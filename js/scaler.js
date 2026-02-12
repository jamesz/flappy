// Canvas Scaler - Responsive canvas sizing maintaining aspect ratio

export class CanvasScaler {
  constructor(canvas, targetWidth = 800, targetHeight = 600) {
    this.canvas = canvas;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.targetAspect = targetWidth / targetHeight;
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 100);
    });
    
    this.resize();
  }

  resize() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const containerAspect = containerWidth / containerHeight;
    
    if (containerAspect > this.targetAspect) {
      this.canvas.style.height = '100%';
      this.canvas.style.width = `${containerHeight * this.targetAspect}px`;
    } else {
      this.canvas.style.width = '100%';
      this.canvas.style.height = `${containerWidth / this.targetAspect}px`;
    }
    
    this.canvas.width = this.targetWidth;
    this.canvas.height = this.targetHeight;
  }

  get width() {
    return this.targetWidth;
  }

  get height() {
    return this.targetHeight;
  }
}

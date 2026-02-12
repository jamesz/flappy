# Audio - Built-in Generated Sounds

This game now uses **Web Audio API** to generate simple sounds on-the-fly. No external audio files are required!

## Current Audio

The game generates these sounds automatically:
- **Jump**: 440Hz beep (0.1s)
- **Score**: 880Hz beep (0.15s)  
- **Game Over**: Descending tone (440Hz → 140Hz)
- **Music**: Simple looping melody (C-E-G-E pattern)

## Upgrading to Custom Audio (Optional)

If you want to replace the generated sounds with custom MP3 files, you can modify `js/audio.js` to load files instead:

### Required Files
1. **music.mp3** - Background music (looping)
2. **jump.mp3** - Jump sound effect
3. **score.mp3** - Score sound effect
4. **gameover.mp3** - Game over sound effect

### Free Audio Sources
- https://freesound.org/
- https://opengameart.org/
- https://incompetech.com/ (for music)

Make sure audio files are properly licensed for your use.

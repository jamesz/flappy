# Running Flappy Kiro
* Run any local HTTP server to host the index.html files
* 1. npx http-server -p 8000
* 2. python3 -m http.server 8000
* Open http://localhost:8000/ in any browser




# Testing out Kiro

Testing out AWS Kiro Agentic development with a Flappy implementation
1. kiro-cli - to run Kiro cli
2. https://github.com/awslabs/aidlc-workflows
3. with aidlc - to kick start aidlc with Kiro cli
4. Follow Kiro instructions
5. aidlc resume - to resume aidlc with Kiro cli, say if you've deleted all the specs and want to start the next iteration

## This is how I built this with Kiro aidlc
with aidlc
I want to build a Flappy Bird clone called Flappy Kiro. Flappy Kiro is an arcade-style game in which the player controls a ghost called Ghosty, which moves persistently to the right. They are tasked with navigating Ghosty through a series of walls that have equally sized gaps placed at random heights. Ghosty automatically descends and only ascends when the player taps the spacebar. Each successful pass through a pair of walls awards the player one point. Colliding with a wall or the ground ends the gameplay.

Create this using JavaScript, html and Tailwind css, and make sure this works in a standard browser like Chrome. Ideally the game should scale as the browser window resizes. 

Organise code into files and folders as appropriate so it's easy to make modifications. Any server side code required to persist state should be created using Node.js and Express. For the initial iteration do this without any server side.

## Asking Kiro to tell me how the code works
> Can you tell me at a high level how this codebase works to render the flappy game?



# Architecture Overview

The codebase follows a modular component-based architecture with clear separation of concerns:

main.js (Entry Point)
   ↓
game.js (Orchestrator)
   ↓
├── physics.js (Game Logic)
├── renderer.js (Visual Output)
├── audio.js (Sound)
├── input.js (User Input)
├── storage.js (Persistence)
└── scaler.js (Canvas Sizing)


## Core Components

1. main.js - Bootstrap
- Initializes all managers (audio, input, scaler)
- Creates the Game instance
- Wires everything together
- Handles loading screen

2. game.js - Game Engine
- **State machine**: START → FLOATING → PLAYING → GAME_OVER
- **Game loop**: Uses requestAnimationFrame for smooth 60fps rendering
- **Orchestration**: Coordinates physics, rendering, audio, and scoring
- **Data flow**: Maintains game state (ghosty position, walls, score)

3. physics.js - Game Logic
- Gravity and velocity calculations
- Wall generation and movement
- Collision detection (ghosty vs walls/ground)
- Score detection (passing through gaps)

4. renderer.js - Visual Layer
- Canvas drawing operations
- Renders: background, ground, walls, ghosty, particles, countdown
- Particle system for explosion effects
- Visual feedback (score flash, rotation)

5. input.js - User Input
- Keyboard (Space) and touch event handling
- Routes input to appropriate game actions based on state
- Prevents key repeat spam

6. audio.js - Sound System
- Preloads audio files
- Plays: jump, score, explosion, music, game over sounds
- Mute/unmute functionality

## Rendering Flow

Game Loop (60fps)
    ↓
1. Calculate deltaTime (time since last frame)
    ↓
2. UPDATE phase (game.update)
   - Apply physics to ghosty (gravity, velocity)
   - Move walls left
   - Spawn new walls
   - Check collisions → game over
   - Check scoring → increment score
    ↓
3. RENDER phase (game.render → renderer.render)
   - Clear canvas
   - Draw background (sky blue)
   - Draw ground (brown)
   - Draw walls (green pipes)
   - Draw ghosty (👻 emoji with rotation)
   - Draw countdown (if FLOATING state)
   - Draw particles (explosion effects)
    ↓
4. Schedule next frame (requestAnimationFrame)


## Key Design Patterns

Delta Time: Frame-rate independent movement using time deltas instead of frame counts

State Machine: Game behavior changes based on current state (START/FLOATING/PLAYING/GAME_OVER)

Separation of Concerns: 
- Physics doesn't know about rendering
- Renderer doesn't know about game logic
- Game orchestrates but delegates specifics

Canvas 2D API: Direct pixel manipulation for high-performance rendering

Component Composition: Game owns instances of Physics and Renderer, passing data between them

This architecture makes the code maintainable, testable, and easy to extend with new features.
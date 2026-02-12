Testing out AWS Kiro with a Flappy implementation
1. kiro-cli
2. https://github.com/awslabs/aidlc-workflows
3. with aidlc
4. aidlc resume

with aidlc
I want to build a Flappy Bird clone called Flappy Kiro. Flappy Kiro is an arcade-style game in which the player controls a ghost called Ghosty, which moves persistently to the right. They are tasked with navigating Ghosty through a series of walls that have equally sized gaps placed at random heights. Ghosty automatically descends and only ascends when the player taps the spacebar. Each successful pass through a pair of walls awards the player one point. Colliding with a wall or the ground ends the gameplay.

Create this using JavaScript, html and Tailwind css, and make sure this works in a standard browser like Chrome. Ideally the game should scale as the browser window resizes. 

Organise code into files and folders as appropriate so it's easy to make modifications. Any server side code required to persist state should be created using Node.js and Express. For the initial iteration do this without any server side.
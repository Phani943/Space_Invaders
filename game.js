// Game constants
const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;
const SPACESHIP_WIDTH = 64;
const SPACESHIP_HEIGHT = 64;
const SPACESHIP_SPEED = 5;
const ALIEN_WIDTH = 32;
const ALIEN_HEIGHT = 32;
const ALIEN_SPEED = 2;
const ALIEN_COUNT = 10;
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 16;
const BULLET_SPEED = 5;
const OPPONENT_ATTACK_RATE = 0.02;

// Game elements
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
let spaceship;
let aliens;
let bullets;
let opponentAttacks;
let score;
let lives;
let keys = {};

// Load images
const spaceship_img = new Image();
spaceship_img.src = 'spaceship.png';
const alien_img = new Image();
alien_img.src = 'alien.png';
const bullet_img = new Image();
bullet_img.src = 'bullet.png';

// Initialize the game
function init() {
  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;
  spaceship = {
    x: WINDOW_WIDTH / 2 - SPACESHIP_WIDTH / 2,
    y: WINDOW_HEIGHT - SPACESHIP_HEIGHT - 10,
  };
  aliens = [];
  bullets = [];
  opponentAttacks = [];
  score = 0;
  lives = 3;
  createAliens();
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  requestAnimationFrame(gameLoop);
  // Add touch event listeners
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

// Handle touchstart event
function handleTouchStart(event) {
  // Prevent default behavior
  event.preventDefault();

  // Get the first touch object
  const touch = event.touches[0];

  // Check if the touch is on the left or right side of the canvas
  if (touch.clientX < canvas.width / 2) {
    // Set the left key to true
    keys.ArrowLeft = true;
  } else {
    // Set the right key to true
    keys.ArrowRight = true;
  }

  // Fire a bullet
  fireBullet();
}

// Handle touchmove event
function handleTouchMove(event) {
  // Prevent default behavior
  event.preventDefault();

  // Get the first touch object
  const touch = event.touches[0];

  // Check if the touch is on the left or right side of the canvas
  if (touch.clientX < canvas.width / 2) {
    // Set the left key to true and the right key to false
    keys.ArrowLeft = true;
    keys.ArrowRight = false;
  } else {
    // Set the right key to true and the left key to false
    keys.ArrowRight = true;
    keys.ArrowLeft = false;
  }
}

// Handle touchend event
function handleTouchEnd(event) {
  // Prevent default behavior
  event.preventDefault();

  // Set both keys to false
  keys.ArrowLeft = false;
  keys.ArrowRight = false;
}

}

// Create aliens
function createAliens() {
  for (let i = 0; i < ALIEN_COUNT; i++) {
    const alien = {
      x: Math.random() * (WINDOW_WIDTH - ALIEN_WIDTH),
      y: Math.random() * 150 + 50,
      direction: 1,
    };
    aliens.push(alien);
  }
}

// Handle keydown event
function handleKeyDown(event) {
  keys[event.code] = true;
  if (event.code === 'Space') {
    fireBullet();
  }
}

// Handle keyup event
function handleKeyUp(event) {
  keys[event.code] = false;

  if(event.code === 'ArrowLeft' || event.code === 'ArrowRight'){
    spaceship.x += 0;
  }
}

// Fire bullet
function fireBullet() {
  const bullet = {
    x: spaceship.x + SPACESHIP_WIDTH / 2 - BULLET_WIDTH / 2,
    y: spaceship.y,
  };
  bullets.push(bullet);
}

// Create opponent attack
function createOpponentAttack(x, y) {
  const opponentAttack = {
    x: x - BULLET_WIDTH / 2,
    y: y,
  };
  opponentAttacks.push(opponentAttack);
}

// Check collisions
function checkCollisions() {
  // Bullet-alien collisions
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    for (let j = aliens.length - 1; j >= 0; j--) {
      const alien = aliens[j];
      if (
        bullet.x < alien.x + ALIEN_WIDTH &&
        bullet.x + BULLET_WIDTH > alien.x &&
        bullet.y < alien.y + ALIEN_HEIGHT &&
        bullet.y + BULLET_HEIGHT > alien.y
      ) {
        bullets.splice(i, 1);
        aliens.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  // Spaceship-alien collisions
  let spaceshipHit = false;
  for (let i = aliens.length - 1; i >= 0; i--) {
    const alien = aliens[i];
    if (
      spaceship.x < alien.x + ALIEN_WIDTH &&
      spaceship.x + SPACESHIP_WIDTH > alien.x &&
      spaceship.y < alien.y + ALIEN_HEIGHT &&
      spaceship.y + SPACESHIP_HEIGHT > alien.y
    ) {
      spaceshipHit = true;
      break;
    }
  }

  // Opponent attack-spaceship collisions
  for (let i = opponentAttacks.length - 1; i >= 0; i--) {
    const opponentAttack = opponentAttacks[i];
    if (
      spaceship.x < opponentAttack.x + BULLET_WIDTH &&
      spaceship.x + SPACESHIP_WIDTH > opponentAttack.x &&
      spaceship.y < opponentAttack.y + BULLET_HEIGHT &&
      spaceship.y + SPACESHIP_HEIGHT > opponentAttack.y
    ) {
      spaceshipHit = true;
      break;
    }
  }

  // Handle spaceship collision
  if (spaceshipHit) {
    lives--;
    if (lives === 0) {
      gameOver();
    } else {
      resetGame();
    }
  }

if(aliens.length <= 2)
{
    createAliens();
}
}

// Reset the game
function resetGame() {
  spaceship.x = WINDOW_WIDTH / 2 - SPACESHIP_WIDTH / 2;
  spaceship.y = WINDOW_HEIGHT - SPACESHIP_HEIGHT - 10;
  aliens = [];
  createAliens();
  bullets = [];
  opponentAttacks = [];

  keys.ArrowLeft = false;
  keys.ArrowRight = false;
}

// Game over
function gameOver() {
  alert('Game Over!');
  score = 0;
  lives = 3;
  resetGame();
  createAliens();
}

// Draw the game
function draw() {
  // Clear canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw spaceship
  context.drawImage(
    spaceship_img,
    spaceship.x,
    spaceship.y,
    SPACESHIP_WIDTH,
    SPACESHIP_HEIGHT
  );

  // Draw aliens
  for (let i = 0; i < aliens.length; i++) {
    const alien = aliens[i];
    context.drawImage(alien_img, alien.x, alien.y, ALIEN_WIDTH, ALIEN_HEIGHT);
  }

  // Draw bullets
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    context.drawImage(
      bullet_img,
      bullet.x,
      bullet.y,
      BULLET_WIDTH,
      BULLET_HEIGHT
    );
  }

  // Draw opponent attacks
  for (let i = 0; i < opponentAttacks.length; i++) {
    const opponentAttack = opponentAttacks[i];
    context.fillStyle = 'red';
    context.fillRect(
      opponentAttack.x,
      opponentAttack.y,
      BULLET_WIDTH,
      BULLET_HEIGHT
    );
  }

  // Draw score
  context.fillStyle = 'white';
  context.font = '24px Arial';
  context.fillText('Score: ' + score, 10, 30);

  // Draw lives
  context.fillText('Lives: ' + lives, WINDOW_WIDTH - 100, 30);
}

// Update spaceship position
function updateSpaceship() {
  if (keys.ArrowLeft && spaceship.x > 0) {
    spaceship.x -= SPACESHIP_SPEED;
  }

  if (keys.ArrowRight && spaceship.x < WINDOW_WIDTH - SPACESHIP_WIDTH) {
    spaceship.x += SPACESHIP_SPEED;
  }
}

// Update aliens position
function updateAliens() {
  for (let i = 0; i < aliens.length; i++) {
    const alien = aliens[i];
    alien.x += ALIEN_SPEED * alien.direction;
    if (alien.x <= 0 || alien.x >= WINDOW_WIDTH - ALIEN_WIDTH) {
      alien.direction *= -1;
      alien.y += ALIEN_HEIGHT;
    }
  }
}

// Update bullets position
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= BULLET_SPEED;
    if (bullet.y <= 0) {
      bullets.splice(i, 1);
    }
  }
}

// Update opponent attacks position
function updateOpponentAttacks() {
  for (let i = opponentAttacks.length - 1; i >= 0; i--) {
    const opponentAttack = opponentAttacks[i];
    opponentAttack.y += BULLET_SPEED;
    if (opponentAttack.y >= WINDOW_HEIGHT) {
      opponentAttacks.splice(i, 1);
    }
  }
}

// Opponent attacks
function opponentAttacksLogic() {
  if (Math.random() < OPPONENT_ATTACK_RATE) {
    const randomAlienIndex = Math.floor(Math.random() * aliens.length);
    const randomAlien = aliens[randomAlienIndex];
    createOpponentAttack(
      randomAlien.x + ALIEN_WIDTH / 2,
      randomAlien.y + ALIEN_HEIGHT
    );
  }
}

// Game loop
function gameLoop() {
  updateSpaceship();
  updateAliens();
  updateBullets();
  updateOpponentAttacks();
  checkCollisions();
  opponentAttacksLogic();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
init();

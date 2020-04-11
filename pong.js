/*
The Script to Run the pong Game
Begins by getting the canvas and its context from the HTML document

Then construct and draw both bars and the ball

An interval calls the main method, game, 60 times a second
Game calls 2 helper methods, update, which moves all game pieces and updates
the score if necessary,
and draw which clears the canvas and then draws all game objects in their
new locations
*/

//Get Canvas
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");


//Add Listener to move Player's Bar
window.addEventListener("mousemove", movePlayerBar);

//Create game objects--------------------------------------------------------
//Game Constants
const GameConstants = {
  ballRadius: 10,
  BallSpeed: 14,
  frameRate: 60,
  barWidth: 25,
  barHeight: 100,
  barSpeed: 10,
  netLength: 20,
  netWidth: 10,
  netSpacing: 5
}

//Ball Object
const Ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: GameConstants.ballRadius,
  horizontalVelocity: GameConstants.BallSpeed,
  verticalVelocity: GameConstants.BallSpeed
}

//Player Bar
const PlayerBar = {
  x: canvas.width - GameConstants.barWidth / 2,
  y: canvas.height / 2,
  width: GameConstants.barWidth,
  height: GameConstants.barHeight,
  speed: GameConstants.barSpeed,
  score: 0
}

//Computer Bar
const ComputerBar = {
  x: GameConstants.barWidth / 2,
  y: canvas.height / 2,
  width: GameConstants.barWidth,
  height: GameConstants.barHeight,
  speed: GameConstants.barSpeed,
  score: 0
}

//Draw Game in its Initial Position
draw();



//Main Game Method------------------------------------------------------------
function game() {
  update();
  draw();
}

//Run Game--------------------------------------------------------------------
setInterval(game, 1000 / GameConstants.frameRate)




//Helper Methods-------------------------------------------------------------
function update() {
  //Listener taking care of Player Bar
  moveComputerBar();
  moveBall();
}

/*Moves the player's bar based on input from the user
Restricts movement to the canvas
*/
function movePlayerBar(event) {
  //Get Player bar's new Position
  PlayerBar.y = event.clientY;

  //Restrict it to the canvas
  //From Bottom
  if (PlayerBar.y + PlayerBar.height / 2 > canvas.height) {
    PlayerBar.y = canvas.height - PlayerBar.height / 2;
  }
  //From Top
  if (PlayerBar.y - PlayerBar.height / 2 < 0) {
    PlayerBar.y = PlayerBar.height / 2;
  }
}


/* Returns up or down based on which is the better direction for the computer
bar to move. Deicdes this based on which gets the computer bar closest to the ball
*/
function chooseDirection() {
  //Find the distance From top and bottom of bar
  const distFromBottom = Math.abs(ComputerBar.y + ComputerBar.height / 2 - Ball.y);
  const distFromTop = Math.abs(ComputerBar.y - ComputerBar.height / 2 - Ball.y);

  //Pick the smallest
  if (distFromBottom < distFromTop) {
    return "Down";
  } else {
    return "Up";
  }
}

/*Moves the computer's bar in the direction most favorable to it
Restricts this movement to the canvas
*/
function moveComputerBar() {
  //Pick which direction to move
  const wichWay = chooseDirection();
  //Move in that direction
  if (wichWay == "Up") {
    ComputerBar.y -= ComputerBar.speed;
  }
  if (wichWay == "Down") {
    ComputerBar.y += ComputerBar.speed;
  }

  //Restrict to Canvas
  if (ComputerBar.y + ComputerBar.height / 2 > canvas.height) {
    ComputerBar.y = canvas.height - ComputerBar.height / 2;
  }
  if (ComputerBar.y - ComputerBar.height / 2 < 0) {
    ComputerBar.y = ComputerBar.height / 2;
  }

}

/*Moves the ball in the direction that its travelling in, then calls helper to
deal with collisions
*/
function moveBall() {
  //Move Ball
  Ball.x += Ball.horizontalVelocity;
  Ball.y += Ball.verticalVelocity;
  //Aptronym- Named what it does
  dealWithCollisions();
}

/* Calls a helper to figure out what the ball collided with, may be nothing
and then deals with that case
*/
function dealWithCollisions() {
  //What happedned
  let collidedWith = detectCollision();
  switch (collidedWith) {
    //Nothing at all
    case "None":
      return;

      //Either bar same result
    case "Bar":
      Ball.horizontalVelocity *= -1;
      break;

      //Top or bottom wall same result
    case "Wall":
      Ball.verticalVelocity *= -1;
      break;

      //Computer Scored
    case "ComputerScore":
      if (Math.random() <= .5) { //Randomly change velocity, dumb computer loops
        Ball.horizontalVelocity *= -1;
        Ball.verticalVelocity *= -1;
      }
      ComputerBar.score += 1; //Update Score
      Ball.x = canvas.width / 2; //Repostion Ball
      Ball.y = canvas.height / 2;
      break;

    case "PlayerScore":
      if (Math.random() <= .5) { //Randomly change velocity, dumb computer loops
        Ball.horizontalVelocity *= -1;
        Ball.verticalVelocity *= -1;
      }
      PlayerBar.score += 1; //Update Score
      Ball.x = canvas.width / 2; //Repostion Ball
      Ball.y = canvas.height / 2;
      break;
  }
}

/*Figures out what the ball collided with, may be nothing, based on its position
Returns what it was
*/
function detectCollision() {
  //Find Position of Player Bar's edges
  const playerTop = PlayerBar.y - PlayerBar.height / 2;
  const playerBottom = PlayerBar.y + PlayerBar.height / 2;
  const playerLeft = PlayerBar.x - PlayerBar.width / 2;
  const playerRight = PlayerBar.x + PlayerBar.width / 2;

  //Find Position of Computer Bar's Edges
  const comTop = ComputerBar.y - ComputerBar.height / 2;
  const comBot = ComputerBar.y + ComputerBar.height / 2;
  const comLeft = ComputerBar.x - ComputerBar.width / 2;
  const comRight = ComputerBar.x + ComputerBar.width / 2;

  //Find Postion of Ball's Edges
  const ballTop = Ball.y - Ball.radius;
  const ballBot = Ball.y + Ball.radius;
  const ballLeft = Ball.x - Ball.radius;
  const ballRight = Ball.x + Ball.radius;

  //computer scored
  if (ballRight <= 0) {

    return "PlayerScore";
  }
  //player scored
  if (ballLeft >= canvas.width) {
    return "ComputerScore";
  }

  //collides With playerBar
  if (ballRight >= playerLeft && ballTop <= playerBottom && ballBot >= playerTop) {
    return "Bar";
  }
  //collides with computer bar
  if (ballLeft <= comRight && ballTop <= comBot && ballBot >= comTop) {
    return "Bar";
  }

  //collides with top or bottom wall
  if (ballTop <= 0 || ballBot >= canvas.height) {
    return "Wall";
  }

  return "None";

}

/* Clear's the canvas then redraws all of the game objects
 */
function draw() {
  refresh();
  drawNet();
  drawScore();
  drawPlayerBar();
  drawComputerBar();
  drawBall();

}

/*Clear Canvas by filling it with a black rectangle*/
function refresh() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* Draws the Player's bar
 */
function drawPlayerBar() {
  //Find top left corner to start at
  const top = PlayerBar.y - PlayerBar.height / 2;
  const left = PlayerBar.x - PlayerBar.width / 2;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(left, top, PlayerBar.width, PlayerBar.height);
}

/* Draws the Computer's bar
 */
function drawComputerBar() {
  //Find top left corner to start at
  const top = ComputerBar.y - ComputerBar.height / 2;
  const left = ComputerBar.x - ComputerBar.width / 2;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(left, top, ComputerBar.width, ComputerBar.height);
}

function drawBall() {
  const top = Ball.y - Ball.radius;
  const left = Ball.x - Ball.radius;

  ctx.arc(left, top, Ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.beginPath();
}

function drawNet() {
  const howMany = canvas.height / (GameConstants.netLength + GameConstants.netSpacing);
  ctx.fillStyle = "WHITE";
  const xPos = canvas.width / 2;
  let yPos = 0;

  let i = 0;
  while (i < howMany) {
    ctx.fillStyle = "WHITE";
    ctx.fillRect(xPos, yPos, GameConstants.netWidth, GameConstants.netLength);
    yPos += GameConstants.netLength + GameConstants.netSpacing;
    i += 1;
  }
}

function drawScore() {
  ctx.font = "40px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText(ComputerBar.score, (canvas.width / 2) - 50, 50);
  ctx.fillText(PlayerBar.score, (canvas.width / 2) + 30, 50);
}
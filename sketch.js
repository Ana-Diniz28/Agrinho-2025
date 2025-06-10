function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let level = 1;

let legumes = [];

let collected = 0;

let required = 5;

let truckX, truckY;

let cityX, cityY;

let obstacles = [];

let obstacleSpeed = 3;

let score = 0;

let gameOver = false;

let timeLeft; // para nível 3

function setup() {

  createCanvas(800, 500);

  truckX = width / 2;

  truckY = height - 80;

  cityX = width - 100;

  cityY = height - 150;

  

  spawnLegumes();

  textFont('Arial');

  textAlign(LEFT, TOP);

  timeLeft = 30 * 60; // 30 segundos * 60 fps

}

function draw() {

  background(135, 206, 235); // céu azul

  if (gameOver) {

    fill(255, 0, 0);

    textSize(48);

    textAlign(CENTER, CENTER);

    text("Você bateu! Aperte R para reiniciar.", width / 2, height / 2);

    return;

  }

  if (level === 1) {

    levelOne();

  } else if (level === 2) {

    levelTwo();

  } else if (level === 3) {

    levelThree();

  }

}

function levelOne() {

  drawField();

  drawTruck(truckX, truckY);

  drawLegumes();

  fill(0);

  textSize(20);

  textAlign(LEFT, TOP);

  text(`Nível 1 - Colha legumes: ${collected} / ${required}`, 20, 20);

  if (collected >= required) {

    fill(0, 150, 0);

    textSize(24);

    textAlign(CENTER, TOP);

    text("Tudo coletado! Clique na cidade para entregar.", width / 2, 60);

    drawCity();

    if (mouseIsPressed && dist(mouseX, mouseY, cityX, cityY) < 50) {

      level = 2;

      resetLevelTwo();

    }

  }

}

function levelTwo() {

  background(180, 230, 255);

  fill(100, 200, 100);

  rect(0, 350, width, 150);

  drawTruck(truckX, truckY);

  drawCity();

  fill(0);

  textSize(24);

  textAlign(LEFT, TOP);

  text("Nível 2 - Leve o caminhão para a cidade! Desvie dos buracos.", 20, 20);

  text(`Pontuação: ${score}`, 20, 60);

  truckX = constrain(mouseX, 60, width - 60);

  for (let i = obstacles.length - 1; i >= 0; i--) {

    let obs = obstacles[i];

    obs.y += obstacleSpeed;

    fill(80, 50, 0);

    ellipse(obs.x, obs.y, obs.size, obs.size);

    if (obs.y > height) {

      obstacles.splice(i, 1);

      obstacles.push(spawnSingleObstacle());

      score++;

    } else if (dist(obs.x, obs.y, truckX, truckY) < 50) {

      gameOver = true;

    }

  }

  if (score >= 10) {

    level = 3;

    resetLevelThree();

  }

}

function levelThree() {

  background(135, 206, 235);

  fill(100, 200, 100);

  rect(0, 350, width, 150);

  truckX = constrain(mouseX, 60, width - 60);

  drawTruck(truckX, truckY);

  // Obstáculos descem mais rápido

  for (let i = obstacles.length - 1; i >= 0; i--) {

    let obs = obstacles[i];

    obs.y += obstacleSpeed + 1;

    fill(80, 50, 0);

    ellipse(obs.x, obs.y, obs.size, obs.size);

    if (obs.y > height) {

      obstacles.splice(i, 1);

      obstacles.push(spawnSingleObstacle());

      score++;

    } else if (dist(obs.x, obs.y, truckX, truckY) < 50) {

      gameOver = true;

    }

  }

  // Legumes aparecem e podem ser coletados

  drawLegumes();

  // Contagem regressiva do tempo

  timeLeft--;

  fill(0);

  textSize(20);

  textAlign(LEFT, TOP);

  text(`Nível 3 - Colete legumes e desvie!\nTempo restante: ${floor(timeLeft / 60)}s\nPontuação: ${score}\nLegumes coletados: ${collected}`, 20, 20);

  if (timeLeft <= 0) {

    if (collected >= required) {

      fill(0, 150, 0);

      textSize(36);

      textAlign(CENTER, CENTER);

      text("Parabéns! Você venceu o jogo!", width / 2, height / 2);

      noLoop();

    } else {

      fill(255, 0, 0);

      textSize(36);

      textAlign(CENTER, CENTER);

      text("Tempo esgotado! Tente novamente.", width / 2, height / 2);

      noLoop();

    }

  }

}

// --- Funções utilitárias ---

function drawTruck(x, y) {

  fill(255, 0, 0);

  rect(x - 60, y - 30, 120, 50); // corpo

  rect(x + 50, y - 20, 40, 30);  // cabine

  fill(0);

  ellipse(x - 40, y + 10, 30, 30);

  ellipse(x + 40, y + 10, 30, 30);

}

function drawLegumes() {

  for (let i = legumes.length - 1; i >= 0; i--) {

    let l = legumes[i];

    fill(0, 255, 0);

    ellipse(l.x, l.y, 30, 30);

    if (dist(mouseX, mouseY, l.x, l.y) < 30 && mouseIsPressed) {

      legumes.splice(i, 1);

      collected++;

    }

  }

}

function drawField() {

  fill(34, 139, 34);

  rect(0, 300, width, 200);

  fill(255, 204, 0);

  ellipse(100, 100, 80, 80);

  fill(139, 69, 19);

  rect(150, 280, 20, 40);

  fill(34, 139, 34);

  ellipse(160, 270, 60, 60);

}

function drawCity() {

  fill(100);

  rect(cityX - 60, cityY - 150, 120, 150);

  fill(80);

  rect(cityX - 50, cityY - 140, 30, 140);

  rect(cityX + 10, cityY - 130, 30, 130);

  fill(0);

  textAlign(CENTER, TOP);

  text("Cidade", cityX, cityY - 160);

}

function spawnLegumes() {

  legumes = [];

  collected = 0;

  for (let i = 0; i < required; i++) {

    legumes.push({

      x: random(50, width - 50),

      y: random(320, height - 50)

    });

  }

}

function spawnSingleObstacle() {

  return {

    x: random(60, width - 60),

    y: random(-200, -50),

    size: random(40, 60)

  };

}

function spawnObstacles() {

  obstacles = [];

  for (let i = 0; i < 5; i++) {

    obstacles.push(spawnSingleObstacle());

  }

}

function resetLevelTwo() {

  score = 0;

  gameOver = false;

  obstacles = [];

  spawnObstacles();

}

function resetLevelThree() {

  score = 0;

  collected = 0;

  gameOver = false;

  obstacles = [];

  spawnObstacles();

  spawnLegumes();

  timeLeft = 30 * 60;

}

// Reiniciar jogo ao apertar R

function keyPressed() {

  if (gameOver && (key === 'r' || key === 'R')) {

    level = 1;

    collected = 0;

    required = 5;

    gameOver = false;

    spawnLegumes();

    loop();

  }

}
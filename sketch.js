var PLAY = 1;
var END = 0;
var gameState = PLAY;
var doraemon, doraemon_running;
var back, backImg, invisibleGround;
var doraCake, doraCakeImg, car, carImg;
var cakeGroup, carGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var score;

function preload() {
    doraemon_running = loadAnimation("Doraemon 1.png", "Doraemon 2.png", "Doraemon 3.png", "Doraemon 4.png", "Doraemon 5.png", "Doraemon 6.png");
    backImg = loadImage("background2.png");
    doraCakeImg = loadImage("doracake.png");
    carImg = loadImage("police_car.png");
    ghostImg = loadImage("ghost.png");
    gameOverImg = loadImage("gameover3.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(650, 700);
    back = createSprite(600, 300, 600, 400);
    back.addImage(backImg);
    back.scale = 1.2;

    doraemon = createSprite(80, 490, 20, 50);
    doraemon.addAnimation("running", doraemon_running);
    doraemon.scale = 0.9;

    gameOver = createSprite(300, 150);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300, 300);
    restart.addImage(restartImg);

    gameOver.scale = 0.3;
    restart.scale = 1.2;

    invisibleGround = createSprite(200, 510, 800, 10);
    invisibleGround.visible = false;

    cakeGroup = createGroup();
    carGroup = createGroup();
    ghostGroup = createGroup();

    score = 0;
}

function draw() {
    background(255);
    back.velocityX = -5;
    if (gameState === PLAY) {
        gameOver.visible = false;
        restart.visible = false;

        back.velocityX = -(4 + 3 * score / 100);

        if (back.x < 0) {
            back.x = back.width / 2;
        }

        if (keyDown("space") && doraemon.y >= 300) {
            doraemon.velocityY = -20;
        }
        doraemon.velocityY = doraemon.velocityY + 1;

        cake();
        car();
        ghost();

        if (carGroup.isTouching(doraemon)) {
            gameState = END;
        }
        if (ghostGroup.isTouching(doraemon)) {
            gameState = END;
        }
        if (cakeGroup.isTouching(doraemon)) {
            cakeGroup.destroyEach();
            score = score + 5;
        }
    } else if (gameState === END) {

        gameOver.visible = true;
        restart.visible = true;

        if (mousePressedOver(restart)) {
            reset();
        }

        back.velocityX = 0;
        doraemon.velocityY = 0;

        carGroup.setLifetimeEach(-1);
        ghostGroup.setLifetimeEach(-1);
        cakeGroup.setLifetimeEach(-1);

        carGroup.setVelocityXEach(0);
        ghostGroup.setVelocityXEach(0);
        cakeGroup.setVelocityXEach(0);

    }
    doraemon.collide(invisibleGround);
    drawSprites();

    stroke("black");
    textSize(30);
    fill("black");
    textFont("algerian");
    text("SCORE : " + score, 250, 50);
}

function cake() {
    if (World.frameCount % 80 === 0) {
        var cake = createSprite(550, 500, 10, 10);
        cake.y = Math.round(random(100, 450));
        cake.addImage(doraCakeImg);
        cake.scale = 0.06;
        cake.velocityX = -6;

        cake.lifetime = 100;

        cake.depth = doraemon.depth;
        doraemon.depth = doraemon.depth + 1;

        cakeGroup.add(cake);

    }
}

function car() {
    if (World.frameCount % 190 === 0) {
        var car = createSprite(400, 470, 10, 10);
        car.addImage(carImg);
        car.velocityX = -(6 + score / 100);
        car.scale = 0.9;
        car.lifetime = 100;

        carGroup.add(car);
    }
}

function ghost() {
    if (World.frameCount % 160 === 0) {
        var ghost = createSprite(400, 470, 10, 10);
        ghost.addImage(ghostImg);
        ghost.velocityX = -(6 + score / 100);
        ghost.scale = 0.07;
        ghost.lifetime = 100;

        ghostGroup.add(ghost);
    }
}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    cakeGroup.destroyEach();
    carGroup.destroyEach();
    ghostGroup.destroyEach();
    score = 0;
}
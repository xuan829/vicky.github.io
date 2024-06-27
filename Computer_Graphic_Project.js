let player;
let bullets = [];
let targets = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let scoreP;
let font;
let restartButton;
let totalSeconds = 60;
let counter;
let timeLeft;

function preload() 
{
    font = loadFont('assets/Chewy-Regular.ttf');
}

function setup() 
{
    createCanvas(1280, 720, WEBGL);
    player = createVector(0, 0, 0);
    generateTargets(15);
    
    scoreP = createP('');
    scoreP.style('color', 'red');
    scoreP.style('font-family', 'Chewy');
    scoreP.style('font-size', '30px');
    scoreP.position(130, -10);
    scoreP.hide(); 

    timeLeft = createP('');
    timeLeft.style('color', 'red');
    timeLeft.style('font-family', 'Chewy');
    timeLeft.style('font-size', '30px');
    timeLeft.position(130, 30);
    timeLeft.hide(); 

    rule = createP('----- Rules ----- <br>Red Box : End Game<br>Cyan Box : Collect Score');
    rule.style('color', 'black');
    rule.style('font-family', 'Chewy');
    rule.style('font-size', '20px');
    rule.position(130, 80);
    rule.hide(); 

    restartButton = createButton('Play Again');
    restartButton.style('font-size', '30px');
    restartButton.style('font-family', 'Chewy');
    restartButton.style('background-color', 'transparent');
    restartButton.style('color', 'black');
    restartButton.style('cursor', 'pointer');
    restartButton.position(320, 100);
    restartButton.mousePressed(restartGame);
    restartButton.hide(); 
}

function draw() 
{
    background(225);

    if (!gameStarted) 
    {
        drawCoverScreen();
        return; 
    }

    if (gameOver) 
    {
        resetMatrix();
        camera();

        fill('red');
        textFont(font);
        textSize(150);
        text('Game Over', -320, -60);
        text(`Score : ${score}`, -320, 80);

        scoreP.hide(); 
        timeLeft.hide(); 
        rule.hide();
        restartButton.show(); 
        return;
    }

    timeLeft.html(`Time Left : ${totalSeconds}s`);

    handleInput();

    camera(player.x, player.y, player.z + 500, player.x, player.y, player.z, 0, 1, 0);

    // drawBackground();

    drawPlayerView();

    drawBullets();

    drawTargets();

    checkCollisions();

    updateScore();
}

function drawCoverScreen() 
{
    background('white'); 
    fill('grey');
    textFont(font);
    textSize(100);
    text('BattleZone Games', -350, -50);
    text('Press Any Key to Start', -440, 50);
}

function drawPlayerView() 
{
    push();
    translate(player.x, player.y, player.z);
    stroke('red'); 

    line(130, -20, -130, -20); 
    line(-130, -20, -130, 50); 
    line(130, -20, 130, 50);   

    line(-130, 180, 130, 180); 
    line(130, 180, 130, 100); 
    line(-130, 180, -130, 100); 

    stroke('black');
    strokeWeight(2);
    line(-10, 80, 10, 80); 
    line(0, 90, 0, 70); 
    pop();
}

function drawBullets() 
{
    for (let bullet of bullets) 
    {
        bullet.position.add(bullet.velocity);
        push();
        translate(bullet.position.x, bullet.position.y, bullet.position.z);
        stroke('blue');
        strokeWeight(4); 
        noFill();
        box(30); 
        pop();
    }
}

function drawTargets() 
{
    for (let target of targets) 
    {
        push();
        translate(target.position.x, target.position.y, target.position.z);
        fill(target.color);
        box(100);
        pop();
    }
}

function checkCollisions() 
{
    let bulletsToRemove = [];
    let targetsToRemove = [];
    let regenerateTargets = false;

    for (let i = bullets.length - 1; i >= 0; i--) 
    {
        let bullet = bullets[i];
        for (let j = targets.length - 1; j >= 0; j--) 
        {
            let target = targets[j];
            if (dist(bullet.position.x, bullet.position.y, bullet.position.z, target.position.x, target.position.y, target.position.z) < 100) {
                if (target.type === 'danger') 
                {
                    gameOver = true;
                } 
                else if (target.type === 'score') 
                {
                    score += 1;
                    regenerateTargets = true;
                }
                bulletsToRemove.push(i);
                targetsToRemove.push(j);
                break;
            }
        }
    }

    for (let i of bulletsToRemove) 
    {
        bullets.splice(i, 1);
    }
    for (let j of targetsToRemove) 
    {
        targets.splice(j, 1);
    }

    if (regenerateTargets) 
    {
        generateTargets(15);
    }
}

function updateScore() 
{
    scoreP.html(`Score : ${score}`);
}

function handleInput() 
{
    if (keyIsDown(LEFT_ARROW)) 
    {
        player.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) 
    {
        player.x += 5;
    }
    if (keyIsDown(UP_ARROW)) 
    {
        player.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) 
    {
        player.y += 5;
    }
}

function keyPressed() 
{
    if (!gameStarted) 
    {
        gameStarted = true;
        startTime = millis();
        scoreP.show(); 
        timeLeft.show(); 
        rule.show();
        counter = setInterval(timer, 1000); 
        return;
    }

    if (key === ' ') 
    {
        let bulletPos = createVector(player.x, player.y + 80, player.z); 
        let bulletVel = createVector(0, 0, -30);
        bullets.push({
            position: bulletPos,
            velocity: bulletVel
        });
    }
}

function generateTargets(numTargets) 
{
    targets = [];
    bullets = []; 
    for (let i = 0; i < numTargets; i++) {
        let x = random(-width / 2, width / 2);
        let y = random(-height / 2, height / 2);
        let z = random(-1000, -200);
        let color = random() > 0.5 ? 'cyan' : 'red';
        let type = color === 'cyan' ? 'score' : 'danger';
        targets.push({ position: createVector(x, y, z), color: color, type: type });
    }
}

function restartGame() 
{
    clearInterval(counter); 
    totalSeconds = 60; 
    gameOver = false;
    score = 0;
    player.set(0, 0, 0);
    generateTargets(15);
    scoreP.show(); 
    timeLeft.show(); 
    rule.show();
    restartButton.hide(); 
    counter = setInterval(timer, 1000); 
}

function timer() 
{
    if (totalSeconds <= 0) 
    {
        gameOver = true;
        clearInterval(counter);     
    } 
    else 
    {
        totalSeconds--;
    }
}

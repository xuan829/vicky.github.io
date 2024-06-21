let x = 0;
let rectX = 520;
let a = 0.0;
let s = 1.0;
let frame = 0;

let moveLeft = 0;
let moveRight = 0;
let zoomingOut = true;
let tapDelay = 5;

let angle = 0.0;
let rotating = false;

let img; // 图像变量
let displayTimer = 0; // 显示计时器

function setup() {
    createCanvas(1280, 720);
    preload();
}

function draw() {
    background(255, 127, 80);

    noStroke();
    fill('white');
    textFont('Chewy', 45);
    var msg = 'Horizontal Swipe';
    text(msg, 500, 125);

    // 初始矩形绘制
    noStroke();
    fill(255, 0, 0, 100);
    rect(x + 650, 380, 250, 250, 20);
    rect(x + 950, 380, 250, 250, 20);
    rect(x + 1250, 380, 250, 250, 20);
    rect(x + 1550, 380, 250, 250, 20);
    rect(x + 1850, 380, 250, 250, 20);
    rect(x + 2150, 380, 250, 250, 20);

    if (rectX > 450) {
        stroke('white');
        strokeWeight(5);
        noFill();
        rect(rectX, 380, 230, 130, 50);
        rectX -= 5;
    } else {
        x -= 10; // 速度

        if (x < -900) {
            noLoop();

            // 清除特定的文本
            fill(255, 127, 80); // 使用与背景色相同的颜色清除文本
            rect(600, 90, 400, 100); // 绘制一个矩形覆盖先前的文本

            noStroke();
            fill('white');
            textFont('Chewy', 45);
            var msg = 'Tap';
            text(msg, 615, 130);

            stroke('white');
            strokeWeight(5);
            noFill();
            circle(x + 1560, 380, 150, 150);

            // 启动第一个动画
            firstAnimation();
        }
    }
    rectMode(CENTER);
}

function firstAnimation() {
    let frame = 0;

    function animate() {
        if (zoomingOut) {
            s = lerp(s, 0.2, 0.1); // 缩小
            if (frame >= tapDelay) {
                zoomingOut = false;
            }
        } else {
            s = lerp(s, 2.1, 0.1); // 放大

            moveLeft -= 12;
            moveRight += 12;

            background(246, 157, 37);

            // 重新绘制背景和文本
            noStroke();
            fill('white');
            textFont('Chewy', 45);
            var msg = 'Tap';
            text(msg, 615, 130);

            // 第一个、第二个和第三个矩形向左移
            fill(237, 145, 33);
            rect(x + 650 + moveLeft, 380, 250, 250, 20);
            rect(x + 950 + moveLeft, 380, 250, 250, 20);
            rect(x + 1250 + moveLeft, 380, 250, 250, 20);

            // 第四个矩形放大
            push();
            fill(237, 145, 33);

            translate(x + 1550, 380);
            scale(s);
            rect(0, 0, 200, 200, 20);

            // 只有当s小于一定值时才绘制圆形
            if (s < 1.4) {
                stroke('white');
                strokeWeight(5);
                noFill();
                circle(0, 0, 150, 150);
                circle(0, 0, 100, 100);
            }
            pop();

            // 第五个和第六个矩形向右移
            rect(x + 1850 + moveRight, 380, 250, 250, 20);
            rect(x + 2150 + moveRight, 380, 250, 250, 20);

            if (frame > 50) {
                // 启动第二个动画
                secondAnimation();
                return;
            }
        }

        frame++;
        requestAnimationFrame(animate);
    }
    animate();
}

function secondAnimation() {
    // 更新角度
    if (angle < HALF_PI) {
        rotating = true;
    }

    function animate() {
        if (rotating) {
            angle += 0.1;

            if (angle >= HALF_PI) {
                angle = HALF_PI;
                rotating = false;
            }
        }

        // 重新绘制背景和文本
        background(246, 157, 37);
        noStroke();
        fill('white');
        textFont('Chewy', 45);
        var msg = 'Rotation';
        text(msg, 570, 100);

        // 绘制放大的矩形并进行旋转
        push();
        fill(237, 145, 33);

        translate(x + 1550, 380); // 将原点移动到矩形中心
        rotate(angle); // 进行旋转
        scale(s); // 进行缩放
        rect(0, 0, 200, 200, 20); // 绘制矩形

        // 计算跟随矩形1的位置和角度
        let offsetX1 = cos(angle + HALF_PI) + 85;
        let offsetY1 = sin(angle + HALF_PI) - 80;
        let offsetX2 = cos(angle + PI) - 85;
        let offsetY2 = sin(angle + PI) + 80;

        if (!rotating) {
            offsetX1 = 0;
            offsetY1 = 0;
            offsetX2 = 0;
        } else {
            stroke('white');
            strokeWeight(3);
            noFill();
            rect(offsetX1, offsetY1, 60, 100, 50);
            rect(offsetX2, offsetY2, 60, 100, 50);
        }

        pop();

        if (rotating) {
            requestAnimationFrame(animate);
        } else {
            thirdAnimation();
        }
    }
    animate();
}

function thirdAnimation() {
    function animate() {
        if (displayTimer < 50) {
            background(65, 105, 225);
            noStroke();
            fill('white');
            textFont('Chewy', 45);
            var msg = 'Zoom Out';
            text(msg, 550, 120);

            // 绘制放大的矩形并进行缩放
            push();
            fill(0, 0, 205);

            translate(x + 1550, 380); // 将原点移动到矩形中心
            rotate(angle); // 继续旋转
            scale(s); // 进行缩放
            rect(0, 0, 200, 200, 20); // 绘制矩形

            stroke('white');
            strokeWeight(5);
            noFill();
            circle(-80, -80, 80, 80);
            circle(80, 80, 80, 80);

            pop();

            // 增加计时器
            displayTimer++;
        } else {
            // 开始缩小动作
            s = lerp(s, 1.5, 0.05); // 缩小

            // 重新绘制背景和文本
            background(65, 105, 225);
            noStroke();
            fill('white');
            textFont('Chewy', 45);
            var msg = 'Zoom Out';
            text(msg, 550, 120);

            // 绘制放大的矩形并进行缩放
            push();
            fill(0, 0, 205);

            translate(x + 1550, 380); // 将原点移动到矩形中心
            rotate(angle); // 继续旋转
            scale(s); // 进行缩放
            rect(0, 0, 200, 200, 20); // 绘制矩形

            pop();

            if (s <= 1.51) {
                lastAnimation();
                return; // 停止当前动画
            }
        }

        requestAnimationFrame(animate); // 继续动画循环
    }
    animate();
}

function lastAnimation() {
    let circleSize = 150;
    let circleExpanding = false;

    function animate() {
        if (!circleExpanding) {
            // 缩小圆圈
            circleSize = lerp(circleSize, 100, 0.1);
            if (circleSize <= 105) {
                circleExpanding = true;
            }
        } else {
            // 扩大圆圈
            circleSize = lerp(circleSize, 150, 0.1);
            if (circleSize >= 145) {
                logoAnimation();
                return; // 停止当前动画
            }
        }

        background(65, 105, 225);
        noStroke();
        fill('white');
        textFont('Chewy', 45);
        var msg = 'Double Tap';
        text(msg, 550, 120);

        push();
        fill(0, 0, 205);

        translate(x + 1550, 380);
        rotate(angle);
        scale(s);
        rect(0, 0, 200, 200, 20);

        stroke('white');
        strokeWeight(5);
        noFill();
        circle(0, 0, circleSize, circleSize);

        if (circleExpanding) {
            circle(0, 0, 100, 100);
        }

        pop();

        requestAnimationFrame(animate); // 继续动画循环
    }
    animate();
}

function logoAnimation() {
    let timer = 0;
    let textAlpha = 0;
    let imgAlpha = 0;

    function animate() {
        background(65, 105, 225);

        // 动画文本淡入
        fill(255, 255, 255, textAlpha);
        textFont('Chewy', 45);
        var msg = 'Crescendo International College';
        text(msg, 370, 120);

        // 动画图像淡入
        tint(255, imgAlpha);
        image(img, 440, 200, 400, 400);

        // 增加透明度
        if (textAlpha < 255) {
            textAlpha += 3;
        }
        if (imgAlpha < 255) {
            imgAlpha += 3;
        }

        timer++;
        if (timer > 100) {
            resetAnimation();
            return;
        }

        requestAnimationFrame(animate); // 继续动画循环
    }
    animate();
}

function resetAnimation() {
    // 重置所有变量
    x = 0;
    rectX = 520;
    a = 0.0;
    s = 1.0;
    frame = 0;

    moveLeft = 0;
    moveRight = 0;
    zoomingOut = true;
    tapDelay = 5;

    angle = 0.0;
    rotating = false;

    displayTimer = 0;

    // 重新启动动画
    loop();
    draw();
}

function preload() {
    img = loadImage("logo.png");
}

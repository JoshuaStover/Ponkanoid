var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// Global ball and paddle declarations, used in object creation to follow
    var ballRadius = 10;
    var paddleHeight = 120;
    var paddleWidth = 18;

    // control variables, w/s for player 1, up arrow/down arrow for player 2. up and down inputs ignored if playing single player
	var wPressed = false;
	var sPressed = false;
    var upPressed = false;
    var downPressed = false;

	//brick declarations, sets brick height, brick width, location offsets, and the size of the array
    var brickRows = 10;
    var brickColumns = 5;
    var brickWidth = 40;
    var brickHeight = 68;
    var brickOffsetTop = 2;
    var brickPadding = 4;
    var brickOffsetLeft = (canvas.width / 2) - ((2.5 * brickWidth) + (3 * brickPadding));

	// initialize array of bricks
    var bricks = [];
    for(var col = 0; col < brickColumns; col++) {
        bricks[col] = [];
        for (var row = 0; row < brickRows; row++) {
            bricks[col][row] = { xPos: 0, yPos: 0, active: true};
        }
    }

	// array containing colors the bricks can be randomly assigned on a per column basis. column 1 color = column 5 color, column 2 color = column 4 color.
	var colors = ["#117711", "#FFBB33", "#DDDDDD", "#33DDDD", "#1111FF"];

	// create temporary color array, assign 3 unique values from the brickColors array.
	var tempColors = [];

    tempColors[0] = colors[Math.floor(Math.random() * 5)];
    tempColors[1] = colors[Math.floor(Math.random() * 5)];
    tempColors[2] = colors[Math.floor(Math.random() * 5)];


	while (tempColors[0] == tempColors[1]){
		tempColors[1] = colors[Math.floor(Math.random() * 6)];
	}

	while ((tempColors[2] == tempColors[1]) || (tempColors[2] == tempColors[0])) {
		tempColors[2] = colors[Math.floor(Math.random() * 6)];
	}

	// initialize colors and point values of bricks on a per column basis
	for (var row = 0; row < brickRows; row++){
		bricks[0][row].color = tempColors[0];
		bricks[0][row].pointValue = 100;
		bricks[1][row].color = tempColors[1];
		bricks[1][row].pointValue = 200;
		bricks[2][row].color = tempColors[2];
		bricks[2][row].pointValue = 300;
		bricks[3][row].color = tempColors[1];
		bricks[3][row].pointValue = 200;
		bricks[4][row].color = tempColors[0];
		bricks[4][row].pointValue = 100;
	}

    // player 1 object
    var player1 = {
        score : 0,
        color : "#33FF77",
        lives : 3
    };

    var player2 = {
        score : 0,
        color : "#DD33DD",
        lives : 3
    };

    // ball 1 object
    var ball1 = {
        xPos : canvas.width / 3,
        yPos : (canvas.height / 2) - (brickHeight / 2),
        deltaX : -3.0,
        deltaY : 0,
        radius : ballRadius,
        color : player1.color
    };

    // ball 2 object
    var ball2 = {
        xPos : (2 * canvas.width) / 3,
        yPos : (canvas.height / 2) + (brickHeight / 2),
        deltaX : 3.0,
        deltaY : 0,
        radius : ballRadius,
        color : player2.color
    };

    // paddle 1 object
    var pad1 = {
        xPos : 20,
        yPos : (canvas.height - paddleHeight) / 2,
        height : paddleHeight,
        width : paddleWidth,
        color : player1.color,
        player : 1
    };

    // paddle 2 object
    var pad2 = {
        xPos : canvas.width - paddleWidth - 20,
        yPos : (canvas.height - paddleHeight) / 2,
        height : paddleHeight,
        width : paddleWidth,
        color : player2.color,
        player : 2
    };

    // draws the ball object it is passed
    function DrawBall(ball){
        ctx.beginPath();
        ctx.arc(ball.xPos, ball.yPos, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
        ball.xPos += ball.deltaX;
        ball.yPos += ball.deltaY;
    }

    // draws the paddle object it is passed
    function DrawPad(pad) {
        ctx.beginPath();
        ctx.rect(pad.xPos, pad.yPos, pad.width, pad.height);
        ctx.fillStyle = pad.color;
        ctx.fill();
        ctx.closePath();
    }

    // Draw the array of bricks to the canvas
    function DrawBricks() {
        for (var col = 0; col < brickColumns; col++) {
            for (var row = 0; row < brickRows; row++) {
                if (bricks[col][row].active == true) {
                    var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[col][row].xPos = brickX;
                    bricks[col][row].yPos = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = bricks[col][row].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // takes a palyer object and draws their current lives to the screen
    function DrawLives(player) {
        var livesBallRadius = 6;
        if (player.color == "#33FF77") {
            for (var i = 0; i < player.lives; i++) {
                ctx.beginPath();
                ctx.arc((i + 1) * (4 * livesBallRadius), canvas.height - (2 * livesBallRadius), livesBallRadius, 0, Math.PI*2);
                ctx.fillStyle = player.color;
                ctx.fill();
                ctx.closePath();
            }
        }
        else if (player.color == "#DD33DD") {
            for (var i = 0; i < player.lives; i++) {
                ctx.beginPath();
                ctx.arc(canvas.width - ((i + 1) * (4 * livesBallRadius)), canvas.height - (2 * livesBallRadius), livesBallRadius, 0, Math.PI*2);
                ctx.fillStyle = player.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    // tracks when keys are pressed, w/s for p1, up/down for p2
    function KeyDown(pressed) {
        if (pressed.key == "Up" || pressed.key == "ArrowUp") {
            upPressed = true;
        }
        else if (pressed.key == "Down" || pressed.key == "ArrowDown") {
            downPressed = true;
        }
        else if (pressed.key == 'w' || pressed.key == 'W') {
            wPressed = true;
        }
        else if (pressed.key == 's' || pressed.key == 'S') {
            sPressed = true;
        }
    }

    // tracks when keys are released, w/s for p1, up/down for p2
    function KeyUp(released) {
        if(released.key == "Up" || released.key == "ArrowUp") {
            upPressed = false;
        }
        else if(released.key == "Down" || released.key == "ArrowDown") {
            downPressed = false;
        }
        else if (released.key == 'w' || released.key == 'W') {
            wPressed = false;
        }
        else if (released.key == 's' || released.key == 'S') {
            sPressed = false;
        }
    }

    // Probably a better way to do this, maybe look again when you've had more than 3 hours of sleep
	function BrickCollision(ball, player) {
		for (var col = 0; col < brickColumns; col++) {
			for (var row = 0; row < brickRows; row++) {
				var currentBrick = bricks[col][row];
				if (currentBrick.active == true && (((ball.xPos + ball.radius >= currentBrick.xPos) && (ball.xPos - ball.radius <= currentBrick.xPos + brickWidth)) && (ball.yPos >= currentBrick.yPos && ball.yPos <= currentBrick.yPos + brickHeight))) {
					ball.deltaX = -ball.deltaX;
                    player.score += currentBrick.pointValue;
					currentBrick.active = false;
				}
                else if (currentBrick.active == true && ((ball.yPos + ball.radius >= currentBrick.yPos && ball.yPos - ball.radius <= currentBrick.yPos + brickHeight) && ((ball.xPos >= currentBrick.xPos) && (ball.xPos <= currentBrick.xPos + brickWidth)))) {
                    ball.deltaY = -ball.deltaY;
                    player.score += currentBrick.pointValue;
                    currentBrick.active = false;
                }
            }
        }
    }


    // calculates the angle change to be applied a ball object coming into contact with a paddle object
	function AngleDelta(ball, pad){
		return ((ball.yPos - (pad.yPos + (pad.height / 2))) / (pad.height / 2)) * 2.5;
	}

    // Checks for collision of a ball object with a paddle object, reverses ball's x velocity and adds 2% to its speed
	function PaddleCollision(ball, pad) {
        if (pad.player == 1) {
            if ((ball.xPos + ball.deltaX <= pad.xPos + pad.width) && (ball.yPos >= pad.yPos && ball.yPos <= pad.yPos + pad.height)){
                var delta = AngleDelta(ball, pad);
                if (ball.deltaY + delta <= 4 && ball.deltaY + delta >= -4){
                    ball.deltaY += delta;
                }
                else if (ball.deltaY + delta > 4){
                    ball.deltaY = 4;
                }
                else if (ball.deltaY + delta < -4){
                    ball.deltaY = -4;
                }
                ball.deltaX = -ball.deltaX - (ball.deltaX * 0.02);
            }
        }
        if (pad.player == 2) {
            if ((ball.xPos + ball.deltaX >= pad.xPos) && (ball.yPos >= pad.yPos && ball.yPos <= pad.yPos + pad.height)) {
                var delta = AngleDelta(ball, pad);
                if (ball.deltaY + delta <= 4 && ball.deltaY + delta >= -4){
                    ball.deltaY += delta;
                }
                else if (ball.deltaY + delta > 4){
                    ball.deltaY = 4;
                }
                else if (ball.deltaY + delta < -4){
                    ball.deltaY = -4;
                }
                ball.deltaX = -ball.deltaX - (ball.deltaX * 0.02);
            }
        }
	}

    // checks for collision of a ball object with the vertical or horizontal boundaries of the game, sends ball in opposit direction of boundary it touched without changing velocity
    function WallCollision(ball) {
        if (ball.xPos + ball.deltaX > canvas.width - ball.radius || ball.xPos + ball.deltaX < ball.radius){
            ball.deltaX = -ball.deltaX;
        }
        if (ball.yPos + ball.deltaY < ball.radius || ball.yPos + ball.deltaY >= canvas.height - ball.radius){
            ball.deltaY = -ball.deltaY;
        }
    }


    function LivesAndGoals(p1, p2, b1, b2) {
        if (b1.xPos + (b1.radius + 3) + b1.deltaX >= canvas.width) {
            p1.score += 1000;
        }
        if (b2.xPos - (b2.radius + 3) + b2.deltaX <= 0) {
            p2.score += 1000;
        }
        if (b1.xPos - (b1.radius + 3) + b1.deltaX <= 0) {
            p1.lives--;
        }
        if (b2.xPos + (b2.radius + 3) + b2.deltaX >= canvas.width) {
            p2.lives--;
        }
    }

    // draws player 1's score
	function DrawScoreP1() {
		ctx.font = "16px Arial";
		ctx.fillStyle = player1.color;
		ctx.fillText(" P1 Score: " + player1.score, (brickWidth / 3), 20);
	}

    // draws player 2's score
    function DrawScoreP2() {
        ctx.font = "16px Arial";
		ctx.fillStyle = player2.color;
		ctx.fillText(" P2 Score: " + player2.score, canvas.width - (3 * brickWidth), 20);
    }

    // handles input and movement for player 1
    function MovementP1() {
        if (sPressed == true && pad1.yPos < canvas.height - pad1.height){
            pad1.yPos += 6;
        }
        if (wPressed == true && pad1.yPos > 0){
            pad1.yPos -= 6;
        }
    }

    // handles input and movement for player 2
    function MovementP2() {
        if (downPressed == true && pad2.yPos < canvas.height - pad2.height){
            pad2.yPos += 6;
        }
        if (upPressed == true && pad2.yPos > 0){
            pad2.yPos -= 6;
        }
    }

    // helper function, collection of all functions that affect player 1
    function RoutineP1() {
        DrawBall(ball1);
        DrawPad(pad1);
        BrickCollision(ball1, player1);
        PaddleCollision(ball1, pad1);
        PaddleCollision(ball2, pad1);
        WallCollision(ball1);
        MovementP1();
        DrawScoreP1();
        DrawLives(player1);
    }

    // helper function, collection of all functions that affect player 1
    function RoutineP2() {
        DrawBall(ball2);
        DrawPad(pad2);
        BrickCollision(ball2, player2);
        PaddleCollision(ball2, pad2);
        PaddleCollision(ball1, pad2);
        WallCollision(ball2);
        MovementP2();
        DrawScoreP2();
        DrawLives(player2);
    }

    // gameplay loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawBricks();
        LivesAndGoals(player1, player2, ball1, ball2);
        RoutineP1();
        RoutineP2();
        if ((player1.score >= 10000) || (player2.lives == 0)) {
            alert("Player 1 wins!");
            document.location.reload();
        }
        if ((player2.score >= 10000) || (player1.lives == 0)) {
            alert("Player 2 wins!");
            document.location.reload();
        }
        requestAnimationFrame(draw);
    }

    document.addEventListener("keydown", KeyDown, false);
    document.addEventListener("keyup", KeyUp, false);
	draw();

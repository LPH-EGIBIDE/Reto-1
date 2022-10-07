const firstWidth = document.getElementById("contenido").clientWidth;
const firstHeight = document.getElementById("contenido").clientHeight;
var sizesParsed = false;
var circles = [];
var timeline = [];
var robot = {
    x: 0,
    y: 0,
    color: "red",
    hidden: false,
    movingX: false,
    movingY: false
}
var resizeTimer;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Get the scale to fit the screen
const firstScale = Math.min(firstWidth, firstHeight) / 314;
var scale = firstScale;
var xQuant = 5;
var yQuant = 5;
//const firstScale = Math.min(firstWidth, firstHeight) /314;
function createCanvas(scale) {
    // Get the canvas element and set it to max width and height with some padding
    canvas.width = 314;
    canvas.height = 314;
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
    //Draw a rectangle of 314.4 at center of canvas
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Draw a 5x5 grid of circles with a radius of 30px at the center of the canvas
    for (var i = 0; i < xQuant; i++) {
        for (var j = 0; j < yQuant; j++) {
            ctx.beginPath();
            ctx.lineWidth = 2 * scale;
            ctx.arc(canvas.width / 2 + (i - 2) * (60) * scale, canvas.height / 2 + (j - 2) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

//Function to paint a robot and simulate the movement

function makeRobotPath(x, y) {
    if (robot.movingX || robot.movingY) {
        console.error("Robot is already moving" + x + " " + y);
        return;
    }
    robot.movingX = true;
    robot.movingY = true;
    //Go to the x position from x = 0 to x = x
    var xInterval = setInterval(function () {
        //Go to x by steps of 1mm every 50ms
        if (robot.x < x) {
            robot.x++;
        } else if (robot.x > x) {
            robot.x--;
        } else {
            clearInterval(xInterval);
            robot.movingX = false
        }
        positionRobot(robot.x, robot.y, true);
    }, 30);
    //When x is reached, go to y position from y = 0 to y = y
    var yInterval = setInterval(function () {
        //Go to y by steps of 1mm every 50ms
        if (robot.y < y) {
            robot.y++;
        } else if (robot.y > y) {
            robot.y--;
        } else {
            clearInterval(yInterval);
            robot.movingY = false;
        }
        positionRobot(robot.x, robot.y, true);
    }, 30);

}

function setRobotVisibilty(visible) {
    robot.hidden = !visible;
    redrawCanvas();
}

function setRobot(x, y) {
    robot.x = x;
    robot.y = y;
    positionRobot(x, y, true);
}

function positionRobot(xmm, ymm, redraw) {
    //Draw a image of a robot on the position x,y in mm
    //First check if the robot is hidden
    if (robot.hidden) {
        return;
    }

    //Remove the robot from the canvas
    if (redraw)
        redrawCanvas();
    //Transform the x,y that as if the real board is 180mm to real px
    var canvas = document.getElementById("canvas");
    let ctxl = canvas.getContext("2d");
    var px = {
        x: Math.ceil((xmm / 180) * canvas.width),
        y: Math.ceil((ymm / 180) * canvas.height)
    };


    //Draw the robot
    var robotPath = new Path2D(`M281.364,262.757c3.239-0.83,5.636-3.759,5.636-7.257v-32c0-4.142-3.357-7.5-7.5-7.5h-2.753l17.185-28.642
	c0.029-0.048,0.051-0.098,0.078-0.146c0.073-0.128,0.143-0.259,0.209-0.392c0.045-0.091,0.089-0.183,0.13-0.276
	c0.053-0.119,0.102-0.241,0.149-0.363c0.042-0.109,0.083-0.219,0.12-0.33c0.034-0.103,0.063-0.208,0.093-0.313
	c0.037-0.131,0.074-0.261,0.103-0.394c0.019-0.086,0.034-0.173,0.05-0.261c0.028-0.15,0.056-0.3,0.074-0.451
	c0.002-0.019,0.007-0.037,0.009-0.057L310.169,55h9.331c4.143,0,7.5-3.358,7.5-7.5V15h16.5c4.143,0,7.5-3.358,7.5-7.5
	S347.643,0,343.5,0h-224c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5,7.5,7.5H136v32.5c0,4.142,3.357,7.5,7.5,7.5h9.331l15.221,129.376
	c0.002,0.02,0.007,0.038,0.009,0.057c0.019,0.15,0.046,0.3,0.074,0.451c0.016,0.087,0.031,0.175,0.05,0.261
	c0.03,0.132,0.066,0.263,0.103,0.394c0.03,0.105,0.059,0.21,0.093,0.313c0.037,0.111,0.078,0.22,0.12,0.33
	c0.047,0.123,0.096,0.244,0.149,0.363c0.041,0.093,0.085,0.185,0.13,0.276c0.066,0.133,0.136,0.264,0.209,0.392
	c0.028,0.048,0.05,0.099,0.078,0.146L186.253,216H183.5c-4.143,0-7.5,3.358-7.5,7.5v32c0,3.498,2.397,6.427,5.636,7.257
	l-67.44,67.44c-1.772,1.773-2.542,4.315-2.051,6.774l24,120c0.701,3.506,3.779,6.029,7.354,6.029h56c4.143,0,7.5-3.358,7.5-7.5
	V352.327l24.5-29.167l24.5,29.165V455.5c0,4.142,3.357,7.5,7.5,7.5h56c3.575,0,6.653-2.523,7.354-6.029l24-120
	c0.491-2.459-0.278-5.001-2.051-6.774L281.364,262.757z M231.5,248H223v-17h17v17H231.5z M199.5,248H191v-17h8.488
	c0.007,0,0.013,0.001,0.019,0.001c0.006,0,0.012-0.001,0.018-0.001H208v17H199.5z M255,231h8.475c0.006,0,0.012,0.001,0.018,0.001
	c0.006,0,0.013-0.001,0.019-0.001H272v17h-8.5H255V231z M171.698,87H208v24.5c0,12.958,10.542,23.5,23.5,23.5s23.5-10.542,23.5-23.5
	V87h36.302l-10.471,89h-98.662L171.698,87z M240,111.5c0,4.687-3.813,8.5-8.5,8.5s-8.5-3.813-8.5-8.5V55h17V111.5z M293.066,72H255
	V55h40.066L293.066,72z M151,15h161v25H151V15z M208,55v17h-38.066l-2-17H208z M188.747,191h85.506l-15,25h-55.506L188.747,191z
	 M168,351.5V448h-18.352l-22.007-110.035L202.606,263H224v45.768L194.404,344H175.5C171.357,344,168,347.358,168,351.5z M192,448h-9
	v-89h9V448z M271,359h9v89h-9V359z M313.352,448H295v-96.5c0-4.142-3.357-7.5-7.5-7.5h-18.903L239,308.768V263h21.394l74.965,74.965
	L313.352,448z`);
    //Set the position of the robot and center the image
    console.log("Setting position to" + px.x + "," + px.y);
    //Calculate the robot height

    ctxl.translate((px.x - (canvas.width * 0.053)), (px.y - (canvas.height * 0.053)));
    //Draw a 5x5 dot at the robot's position
    //ctx.fillRect(-2.5, -2.5, 5, 5);
    //Paint it black
    ctxl.fillStyle = "black";
    //Resize the robot to 20px
    ctxl.scale(0.08 * scale, 0.08 * scale);
    //set stroke color to black 
    ctxl.strokeStyle = "red";
    //set stroke width to 2
    ctxl.lineWidth = 10;
    ctxl.stroke(robotPath);
    //Restore the position
    ctxl.setTransform(1, 0, 0, 1, 0, 0);
    ctxl.lineWidth = 2 * scale;
    ctxl.strokeStyle = "black";
}

function setLetterCenterCircle(x, y, letter) {
    var cirX = (canvas.width / 2 + (x - 3) * (60) * scale);
    var cirY = (canvas.height / 2 + (y - 3) * (60) * scale);
    var cirR = (28.5) * scale;
    //Draw the letter
    ctx.font = "bold " + (cirR) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(letter, cirX, cirY);

}

function drawImageOnCircle(x, y, imagePath) {
    var cirX = (canvas.width / 2 + (x - 3) * (60) * scale);
    var cirY = (canvas.height / 2 + (y - 3) * (60) * scale);
    var cirR = (28.5) * scale;
    //Draw image centered on circle and resize it to fit the circle
    var img = new Image();
    img.src = imagePath;
    img.onload = function () {
        //Draw the image starting from 80% of size and increase it until it fits the circle by steps of 2% every 10ms
        var imgSize = cirR * 0.8;
        var imgInterval = setInterval(function () {
            ctx.drawImage(img, cirX - imgSize / 2, cirY - imgSize / 2, imgSize, imgSize);
            imgSize += cirR * 0.02;
            if (imgSize >= cirR * 2) {
                clearInterval(imgInterval);
            }
        }, 3);


    }




}

function generateStateCircle(x, y, color) {
    //generate a 28.5 radius circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2 * scale;
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
    ctx.stroke();

    //Generate a circle of 20 radius inside the 28.5 radius circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (20) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2 * scale;
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (20) * scale, 0, 2 * Math.PI);
    ctx.stroke();

    //Generate a circle of 12 radius inside the 20 radius circle and fill it with white
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (12) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2 * scale;
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (12) * scale, 0, 2 * Math.PI);
    ctx.stroke();

}





function fillCircle(x, y, color) {
    ctx.beginPath();
    console.log("x: " + (canvas.width / 2 + (x - 3) * (60) * scale) + " y: " + (canvas.height / 2 + (y - 3) * (60) * scale));
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28, 5) * scale, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2 * scale;
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
    ctx.stroke();
    //Save the colored circle into a array of objects only if it is not already there
    var circleFilter = circles.filter(circle => circle.x == x && circle.y == y);
    if (circleFilter.length == 0) {
        circles.push({
            x: x,
            y: y,
            color: color
        });
    } else {
        //If the circle is already there, change its color and update the array
        // check if color is the same
        if (circleFilter[0].color != color) {
            circleFilter[0].color = color;
            circles = circles.filter(circle => circle.x != x || circle.y != y);
            circles.push(circleFilter[0]);
            console.log("Updated circle" + circleFilter[0].x + " " + circleFilter[0].y + " " + circleFilter[0].color);
        }
    }
    generateStateCircle(x, y, color);
    //setLetterCenterCircle(x,y,letters[Math.random() * letters.length | 0]);
    positionRobot(robot.x, robot.y, false)

    updateChart1();
}

function unFillCircle(x, y) {
    //Get the circle from the array of objects and remove it
    var circleFilter = circles.filter(circle => circle.x == x && circle.y == y);
    if (circleFilter.length > 0) {
        circles.splice(circles.indexOf(circleFilter[0]), 1);
    }
    //Redraw the canvas
    ctx.beginPath();
    //Clear the circle
    ctx.fillStyle = "grey";
    ctx.fillRect(canvas.width / 2 + (x - 3) * (60) * scale - (30) * scale, canvas.height / 2 + (y - 3) * (60) * scale - (30) * scale, (60) * scale, (60) * scale);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
    ctx.stroke();

    //Remove the circle from the array of objects
    circles = circles.filter(circle => circle.x != x || circle.y != y);
    positionRobot(robot.x, robot.y, false)
}

//paint a pixel at x,y with color

function getCircleClicked(x, y) {
    var cirX;
    var cirY;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            cirX = (canvas.width / 2 + (i - 2) * (60) * scale);
            cirY = (canvas.height / 2 + (j - 2) * (60) * scale);
            if ((x + (29) * scale > cirX && x - (29) * scale < cirX) && (y + (29) * scale > cirY && y - (29) * scale < cirY)) {
                return [i + 1, j + 1, cirX, cirY];
            }
        }
    }
}


function updateBoard(newBoard) {
    //Update the board with the new board as if 0 is empty, 1 is white and 2 is black
    //Save the new additions to timeLine
    //New board array is from index 0 to 24
    var newCircles = [];
    for (var i = 0; i < 25; i++) {
        if (newBoard[i] == 1) {
            newCircles.push({ x: i % 5 + 1, y: Math.floor(i / 5) + 1, color: "white" });
        } else if (newBoard[i] == 2) {
            newCircles.push({ x: i % 5 + 1, y: Math.floor(i / 5) + 1, color: "black" });
        }
    }
    //Get additions
    for (var i = 0; i < newCircles.length; i++) {
        var circleFilter = circles.filter(circle => circle.x == newCircles[i].x && circle.y == newCircles[i].y);
        if (circleFilter.length == 0) {
            //Add to timeline
            addCircleToTimeline(newCircles[i]);
        }
    }
    //Set the new board
    circles = newCircles;
    //Redraw the canvas
    redrawCanvas();
}


function getXyFromMouse(event) {
    var rect = canvas.getBoundingClientRect();
    //Get the margins between canvas and div  contenido

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}



//Timeline functions
function convertTable(table) {
    // Convert the array with indexes from 0 to 24 to circle elements
    var tableCircles = [];
    for (var i = 0; i < table.length; i++) {
        var circle = {
            x: undefined,
            y: undefined,
            color: undefined
        };
        circle.x = i % 5;
        circle.y = Math.floor(i / 5);
        switch (table[i]) {
            case 0:
                break;
            case 1:
                circle.color = "white";
                tableCircles.push(circle);
                break;
            case 2:
                circle.color = "black";
                tableCircles.push(circle);
                break;
        }
    }
    return tableCircles;
}

function addCircleToTimeline(circle) {
    var time = new Date();
    time = time.getTime();
    circle.time = time;
    timeline.push(circle);
}


canvas.addEventListener("click", function (event) {
    if (!sizesParsed) {
        sizesParsed = true;
        redrawCanvas();
    }
    var xy = getXyFromMouse(event);
    //Calculate the m from xy as if the canvas was 180x180
    var mm = {
        x: Math.ceil(xy.x * 180 / canvas.width),
        y: Math.ceil(xy.y * 180 / canvas.height)
    };



    console.log("x: " + xy.x + " y: " + xy.y);
    console.log("mmX: " + mm.x + " mmY: " + mm.y);
    var circle = getCircleClicked(xy.x, xy.y);
    console.log("circleX: " + circle[0] + " circleY: " + circle[1]);
    //If circle is filled unfill it, else fill it
    //var 
    var mmCir = {
        x: Math.ceil(circle[2] * 180 / canvas.width),
        y: Math.ceil(circle[3] * 180 / canvas.height)
    };
    //simulateRobot(circle, mmCir);
    //get the index from 0 to 24 based on a 5x5 grid
    var index = (circle[0] - 1) + (circle[1] - 1) * 5;
    if (!auto) {
        if (!simulated) {
            if (!robot.movingX && !robot.movingY && parseInt(globalData.programa) < 2)
                //Sweetalert to ask the color of the circle
                Swal.fire({
                    title: 'Elige el color de la ficha a colocar',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: `Blanca`,
                    denyButtonText: `Negra`,
                    cancelButtonText: `Vacio`
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        setCircleColor(index, 1);
                    } else if (result.isDenied) {
                        setCircleColor(index, 2);
                    }
                })
        } else
            simulateRobot(circle, mmCir);

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No puedes mover las fichas en modo automatico',
            timer: 500
        })
    }
    //updateChart1();

});

function randomFill() {
    var i = Math.random() * 5 | 0;
    var j = Math.random() * 5 | 0;
    var color = "rgb(" + (Math.random() * 255 | 0) + "," + (Math.random() * 255 | 0) + "," + (Math.random() * 255 | 0) + ")";
    var circleFilter = circles.filter(circleF => circleF.x == i + 1 && circleF.y == j + 1);
    if (circleFilter.length == 0) {
        fillCircle(i + 1, j + 1, color);
    } else {
        unFillCircle(i + 1, j + 1);
    }
}

function redrawCanvas() {
    //get the function that invokes the function
    var caller = arguments.callee.caller.name;
    console.log("Redrawing canvas from " + caller);
    //Get the new width and height of the window
    var marginLeftRight = parseInt(window.getComputedStyle(canvas).marginLeft) * 2;
    var marginTopBottom = parseInt(window.getComputedStyle(canvas).marginTop) * 2;
    const newWidth = document.getElementById("contenido").clientWidth - marginLeftRight;
    const newHeight = document.getElementById("contenido").clientHeight - marginTopBottom;
    //Get the new scale to fit the screen
    scale = Math.min(newWidth, newHeight) / 314;
    //Create the canvas with the new scale
    createCanvas(scale);
    //Paint the circles that were already colored
    for (var i = 0; i < circles.length; i++) {
        console.log(circles[i].x + " " + circles[i].y + " " + circles[[i]].color);
        if (circles[i].color != "grey") {
            console.log("Redrawing circle " + circles[i].x + " " + circles[i].y + " " + circles[i].color);
            fillCircle(circles[i].x, circles[i].y, circles[i].color);
        } else {
            unFillCircle(circles[i].x, circles[i].y);
        }
    }
}


function simulateRobot(circle, mmCir) {
    var x = circle[0];
    var y = circle[1];
    //return if robot is moving
    if (robot.movingX || robot.movingY) {
        return;
    }
    //Unhide the robot
    robot.hidden = false;
    //If the robot is not already in the circle, move it
    if (robot.x != x || robot.y != y) {
        makeRobotPath(mmCir.x, mmCir.y);
        //Calculate time to simulate the robot moving if every step takes 30ms
        var steps = Math.max(Math.abs(robot.x - mmCir.x), Math.abs(robot.y - mmCir.y));
        console.log(circle[2] + " " + circle[3]);
        var time = steps * 30;
        var circleFilter = circles.filter(circleF => circleF.x == circle[0] && circleF.y == circle[1]);

        //Prevent clicking while waiting to set choco
        canvas.style.pointerEvents = "none";
        setTimeout(function () {
            if (circleFilter.length == 0) {
                fillCircle(circle[0], circle[1], "white");
            } else {
                if (circleFilter[0].color == "white") {
                    fillCircle(circle[0], circle[1], "black");
                } else {
                    unFillCircle(circle[0], circle[1]);
                }
            }
        }, time + 500);

        //Move the robot back to 0,0

        setTimeout(function () {
            makeRobotPath(0, 0)
            canvas.style.pointerEvents = "auto";
        }, time + 800);

    }
}

window.addEventListener('resize', function (event) {

    //Create a timer to avoid calling the function too many times
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redrawCanvas, 250);

}, true);
createCanvas(firstScale);

//Chart.js data pending to be moved to a separate file

//Doughnut chart for total quantity of chocolates
var chart1Ctx = document.getElementById('chart1').getContext('2d');
var chart1 = new Chart(chart1Ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Blanco',
            'Negro'
        ],
        datasets: [{
            label: 'Cantidad de chocopollas',
            data: [
                circles.filter(circleF => circleF.color == "white").length,
                circles.filter(circleF => circleF.color == "black").length
            ],
            backgroundColor: [
                'rgb(175, 175, 175)',
                'rgb(45, 45, 45)'
            ],
            hoverOffset: 4
        }]
    },
    options: {

        // Esto está al revés, cuanto más grande el ancho, más pequeño el gráfico xd
        responsive: false,
        maintainAspectRatio: false
    }
});

function updateChart1() {
    chart1.data.datasets[0].data = [
        circles.filter(circleF => circleF.color == "white").length,
        circles.filter(circleF => circleF.color == "black").length
    ];
    chart1.update();
}

// function to get chocolate quantity per minute from timeline

//Line chart for chocolates per minute
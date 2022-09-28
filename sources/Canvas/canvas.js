const firstWidth = window.innerWidth;
        const firstHeight = window.innerHeight;
        var circles = [];
        var resizeTimer;

        //Get the scale to fit the screen
        const firstScale = Math.min(firstWidth, firstHeight) /314;
        var scale = firstScale;
        //const firstScale = Math.min(firstWidth, firstHeight) /314;
        function createCanvas(scale) {
            // Get the canvas element and set it to max width and height with some padding
            var canvas = document.getElementById("canvas");
            canvas.width = 314;
            canvas.height = 314;
            canvas.width = canvas.width * scale;
            canvas.height = canvas.height * scale;
            var ctx = canvas.getContext("2d");
            //Draw a rectangle of 314.4 at center of canvas
            ctx.fillStyle = "grey";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //Draw a 5x5 grid of circles with a radius of 30px at the center of the canvas
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 5; j++) {
                    ctx.beginPath();
                    ctx.lineWidth = 2*scale;
                    ctx.arc(canvas.width / 2 + (i - 2) * (60) * scale, canvas.height / 2 + (j - 2) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }

        function setLetterCenterCircle(x,y,letter){
            var cirX  = (canvas.width / 2 + (x - 3) * (60) * scale);
            var cirY = (canvas.height / 2 + (y - 3) * (60) * scale);
            var cirR = (28.5) * scale;
            //Draw the letter
            var ctx = canvas.getContext("2d");
            ctx.font = "bold " + (cirR) + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(letter, cirX, cirY);

        }

        function drawImageOnCircle(x,y,imagePath){
            var cirX  = (canvas.width / 2 + (x - 3) * (60) * scale);
            var cirY = (canvas.height / 2 + (y - 3) * (60) * scale);
            var cirR = (28.5) * scale;
            //Draw image centered on circle and resize it to fit the circle
            var ctx = canvas.getContext("2d");
            var img = new Image();
            img.src = imagePath;
            img.onload = function(){
                //Draw the image starting from 80% of size and increase it until it fits the circle by steps of 2% every 10ms
                var imgSize = cirR*0.8;
                var imgInterval = setInterval(function(){
                    ctx.drawImage(img, cirX - imgSize/2, cirY - imgSize/2, imgSize, imgSize);
                    imgSize += cirR*0.02;
                    if(imgSize >= cirR*2){
                        clearInterval(imgInterval);
                    }
                },3);

                
            }


            

        }





        function fillCircle(x, y, color) {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            console.log("x: " + (canvas.width / 2 + (x - 3) * (60) * scale) + " y: " + (canvas.height / 2 + (y - 3) * (60) * scale));
            ctx.arc(canvas.width / 2 + (x - 3) * (60) * scale, canvas.height / 2 + (y - 3) * (60) * scale, (28.5) * scale, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 2*scale;
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
                //If the circle is already there, change its color
                circleFilter[0].color = color;
            }
            drawImageOnCircle(x,y,"blanco.png");
            //setLetterCenterCircle(x,y,letters[Math.random() * letters.length | 0]);
        }

        function unFillCircle(x, y) {
            //Get the circle from the array of objects and remove it
            var circleFilter = circles.filter(circle => circle.x == x && circle.y == y);
            if (circleFilter.length > 0) {
                circles.splice(circles.indexOf(circleFilter[0]), 1);
            }
            //Redraw the canvas
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
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
        }   

        //paint a pixel at x,y with color

        function getCircleClicked(x, y) {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var cirX;
            var cirY;
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 5; j++) {
                    cirX = (canvas.width / 2 + (i - 2) * (60) * scale);
                    cirY = (canvas.height / 2 + (j - 2) * (60) * scale);
                    if ((x + (29) * scale > cirX && x - (29) * scale < cirX) && (y + (29) * scale > cirY && y - (29) * scale < cirY)) {
                        return [i + 1, j + 1];
                    }
                }
            }
        }





        function getXyFromMouse(canvas, event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        canvas.addEventListener("click", function (event) {
            var xy = getXyFromMouse(canvas, event);
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
            var circleFilter = circles.filter(circleF => circleF.x == circle[0] && circleF.y == circle[1]);
            if (circleFilter.length == 0) {
                fillCircle(circle[0], circle[1], "red");
            } else {
                unFillCircle(circle[0], circle[1]);
            }


        });

        window.addEventListener('resize', function (event) {

            //Create a timer to avoid calling the function too many times
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                //Get the new width and height of the window
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                //Get the new scale to fit the screen
                scale = Math.min(newWidth, newHeight) /314;
                //Create the canvas with the new scale
                createCanvas(scale);
                //Paint the circles that were already colored
                for (var i = 0; i < circles.length; i++) {
                    fillCircle(circles[i].x, circles[i].y, circles[i].color);
                }
            }, 250);

        }, true);
        createCanvas(firstScale);


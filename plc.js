var globalData;
var simulated = false;
var auto = true;
var connected = undefined;
async function fetchData() {
    fetch('jsonData.html', { method: 'GET' }).then(function (response) {
        //check if response is ok
        if (response.ok) {
            if (connected == false)
                reconnected();
            return response.json();
        } else {
            throw new Error('PLC Response is not successful.');
        }
    }).then(function (data) {
        updateData(data);
    }).catch(function (err) {
        if (connected != false)
            reconnecting();
        console.log(err);
    });

}

function updateData(data) {
    globalData = data;
    updateDom();
    console.log(globalData);
}



function updateDom() {
    //Update the checkbox for the mode
    switch (parseInt(globalData.programa)) {
        case 0:
		case 1:
            document.getElementById("modo").checked = true;
            changeText();
            break;
        case 2:
            document.getElementById("modo").checked = false;
            changeText();
            break;
		default:
			console.log("Estoy vacilandote");
			break;
    }

    //Update the board with the new data prior to the robot
    updateBoard(globalData.tablero);


    //Update the robot position
    //Check if x and y are not 0 to unhide the robot else hide it
    if (globalData.x != 0 && globalData.y != 0) {
        //Calculate the max value of x and y with the offset
        //set xMin as the 0 value for x and yMin as the 0 value for y
        //Calculate the percentage of x and y with the max value
        //Calculate the position of the robot with the percentage as if the max value was 180
        //Set the position of the robot

        if (globalData.xMax == 0)
            globalData.xMax = 180;

        let xPercentage = (globalData.xAxis - globalData.xMin) / (globalData.xMax - globalData.xMin);
        let yPercentage = (globalData.yAxis - globalData.yMin) / (globalData.yMax - globalData.yMin);
        let xPosition = xPercentage * 180;
        let yPosition = yPercentage * 180;
        setRobot(xPosition, yPosition);
    } else
        setRobotVisibilty(false);
}



function setCircleColor(circleIndex, color) {
    //Do a post request to jsonData.html with the new color
    fetch('jsonData.html', {
        method: 'POST',
        headers: {
            'Content-Type': 'x-www-form-urlencoded'
        },
        body: encodeURI('"WEB_zatia".piezak[' + circleIndex + ']') + '=' + encodeURI(color)
    }).then(function (response) {
        //check if response is ok
        if (response.ok) {
            if (connected == false)
                reconnected();
            return true;
        } else {
            throw new Error('PLC Response is not successful.');
        }
    }).catch(function (err) {
        if (connected != false)
            reconnecting();
        //Show sweetalert with spinner until reconnect
        console.log(err);
    });
}

function toggleProgram() {
    if (simulated) {
        return changeText();
    }
    //Do a post request to jsonData.html with the new color
    fetch('jsonData.html', {
        method: 'POST',
        headers: {
            'Content-Type': 'x-www-form-urlencoded'
        },
        body: encodeURI('"WEB_zatia".programaZbkia') + '=' + encodeURI(globalData.programa < 2 ? 2 : 0)
    }).then(function (response) {
        //check if response is ok
        if (response.ok) {
            if (connected == false)
                reconnected();
            return true;
        } else {
            throw new Error('PLC Response is not successful.');
        }
    }).catch(function (err) {
        if (connected != false)
            reconnecting();
        //Show sweetalert with spinner until reconnect
        console.log(err);
    });
}


function reconnected(){
    connected = true;
    Swal.close();
    Swal.fire({
        title: 'Reconnectado con éxito',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

function reconnecting() {
    //Add a button to the sweetalert to cancel the connection and simulate the data
    connected = false;
    Swal.fire({
        title: 'Reconectando...',
        html: 'Se está reconectando con el PLC, por favor espere.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Simular'
    }).then((result) => {
        if (result.isConfirmed) {
            //Simulate the data
            simulated = true;
            clearInterval(fetchingFunc)
            Swal.fire({
                title: 'Simulando datos',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    });
}
function changeText() {
    let cb = document.getElementById("modo")
            if (cb.checked) {
                auto = false
                document.getElementById("mode").innerHTML = "Manual"
            } else {
                auto = true
                document.getElementById("mode").innerHTML = "Auto"
            }
    }

const fetchingFunc  = setInterval(fetchData, 500);

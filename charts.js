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
            label: 'Cantidad de chocolates actual',
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
        responsive: true,
        maintainAspectRatio: true
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

//Time chart for quantity of chocolates per minute using timeline
var chart2Ctx = document.getElementById('chart2').getContext('2d');
let hour = new Date().getHours();
let labels = [];
for (let i = 0; i < 60; i++) {
    labels.push(hour + ":" + (i < 10 ? "0" + i : i));
}
var chart2 = new Chart(chart2Ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Chocolates por minuto (1h)',
            data: getChart2Data(),
            backgroundColor: [
                'blue'
            ],
            borderColor: [
                'blue'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }   
    }

});

function getChart2Data() {
    let data = [];
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    for (let i = 0; i <= minute; i++) {
        //Filter the timeline by the iterated hour and minute and count the length as if time is epoch
        data.push(timeline.filter(timelineF => {
            let date = new Date(timelineF.time);
            return date.getHours() == hour && date.getMinutes() == i;
        }).length);

    }
    return data;
}

function updateChart2() {
    chart2.data.datasets[0].data = getChart2Data();
    chart2.update();
}


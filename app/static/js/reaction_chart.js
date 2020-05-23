var ctx = document.getElementById('myChart').getContext('2d');
ctx.canvas.width = 700;
ctx.canvas.height = 500;

var x_data = document.querySelector('#data_header1');
var y_data = document.querySelector('#data_header2');

var x_coords = JSON.parse(x_data.dataset.x);
var y_coords = JSON.parse(y_data.dataset.y);


var reaction_point_array = [];
for(var i = 0; i < x_coords.length; i++) {
    var point = {
        x : x_coords[i],
        y : y_coords[i]
    }
    reaction_point_array.push(point);
}

var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: '#',
            borderColor: 'blue',
            borderWidth: 1,
            pointBackgroundColor: ['#000', '#00bcd6', '#d300d6'],
            pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
            pointRadius: 1,
            pointHoverRadius: 5,
            fill: true,
            showLine: true,
            data: reaction_point_array,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
 
        }]
    },
    options: {
        maintainAspectRatio : false,
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    max : 100.0,
                    min : 0.0,
                    fixedStepSize: 0.1
                }
            }]
        }
    }
});

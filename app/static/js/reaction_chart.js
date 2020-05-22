var ctx = document.getElementById('myChart').getContext('2d');
var x_data = document.querySelector('#data_header1')
var y_data = document.querySelector('#data_header2')
var labels_array = []
var y_coords = JSON.parse(y_data.dataset.y_coords)
alert(y_data.dataset.y_coords)
for(var i = 0; i < y_coords.length; i++) {
    labels_array.push(1); 
}


var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels : labels_array,
        datasets: [{
            label: '#',
            data: y_coords,
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

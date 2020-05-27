var ctx = document.getElementById('myChart').getContext('2d');
ctx.canvas.width = 700;
ctx.canvas.height = 500;
var auth_token = document.querySelector('#data_span1');
var user_id = document.querySelector('#myChart');
var base_ip = document.querySelector('#data_header1');
var vid_id = document.querySelector('#vid');
base_ip = base_ip.dataset.ip;
user_id = user_id.dataset.user;
vid_id = vid_id.dataset.vid;
auth_token = auth_token.dataset.token;
var api_path = "api/statistics/personal_reaction/" + user_id + "/" + vid_id + "/" + auth_token;
var fetch_url = base_ip + api_path;
console.log(auth_token);
fetch(fetch_url)
        .then(response => response.json())
        .then(function (data) {  
            const points = data.map(([x, y]) => ({x, y}));
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
                        data: points,
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
        });






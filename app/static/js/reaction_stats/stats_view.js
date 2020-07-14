var auth_token = document.querySelector('#data_span1');
var base_ip = document.querySelector('#data_span2');
var vid_id = document.querySelector('#data_span3');
var user_id = document.querySelector('#data_span4');
auth_token = auth_token.dataset.token;
base_ip = base_ip.dataset.ip;
vid_id = vid_id.dataset.video_id;
user_id = user_id.dataset.uid;
var api_path = "api/statistics/global_reactions/" + vid_id + "/" + user_id + "/" + auth_token;
var fetch_url = base_ip + api_path;

fetch(fetch_url)
        .then(response => response.json())
        .then(function (data) {
            for(var i = 1; i <= data.length; i++) {
                var chart_id = "myChart_" + i;
                var chart_selector = "#chart_div_" + i;
                var chart_data = document.querySelector(chart_selector);
                
                var ctx = document.getElementById(chart_id).getContext('2d');
                
                ctx.canvas.width = 700;
                ctx.canvas.height = 500;
                var array2map = JSON.parse(data[i-1]);
                var point_array = array2map.map(([x, y]) => ({x, y}));
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
                            data: point_array,
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
            }




        });

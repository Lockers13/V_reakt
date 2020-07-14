const video = document.getElementById('vid');


const horror = [{"shocked": "&#128561"}, {"scared": "&#128550"}, {"anxious": "&#128556"}, 
                {"bored": "&#128528"}, {"tears": "&#128546"}, {"curious": "&#129300"}]
const comedy = [{"hilarious": "&#128514"}, {"laugh": "&#128517"}, {"smile": "&#128512"}, 
                {"bored": "&#128528"}, {"sad": "&#128549"}, {"curious": "&#129300"}]
const drama = [{"sad": "&#128549"}, {"anxious": "&#128556"}, {"smile": "&#128512"}, 
                {"bored": "&#128528"}, {"tears": "&#128546"}, {"curious": "&#129300"}]


const emoji_div = document.getElementById('emojis');
const genre = document.getElementById("genre");
const graph = {}
const emoji_genre = {
    "comedy": comedy,
    "horror": horror,
    "drama": drama
}

var timer = 0, timerInterval;

function graph_vis(emoji_data) {
    var chart_head = document.getElementById('c_head')
    chart_head.innerHTML = "Graph Preview"
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.width = 700;
    ctx.canvas.height = 500;
    const points = emoji_data.map(([x, y]) => ({x, y}));


        var myChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: document.getElementById('react_select').value,
                    borderColor: 'blue',
                    borderWidth: 1,
                    pointBackgroundColor: ['#000', '#00bcd6', '#d300d6'],
                    pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
                    pointRadius: 8,
                    pointHoverRadius: 5,
                    fill: false,
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
}

function show_graph(graph) {
    const reaction_select = document.getElementById('react_select')
    var emoji_string = reaction_select.value.toString()
    console.log(emoji_string)
    console.log(emoji_string === "smile")
    if(graph[emoji_string] === undefined)
        document.getElementById('select_error').innerHTML = "You have not recorded any responses for this emotion! Try Again"
    else {
        document.getElementById('select_error').innerHTML = ""
        graph_vis(graph[emoji_string])
    }
}

function log_emoji_press(emotion, press_length) {
    var vid_time = video.currentTime

    if(press_length > 100)
        press_length = 100

    if (emotion in graph) 
        graph[emotion].push([vid_time, press_length])
    else 
        graph[emotion] = [[vid_time, press_length]]
}

function load_emojis() {
    function myFunction(item, index) {
        const key_list = Object.keys(item)
        reaction_select.innerHTML += "<option>" + key_list[0] + "</option>"
        emoji_div.innerHTML += "<button class='emoji_btn' style='padding: 10px 25px;text-align: center;text-decoration: none;display: inline-block;font-size: 80px' id='" +
            key_list[0] + "'>" + item[key_list[0]] + "</button>";
    }
    


    const selected_genre = document.getElementById("genre").value;
    const reaction_select = document.getElementById('react_select')



    emoji_div.innerHTML = ""
    reaction_select.innerHTML = ""
    
    emoji_genre[selected_genre].forEach(myFunction);

    var emj_buttons = document.getElementsByClassName('emoji_btn')

    for(let i = 0; i < emj_buttons.length; i++) {
        
        let button = emj_buttons[i]
        button.addEventListener("mousedown", function() {
            let timerInterval = setInterval(function(){
                timer += 1;
            }, 500);
        })
        
        button.addEventListener("mouseup", function() {
            log_emoji_press(button.id, timer)
            clearInterval(timerInterval);
            timer = 0;
        })
    }

    }


load_emojis()

genre.addEventListener("change", load_emojis);
var graph_button = document.getElementById("g-btn");
graph_button.addEventListener("click", show_graph.bind(event, graph))

$("#post_graph").on("click", function() {
    console.log(graph)
    $.ajax({
        type: "POST",
        url: "/api/emoji_graph",
    // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({'graph': graph,
            'user': user_id, // variable coming from emoji_react.html template 
            'video': vid_id}), // variable coming from emoji_react.html template 

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            alert(data);
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
  });

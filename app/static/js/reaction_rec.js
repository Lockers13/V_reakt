// let shouldStop = false;
// let stopped = false;
// const downloadLink = document.getElementById('download');
// const stopButton = document.getElementById('stop');
// //const pauseButton = document.getElementById('pause');
// const recordButton = document.getElementById('record');
const video = document.getElementById('vid');
// const nested_fdiv = document.getElementById('nested_fd');
// const down_div = document.getElementById('download_div');
// const download_name = document.getElementById('downloadname');


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

var timer = 0,
    timerInterval;


function log_graph() {
    console.log(graph)
}

function log_emoji_press(emotion, press_length) {
    var vid_time = video.currentTime
    if (emotion in graph) 
        graph[emotion].push([vid_time, press_length])
    else 
        graph[emotion] = [[vid_time, press_length]]
}

function load_emojis() {
    function myFunction(item, index) {
        const key_list = Object.keys(item)
        emoji_div.innerHTML += "<button class='emoji_btn' id='" +
            key_list[0] + "'>" + item[key_list[0]] + "</button>";
    }

    const selected_genre = document.getElementById("genre").value;
    emoji_div.innerHTML = ""
    
    emoji_genre[selected_genre].forEach(myFunction);

    var emj_buttons = document.getElementsByClassName('emoji_btn')

    for(let i = 0; i < emj_buttons.length; i++) {
        
        let button = emj_buttons[i]
        console.log(button)

        button.addEventListener("mousedown", function() {
            let timerInterval = setInterval(function(){
                timer += 1;
            }, 100);
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
graph_button.addEventListener("click", log_graph)




// download_name.addEventListener('change', function() {
//     downloadLink.download = download_name.value;
// });

// downloadLink.addEventListener('click', function(){
//     sleep(1000).then(() => {
//         downloadLink.style.display="none"; 
//         download_name.style.display="none";      
//     });
// });

// recordButton.addEventListener('click', function () {


    // video.addEventListener('ended', function () {
    //     shouldStop = true;
    // })
    // stopButton.addEventListener('click', function () {
    //     shouldStop = true;
    //     video.pause();
    // })

    // var handleSuccess = function (stream) {

    //     const options = { mimeType: 'video/webm;codecs=h264' };
    //     const recordedChunks = [];
    //     const mediaRecorder = new MediaRecorder(stream, options);


    //     mediaRecorder.addEventListener('dataavailable', function (e) {

    //         if (e.data.size > 0)
    //             recordedChunks.push(e.data);

    //         if (shouldStop === true && stopped === false) {4
    //             mediaRecorder.stop(1);
    //             console.log(mediaRecorder.state);
    //             stopped = true;
    //         }
    //     });

    //     mediaRecorder.addEventListener('stop', function () {


    //         downloadLink.href = URL.createObjectURL(new Blob(recordedChunks), {type: 'video/mp4'});
    //         downloadLink.download = download_name.value;
    //         //downloadLink.click();

            
    //         var vid_div = document.getElementById('viddiv');
            
    //         down_div.style.display= 'block';

    //         vid_div.style.float = 'center';
    //         form_div.style.display = 'block';

    //     });
        // video.play()
        // mediaRecorder.start(1000);

 

    // navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    //     .then(handleSuccess);
// })

// function sleep (time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
//   }






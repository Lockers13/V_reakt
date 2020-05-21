let shouldStop = false;
let stopped = false;
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');
//const pauseButton = document.getElementById('pause');
const recordButton = document.getElementById('record');
const video = document.getElementById('vid');
const nested_fdiv = document.getElementById('nested_fd');
const down_div = document.getElementById('download_div');
const download_name = document.getElementById('downloadname');

download_name.addEventListener('change', function() {
    downloadLink.download = download_name.value;
});

downloadLink.addEventListener('click', function(){
    sleep(1000).then(() => {
        downloadLink.style.display="none"; 
        download_name.style.display="none";      
    });
});

recordButton.addEventListener('click', function () {


    video.addEventListener('ended', function () {
        shouldStop = true;
    })
    stopButton.addEventListener('click', function () {
        shouldStop = true;
        video.pause();
    })

    var handleSuccess = function (stream) {

        const options = { mimeType: 'video/webm;codecs=h264' };
        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);


        mediaRecorder.addEventListener('dataavailable', function (e) {

            if (e.data.size > 0)
                recordedChunks.push(e.data);

            if (shouldStop === true && stopped === false) {4
                mediaRecorder.stop(1);
                console.log(mediaRecorder.state);
                stopped = true;
            }
        });

        mediaRecorder.addEventListener('stop', function () {


            downloadLink.href = URL.createObjectURL(new Blob(recordedChunks), {type: 'video/mp4'});
            downloadLink.download = download_name.value;

            
            var vid_div = document.getElementById('viddiv');
            
            down_div.style.display= 'block';

            vid_div.style.float = 'left';
            //form_div.style.display = 'block';

        });
        video.play()
        mediaRecorder.start(1000);

    };

    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(handleSuccess);
})

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
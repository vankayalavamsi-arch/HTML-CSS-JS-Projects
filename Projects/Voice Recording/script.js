let mediaRecorder;
let audioChunks = [];

const icon = document.getElementById("icon");
const status = document.getElementById("status");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const playBtn = document.getElementById("play");
const download = document.getElementById("download");

// Start Recording
startBtn.onclick = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
        audio:true
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();

    status.textContent = "Recording...";
    icon.style.color = "red";

    startBtn.disabled = true;
    stopBtn.disabled = false;

    audioChunks = [];

    mediaRecorder.ondataavailable = e=>{
        audioChunks.push(e.data);
    };
};

// Stop Recording
stopBtn.onclick = ()=>{

    mediaRecorder.stop();

    status.textContent = "Recording Stopped";
    icon.style.color = "#ff4444";

    stopBtn.disabled = true;
    startBtn.disabled = false;
    playBtn.disabled = false;

    mediaRecorder.onstop = ()=>{

        const audioBlob = new Blob(audioChunks,{
            type:"audio/webm"
        });

        const audioURL = URL.createObjectURL(audioBlob);

        playBtn.dataset.url = audioURL;

        download.href = audioURL;
    };
};

// Play Recording
playBtn.onclick = ()=>{

    const audio = new Audio(playBtn.dataset.url);

    audio.play();

};
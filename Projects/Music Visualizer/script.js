const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let audioCtx, analyser, datasource;

function startMic() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            
            datasource = audioCtx.createMediaStreamSource(stream);
            datasource.connect(analyser);
            
            document.getElementById('startBtn').innerText = 'Listening...';
            document.getElementById('startBtn').style.background = '#00b894';
            
            draw();
        })
        .catch(err => alert('Mic access denied!'));
}

function draw() {
    requestAnimationFrame(draw);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    
    ctx.fillStyle = 'rgba(18, 18, 18, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}
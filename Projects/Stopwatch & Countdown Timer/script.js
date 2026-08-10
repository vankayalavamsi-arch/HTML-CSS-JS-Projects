// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('timerDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('timerDark', isDark); // Save new state
}

function switchTab(tab, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('stopwatch-panel').style.display = tab === 'stopwatch' ? 'block' : 'none';
    document.getElementById('countdown-panel').style.display = tab === 'countdown' ? 'block' : 'none';
}

// Format milliseconds into HH:MM:SS.cs
function formatTime(ms) {
    // Prevent negative time from showing if there's a lag spike
    ms = Math.max(0, ms);
    
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let cs = Math.floor((ms % 1000) / 10);
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

// --- STOPWATCH LOGIC ---
let swTime = 0;
let swInterval;
let swRunning = false;
let lapCount = 0;

function swStart() {
    if (swRunning) {
        clearInterval(swInterval);
        document.getElementById('sw-start').innerText = "Resume";
    } else {
        let start = Date.now() - swTime;
        swInterval = setInterval(() => {
            swTime = Date.now() - start;
            document.getElementById('sw-display').innerText = formatTime(swTime);
        }, 10);
        document.getElementById('sw-start').innerText = "Pause";
    }
    swRunning = !swRunning;
}

function swLap() {
    if (swRunning) {
        lapCount++;
        const lapHtml = `<div class="lap-item"><span>Lap ${lapCount}</span><span>${formatTime(swTime)}</span></div>`;
        document.getElementById('laps').insertAdjacentHTML('afterbegin', lapHtml);
    }
}

function swReset() {
    clearInterval(swInterval);
    swTime = 0;
    swRunning = false;
    lapCount = 0;
    document.getElementById('sw-display').innerText = "00:00:00.00";
    document.getElementById('sw-start').innerText = "Start";
    document.getElementById('laps').innerHTML = '';
}


// --- COUNTDOWN LOGIC ---
let cdTime = 0;
let cdInterval;
let cdRunning = false;

// Helper to get current input values in milliseconds
function getCdInputTime() {
    const hr = parseInt(document.getElementById('cd-hr').value) || 0;
    const min = parseInt(document.getElementById('cd-min').value) || 0;
    const sec = parseInt(document.getElementById('cd-sec').value) || 0;
    return (hr * 3600 + min * 60 + sec) * 1000;
}

// Helper to toggle input disabled state
function toggleInputs(disabled) {
    document.getElementById('cd-hr').disabled = disabled;
    document.getElementById('cd-min').disabled = disabled;
    document.getElementById('cd-sec').disabled = disabled;
}

function cdStart() {
    if (!cdRunning) {
        // If starting fresh (cdTime is 0), read from inputs
        if (cdTime === 0) {
            cdTime = getCdInputTime();
        }
        
        if (cdTime <= 0) return;
        
        toggleInputs(true); // Disable inputs while running

        cdInterval = setInterval(() => {
            cdTime -= 10;
            document.getElementById('cd-display').innerText = formatTime(cdTime);
            
            if (cdTime <= 0) {
                clearInterval(cdInterval);
                cdRunning = false;
                toggleInputs(false); // Re-enable inputs
                document.getElementById('cd-start').innerText = "Start";
                alert("Time's up!");
            }
        }, 10);
        
        document.getElementById('cd-start').innerText = "Pause";
    } else {
        clearInterval(cdInterval);
        document.getElementById('cd-start').innerText = "Resume";
    }
    cdRunning = !cdRunning;
}

function cdReset() {
    clearInterval(cdInterval);
    cdTime = 0;
    cdRunning = false;
    toggleInputs(false); // Re-enable inputs
    
    // Dynamically set display based on current input fields instead of hardcoding 00:05:00
    document.getElementById('cd-display').innerText = formatTime(getCdInputTime());
    document.getElementById('cd-start').innerText = "Start";
}
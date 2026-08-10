let is24Hour = true;
let isDark = localStorage.getItem('clockDark') === 'true';

if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('clockDark', !isDark);
    isDark = !isDark;
}

function toggleFormat() {
    is24Hour = !is24Hour;
    updateClock();
}

function updateClock() {
    const tz = document.getElementById('timezone').value;
    const now = new Date();

    let timeStr = now.toLocaleTimeString('en-US', {
        hour12: !is24Hour,
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: tz
    });

    document.getElementById('time').innerText = timeStr;
    document.getElementById('date').innerText = dateStr;
}

setInterval(updateClock, 1000);
updateClock();
let time = 0;
let launched = false;
let fuel = 100;
let alt = 0;
let vel = 0;
let o2 = 98;

// Mission Elapsed Time (MET) Clock
setInterval(() => {
    if (launched) {
        time++;
        const days = String(Math.floor(time / 86400)).padStart(2, '0');
        const hours = String(Math.floor((time % 86400) / 3600)).padStart(2, '0');
        const mins = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const secs = String(time % 60).padStart(2, '0');
        
        document.getElementById('clock').innerText = `${days}:${hours}:${mins}:${secs}`;
    }
}, 1000);

function launch() {
    if (launched) return;
    launched = true;
    
    const launchBtn = document.getElementById('launchBtn');
    launchBtn.innerText = 'In Flight';
    launchBtn.style.background = '#333';
    launchBtn.style.cursor = 'default';

    const flightInt = setInterval(() => {
        // Update core metrics
        fuel -= Math.random() * 2;
        alt += Math.random() * 100;
        vel += Math.random() * 0.5;
        
        // O2 drains steadily instead of bouncing randomly
        o2 -= Math.random() * 0.5; 
        if (o2 < 0) o2 = 0;

        // End simulation if out of fuel
        if (fuel <= 0) {
            fuel = 0;
            clearInterval(flightInt);
            launchBtn.innerText = 'Mission End';
        }

        // Cap visual percentages at 100
        const altPercent = Math.min((alt / 400) * 100, 100);
        const velPercent = Math.min((vel / 8) * 100, 100);

        // Update DOM - Fuel
        document.getElementById('fuel').style.width = fuel + '%';
        document.getElementById('fuelP').innerText = Math.floor(fuel) + '%';
        
        // Update DOM - Altitude (Capped text display to match visual bar)
        document.getElementById('alt').style.width = altPercent + '%';
        document.getElementById('altP').innerText = Math.min(Math.floor(alt), 400) + (alt > 400 ? '+' : '');
        
        // Update DOM - Velocity (Capped text display to match visual bar)
        document.getElementById('vel').style.width = velPercent + '%';
        document.getElementById('velP').innerText = Math.min(vel, 8).toFixed(1) + (vel > 8 ? '+' : '');

        // Update DOM - Telemetry
        document.getElementById('temp').innerText = (21 + Math.random() * 200).toFixed(0) + '°C';
        
        // G-Force scales logically with velocity instead of purely random numbers
        const gForce = 1 + (vel * 0.6) + (Math.random() * 0.5);
        document.getElementById('gforce').innerText = gForce.toFixed(1) + 'G';
        
        document.getElementById('o2').innerText = Math.floor(o2) + '%';

        // Dynamic Fuel Bar Color
        const fuelBar = document.getElementById('fuel');
        if (fuel > 50) {
            fuelBar.style.background = 'var(--accent)';
        } else if (fuel > 20) {
            fuelBar.style.background = 'var(--warn)';
        } else {
            fuelBar.style.background = 'var(--danger)';
        }
    }, 500);
}
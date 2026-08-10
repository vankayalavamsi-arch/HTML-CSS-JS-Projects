// Simple notification system
export const Notify = {
    show(message, type = 'info') {
        const container = document.getElementById('notifications');
        const toast = document.createElement('div');
        toast.style.cssText = `padding: 10px 15px; background: var(--bg-glass); border: 1px solid var(--border-color); border-left: 4px solid ${type === 'error' ? '#ff4466' : type === 'success' ? '#00e5a0' : '#4499ff'}; border-radius: 4px; margin-bottom: 5px; font-size: 13px; backdrop-filter: blur(10px); animation: slideIn 0.2s ease-out;`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 200); }, 3000);
    }
};

// Simple sound system using Web Audio API
export const Sound = {
    play(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            gain.gain.value = 0.05;
            if (type === 'startup') { osc.frequency.value = 600; gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3); }
            else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; }
            else { osc.frequency.value = 800; gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05); } // click
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }
};

// Add animation for notifications
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);
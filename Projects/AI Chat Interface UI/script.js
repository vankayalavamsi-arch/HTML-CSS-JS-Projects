let isDark = localStorage.getItem('aiDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('aiDark', !isDark);
    isDark = !isDark;
}

const responses = [
    "That's an interesting question! As an AI, I think the answer lies within the data.",
    "I am currently a frontend UI mockup, but I appreciate you chatting with me!",
    "Have you tried turning it off and on again?",
    "Let me process that... Just kidding, I'm instant!",
    "I can help with coding, design, and more. What do you need?",
    "Error 404: Wit not found. Please try again."
];

function send() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;
    
    document.getElementById('chat').innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';
    scrollBottom();

    document.getElementById('typing').style.display = 'block';
    scrollBottom();
    
    setTimeout(() => {
        document.getElementById('typing').style.display = 'none';
        const reply = responses[Math.floor(Math.random() * responses.length)];
        document.getElementById('chat').innerHTML += `<div class="msg bot">${reply}</div>`;
        scrollBottom();
    }, 1500);
}

function clearChat() {
    document.getElementById('chat').innerHTML = '<div class="msg bot">Chat cleared. How can I help?</div>';
}

function scrollBottom() {
    const c = document.getElementById('chat');
    c.scrollTop = c.scrollHeight;
}
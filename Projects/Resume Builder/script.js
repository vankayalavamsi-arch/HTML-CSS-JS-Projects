// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('resDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip the state first
    document.body.classList.toggle('dark');
    localStorage.setItem('resDark', isDark); // Save the new flipped state
}

function update() {
    const name = document.getElementById('name').value || 'Your Name';
    const email = document.getElementById('email').value || 'email';
    const phone = document.getElementById('phone').value || 'phone';
    
    document.getElementById('p-name').innerText = name;
    document.getElementById('p-contact').innerText = `${email} | ${phone}`;
    
    // Using innerHTML for headers but innerText for text inputs to prevent XSS
    document.getElementById('p-summary').innerHTML = `<h2>Summary</h2><p>${document.getElementById('summary').value || '...'}</p>`;
    document.getElementById('p-exp').innerHTML = `<h2>Experience</h2><p class="preserve-whitespace">${document.getElementById('exp').value || '...'}</p>`;
    document.getElementById('p-edu').innerHTML = `<h2>Education</h2><p class="preserve-whitespace">${document.getElementById('edu').value || '...'}</p>`;
    document.getElementById('p-skills').innerHTML = `<h2>Skills</h2><p>${document.getElementById('skills').value || '...'}</p>`;
}
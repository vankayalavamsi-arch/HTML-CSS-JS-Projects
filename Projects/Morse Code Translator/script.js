// Morse Code Dictionary
const morseCodeDict = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
    'Z': '--..', 
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', 
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', 
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', 
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', 
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', 
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// Reverse Dictionary for Morse to Text
const reverseMorseDict = {};
for (const key in morseCodeDict) {
    reverseMorseDict[morseCodeDict[key]] = key;
}

// DOM Elements
const textInput = document.getElementById('text-input');
const morseInput = document.getElementById('morse-input');
const toMorseBtn = document.getElementById('to-morse-btn');
const toTextBtn = document.getElementById('to-text-btn');
const playMorseBtn = document.getElementById('play-morse-btn');
const clearBtn = document.getElementById('clear-btn');

// Function to convert Text to Morse
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        if (morseCodeDict[char] !== undefined) {
            return morseCodeDict[char];
        }
        return ''; // Ignore unsupported characters
    }).filter(code => code !== '').join(' ');
}

// Function to convert Morse to Text
function morseToText(morse) {
    // Replace slashes with spaces to normalize word separators, then split by spaces
    return morse.trim().split(/\s{2,}|\s*\/\s*|\s*\|\s*/).map(morseChar => {
        if (reverseMorseDict[morseChar] !== undefined) {
            return reverseMorseDict[morseChar];
        }
        return ''; // Ignore invalid morse sequences
    }).join('').replace(/\//g, ' '); // Ensure slashes turn back to spaces
}

// Audio Context for playing sounds
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Function to play Morse Code audio
function playMorseAudio(morseString) {
    const ctx = getAudioContext();
    const dotDuration = 0.1; // seconds
    const dashDuration = 0.3; // seconds
    const symbolGap = 0.1; // gap between dots/dashes
    const letterGap = 0.3; // gap between letters
    const wordGap = 0.7;  // gap between words

    let time = ctx.currentTime + 0.05; // Small delay before starting

    // Normalize the string to handle slashes, spaces, etc.
    const characters = morseString.split('');
    
    characters.forEach(char => {
        if (char === '.') {
            playTone(ctx, time, dotDuration);
            time += dotDuration + symbolGap;
        } else if (char === '-') {
            playTone(ctx, time, dashDuration);
            time += dashDuration + symbolGap;
        } else if (char === ' ') {
            time += letterGap - symbolGap; // Adjust gap to prevent double counting
        } else if (char === '/') {
            time += wordGap - letterGap; // Adjust gap for words
        }
    });
}

function playTone(ctx, startTime, duration) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 600; // 600Hz is standard for Morse code tone
    oscillator.type = 'sine';

    // Smooth out the sound to prevent clicking
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gainNode.gain.setValueAtTime(1, startTime + duration - 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Event Listeners
toMorseBtn.addEventListener('click', () => {
    const text = textInput.value;
    morseInput.value = textToMorse(text);
});

toTextBtn.addEventListener('click', () => {
    const morse = morseInput.value;
    textInput.value = morseToText(morse);
});

playMorseBtn.addEventListener('click', () => {
    const morse = morseInput.value;
    if (morse.trim() === "") {
        alert("There is no Morse code to play!");
        return;
    }
    playMorseAudio(morse);
});

clearBtn.addEventListener('click', () => {
    textInput.value = "";
    morseInput.value = "";
});
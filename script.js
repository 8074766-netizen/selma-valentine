const CORRECT_PASSCODE = "04122025";
let currentPasscode = "";
let currentQuestionIndex = 0;
let attempts = 0;

const questions = [
    {
        q: "What is your favourite cologne on a man?",
        options: ["Dior Sauvage", "Dakkar Noir", "Creed Aventus"],
        answer: 0,
        error: "Cherieee arrête loohhh"
    },
    {
        q: "What's your favourite color?",
        options: ["Pink", "Red", "Brown"],
        answer: 2,
        error: "Think about my skin color hhaha"
    },
    {
        q: "Where did we go on our second date?",
        options: ["Prison", "Exporail", "Ginko Café"],
        answer: 1,
        error: "This one was way easy bidi -_-"
    },
    {
        q: "What were you wearing on our first date?",
        options: ["Red and Blue", "Brown and Burgundy", "Black and Pink"],
        answer: 1,
        error: "Hmm maybe one of us is color-blind :S"
    },
    {
        q: "What's my favourite drink?",
        options: ["Beer", "Orange Juice", "Mango Juice"],
        answer: 1,
        error: "Umm excuse me?"
    },
    {
        q: "What's my favourite hairstyle on you?",
        options: ["Messy bun", "Bald", "Ponytail"],
        answer: 0,
        error: "Cmonnnnnnnnn"
    },
    {
        q: "Who said 'I love you' first?",
        options: ["Muhit Ali", "Selma Lavoie", "Ricardo the Chef"],
        answer: 0,
        error: "As long as it wasn’t Ricardo -_-"
    },
    {
        q: "Which nickname is your favourite?",
        options: ["Chica", "Lita", "Cherie"],
        answer: 2,
        error: "Pick Cherie :)"
    },
    {
        q: "What's your favourite ice cream flavour?",
        options: ["Vanilla and Chocolate", "Strawberry and Pistachio", "Vanilla and Pistachio"],
        answer: 2,
        error: "Beinn laaaaaaaa"
    },
    {
        q: "Where did I work as a teenager?",
        options: ["Clothing Shop", "Bowling Alley", "Spiderman"],
        answer: 1,
        error: "Sad face emoji Cherie :("
    }
];

// --- Background Hearts ---
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(heart);
    }
}

// --- Passcode Logic ---
function handleKey(num) {
    if (currentPasscode.length < 8) {
        currentPasscode += num;
        updatePasscodeDots();

        if (currentPasscode.length === 8) {
            setTimeout(verifyPasscode, 300);
        }
    }
}

function updatePasscodeDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx < currentPasscode.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });
}

function resetPasscode() {
    currentPasscode = "";
    updatePasscodeDots();
}

function verifyPasscode() {
    if (currentPasscode === CORRECT_PASSCODE) {
        switchScreen('passcode-screen', 'quiz-screen');
        loadQuestion();
    } else {
        attempts++;
        const container = document.querySelector('.passcode-dots');
        const hintEl = document.getElementById('passcode-hint');

        container.style.animation = "shake 0.3s ease-in-out";

        if (attempts >= 1) {
            hintEl.innerText = "Hint: The date we met in DD/MM/YYYY format";
            hintEl.style.color = "var(--primary-rose)";
            hintEl.style.opacity = "1";
        }

        setTimeout(() => {
            container.style.animation = "";
            resetPasscode();
        }, 300);
    }
}

// --- Quiz Logic ---
function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('progress').style.width = ((currentQuestionIndex) / questions.length * 100) + "%";

    // Handle Back Button Visibility
    const backBtn = document.getElementById('backBtn');
    if (currentQuestionIndex > 0) {
        backBtn.style.opacity = "1";
        backBtn.style.pointerEvents = "auto";
    } else {
        backBtn.style.opacity = "0";
        backBtn.style.pointerEvents = "none";
    }

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerText = opt;
        div.onclick = () => handleAnswer(idx);
        optionsContainer.appendChild(div);
    });
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function handleAnswer(idx) {
    const q = questions[currentQuestionIndex];

    if (idx === q.answer) {
        showFeedback(true); // Show Oui Bird

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                document.getElementById('progress').style.width = "100%";
                setTimeout(() => {
                    switchScreen('quiz-screen', 'proposal-screen');
                }, 500);
            }
        }, 800); // Wait for animation
    } else {
        showFeedback(false); // Show Non Bird
        showError(q.error);
    }
}

function showFeedback(isCorrect) {
    const overlay = document.getElementById('feedback-overlay');
    const img = document.getElementById('feedback-img');

    img.src = isCorrect ? 'assets/oui.png' : 'assets/non.png';
    overlay.classList.add('show');

    setTimeout(() => {
        overlay.classList.remove('show');
    }, 700);
}

function showError(msg) {
    const errDiv = document.createElement('div');
    errDiv.className = 'error-toast';
    errDiv.innerText = msg;
    document.querySelector('.app-display').appendChild(errDiv);

    setTimeout(() => {
        errDiv.remove();
    }, 2500);
}

// --- Utilities ---
function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
}

// --- Proposal Logic ---
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let noCount = 0;

noBtn.addEventListener('mouseover', () => {
    // Move away FASTER and Further
    const x = (Math.random() * 200 - 100) * 1.5; // Increased range
    const y = (Math.random() * 200 - 100) * 1.5;

    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    // Make YES bigger
    noCount++;
    const newScale = 1 + (noCount * 0.3); // Grows faster too
    yesBtn.style.transform = `scale(${newScale})`;

    if (noCount > 7) {
        noBtn.style.opacity = "0"; /* Vanish completely eventually */
        noBtn.style.pointerEvents = "none";
    }
});

// Mobile support for "No" button
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent click
    const x = (Math.random() * 200 - 100) * 1.5;
    const y = (Math.random() * 200 - 100) * 1.5;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    noCount++;
    const newScale = 1 + (noCount * 0.3);
    yesBtn.style.transform = `scale(${newScale})`;
});

function celebrate() {
    document.getElementById('proposal-screen').style.display = 'none';
    const success = document.getElementById('success-msg');
    success.classList.add('show-success');

    // Add extra hearts
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
        heart.style.zIndex = "1";
        heart.style.pointerEvents = "none";
        document.body.appendChild(heart);
    }, 100);
}

// --- Payment Logic ---
function showPayment() {
    document.getElementById('kisses-prompt').style.display = 'none';
    const form = document.getElementById('payment-form');
    form.style.display = 'block';
    form.style.animation = "fade-in 0.5s ease";
}

function finishTransaction() {
    document.getElementById('payment-form').style.display = 'none';
    const thanks = document.getElementById('final-thanks');
    thanks.style.display = 'block';
    thanks.style.animation = "heart-beat 0.5s ease";

    // Confetti of kisses
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '💋';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = '30px';
            document.body.appendChild(heart);
        }, i * 100);
    }
}

// Shake animation CSS added dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Init
createHearts();

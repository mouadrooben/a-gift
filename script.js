// Get elements
const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('openBtn');
const resetBtn = document.getElementById('resetBtn');
const letterText = document.getElementById('letterText');
const letter = document.getElementById('letter');
const themeToggle = document.getElementById('themeToggle');

// Set the letter message - YOUR CUSTOM LETTER
const message = `ميرهاني يا أختي الكبيرة الصغيرة، 💗🌸

كل سنة وأنتِ بألف خير يا أحلى مخلوق في الدنيا. والله العظيم إني ما أعرف كيف أبدأ ولا كيف أوصف اللي جوايا، بس اللي أعرفه إنك من أجمل الناس اللي دخلوا حياتي، وإن وجودك جنبي دايمًا كان أمان وحنية وحب من نوع نادر.

أنا ممتنة جدًا إنك في حياتي، وإنك دايمًا فاهماني من غير كلام كتير. ضحكتك تفرح القلب، وكلامك يطيب الروح، ووجودك يخلّي الدنيا أهدى وأحلى.

في عيد ميلادك، أتمنى لك أيام كلها فرح وضحك وسعادة، وكل أمنية في بالك تتحقق. تستاهلي كل شي حلو في الدنيا، وزي ما أنتِ دايمًا تضوّي حياتي، أتمنى حياتك تكون مليانة نور وورد وفرح.

بحبك مرة، ألف مرة، وقد الدنيا وما فيها 💗`;

letterText.textContent = message;

// Open letter
openBtn.addEventListener('click', () => {
    envelope.classList.add('opened');
    letter.classList.add('show');
});

// Close letter
resetBtn.addEventListener('click', () => {
    envelope.classList.remove('opened');
    letter.classList.remove('show');
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Save preference
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update button icon
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Load saved theme
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
});

// Function to update letter text (you can call this with custom message)
function setLetterMessage(message) {
    letterText.textContent = message;
}

/* ==========================================
   TUGAS RUTIN 6 - INTERACTIVE QUIZ APP
   JAVASCRIPT DOM, EVENTS & LOCALSTORAGE
   ========================================== */

/* ==========================================
   1. DATA SOAL
   ========================================== */

const quizData = [
    {
        question: "Apa kepanjangan dari HTML?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink Text Mode Language"
        ],
        correct: 0,
        explanation: "HTML adalah singkatan dari Hyper Text Markup Language."
    },
    {
        question: "CSS digunakan untuk apa?",
        options: [
            "Membuat struktur halaman",
            "Mengatur tampilan halaman",
            "Membuat database",
            "Mengirim request ke server"
        ],
        correct: 1,
        explanation: "CSS digunakan untuk mengatur tampilan dan desain halaman web."
    },
    {
        question: "Apa fungsi utama dari DOM?",
        options: [
            "Menyimpan file gambar",
            "Menghubungkan database",
            "Memanipulasi struktur dan konten HTML",
            "Menghapus browser"
        ],
        correct: 2,
        explanation: "DOM memungkinkan JavaScript mengakses dan mengubah elemen HTML."
    },
    {
        question: "Method apa yang digunakan untuk memilih satu elemen pertama yang cocok?",
        options: [
            "document.querySelector()",
            "document.createElement()",
            "document.append()",
            "document.remove()"
        ],
        correct: 0,
        explanation: "querySelector() mengembalikan elemen pertama yang sesuai dengan CSS selector."
    },
    {
        question: "Apa fungsi LocalStorage?",
        options: [
            "Menyimpan data sementara hanya selama satu event",
            "Menyimpan data dalam bentuk string di browser",
            "Menghapus seluruh halaman HTML",
            "Mengubah CSS menjadi JavaScript"
        ],
        correct: 1,
        explanation: "LocalStorage menyimpan data dalam bentuk string dan dapat bertahan setelah browser ditutup."
    }
];


/* ==========================================
   2. STATE APLIKASI
   ========================================== */

let currentQuestion = 0;
let score = 0;
let answered = false;


/* ==========================================
   3. DOM ELEMENTS
   ========================================== */

const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const nextBtn = document.querySelector("#nextBtn");
const progressEl = document.querySelector("#progress");
const currentScoreEl = document.querySelector("#currentScore");
const progressBar = document.querySelector("#progressBar");
const feedbackEl = document.querySelector("#feedback");

const quizContent = document.querySelector(".quiz-content");
const resultEl = document.querySelector("#result");
const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#highScore");
const resultMessageEl = document.querySelector("#resultMessage");
const restartBtn = document.querySelector("#restartBtn");


/* ==========================================
   4. RENDER SOAL
   ========================================== */

function renderQuestion() {

    const question = quizData[currentQuestion];

    // Reset status jawaban
    answered = false;

    // Update progress dan skor
    progressEl.textContent =
        `Soal ${currentQuestion + 1} dari ${quizData.length}`;

    currentScoreEl.textContent = score;

    progressBar.style.width =
        `${((currentQuestion + 1) / quizData.length) * 100}%`;

    // Tampilkan pertanyaan dengan textContent
    questionEl.textContent = question.question;

    // Kosongkan pilihan lama
    optionsEl.replaceChildren();

    // Reset feedback
    feedbackEl.className = "feedback hidden";
    feedbackEl.textContent = "";

    // Nonaktifkan tombol Next sebelum jawaban dipilih
    nextBtn.disabled = true;
    nextBtn.textContent = "Pilih jawaban terlebih dahulu →";

    // Buat pilihan jawaban menggunakan createElement
    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.classList.add("option-btn");

        // textContent aman untuk menampilkan teks
        button.textContent = option;

        // Simpan index jawaban untuk event delegation
        button.dataset.index = index;

        optionsEl.append(button);

    });

}


/* ==========================================
   5. EVENT DELEGATION
   ========================================== */

// Satu listener untuk seluruh pilihan jawaban
optionsEl.addEventListener("click", (event) => {

    const button = event.target.closest(".option-btn");

    // Abaikan jika yang diklik bukan pilihan jawaban
    if (!button || answered) {
        return;
    }

    const selectedIndex = Number(button.dataset.index);
    const question = quizData[currentQuestion];

    answered = true;

    // Ambil semua tombol pilihan
    const allButtons = optionsEl.querySelectorAll(".option-btn");

    // Nonaktifkan semua pilihan setelah dijawab
    allButtons.forEach((optionButton) => {
        optionButton.disabled = true;
    });

    if (selectedIndex === question.correct) {

        // Jawaban benar
        button.classList.add("correct");

        score++;

        currentScoreEl.textContent = score;

        feedbackEl.className =
            "feedback correct-feedback";

        feedbackEl.textContent =
            `✓ Benar! ${question.explanation}`;

    } else {

        // Jawaban salah
        button.classList.add("wrong");

        // Tampilkan jawaban yang benar
        allButtons[question.correct].classList.add("correct");

        feedbackEl.className =
            "feedback wrong-feedback";

        feedbackEl.textContent =
            `✗ Kurang tepat. ${question.explanation}`;

    }

    // Aktifkan tombol Next
    nextBtn.disabled = false;

    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = "Lihat Hasil Quiz →";
    } else {
        nextBtn.textContent = "Soal Berikutnya →";
    }

});


/* ==========================================
   6. TOMBOL NEXT
   ========================================== */

nextBtn.addEventListener("click", () => {

    if (!answered) {
        return;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {

        renderQuestion();

    } else {

        showResult();

    }

});


/* ==========================================
   7. MENAMPILKAN HASIL
   ========================================== */

function showResult() {

    const total = quizData.length;
    const percentage = Math.round((score / total) * 100);

    // Tampilkan skor akhir
    scoreEl.textContent = `${score}/${total} (${percentage}%)`;

    // Pesan berdasarkan nilai
    if (percentage === 100) {
        resultMessageEl.textContent =
            "Sempurna! Semua jawaban kamu benar.";
    } else if (percentage >= 60) {
        resultMessageEl.textContent =
            "Bagus! Terus belajar untuk meningkatkan hasil.";
    } else {
        resultMessageEl.textContent =
            "Tetap semangat! Coba ulangi quiz untuk belajar lagi.";
    }

    // Ambil high score dari LocalStorage
    const savedHighScore =
        Number(localStorage.getItem("quizHighScore")) || 0;

    if (percentage > savedHighScore) {

        localStorage.setItem("quizHighScore", percentage);

        highScoreEl.textContent = `${percentage}% (Rekor Baru!)`;

    } else {

        highScoreEl.textContent = `${savedHighScore}%`;

    }

    // Sembunyikan halaman kuis
    quizContent.classList.add("hidden");

    // Tampilkan halaman hasil
    resultEl.classList.remove("hidden");

}


/* ==========================================
   8. RESTART QUIZ
   ========================================== */

restartBtn.addEventListener("click", () => {

    currentQuestion = 0;
    score = 0;
    answered = false;

    // Tampilkan kembali quiz
    resultEl.classList.add("hidden");
    quizContent.classList.remove("hidden");

    // Render soal pertama
    renderQuestion();

});


/* ==========================================
   9. INISIALISASI
   ========================================== */

renderQuestion();
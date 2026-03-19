let currentQuestions = [];
let currentIndex = 0; // index for a current question
let score = 0; // adding +1 for each right answer
let timer;
let timeLeft = 30;

// Questions

function startQuiz(level, type) {
    const filePath = `data/${level}_${type}.json` // way to json file

    fetch(filePath)
        .then(response => response.json()) //
        .then(data => {
            allQuestions = data;

            // picking 20 random questions from our json file
            currentQuestions = getRandomQuestions(allQuestions, 20);

            currentIndex = 0;
            score = 0;

            // hidding level select
            document.querySelector(".difficulty-selection").style.display = "none";

            // showing first question
            showQuestion();
        })
        // catching an error when we can't load the question
        .catch(err => console.error("Failed to load questions:", err))
}

function getRandomQuestions(arr, num) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random()); // randomising
    return shuffled.slice(0, num); // taking first num
}

function showQuestion() {
    const questionObj = currentQuestions[currentIndex];

    // refreshing our cute progress bar and number
    document.getElementById("question-number").innerText = 
        `Question ${currentIndex +1} / ${currentQuestions.length}`;
    
    const progress = (currentIndex / currentQuestions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";

    // showing question . We're choosing by ID and taking text "question" from that file
    document.getElementById("question").innerText = questionObj.question;

    // shuffling answers
    const shuffleAnswers = questionObj.answers.slice().sort(() => 0.5 - Math.random());

    // creating buttons for an answer
    const answersButtons = document.getElementById("answers");
    answersButtons.innerHTML = "";
    shuffleAnswers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = answer.text;
        btn.onclick = () => selectAnswer(answer, btn);
        answersButtons.appendChild(btn);
    });

    // clear feedback
    document.getElementById("feedback").innerText = "";

    // starting the timer
    startTimer();

}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    // our text - how much time left
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000)
}

//timeout

function handleTimeOut() {
    document.getElementById("feedback").innerText = "Time's up! Try again!";
    disableAnswers();
    setTimeout(nextQuestion, 2000);
}

// choosing the answer
function selectAnswer(answer, btn) {
    clearInterval(timer);
  
    const feedback = document.getElementById("feedback");
  
    if (answer.result_answer) {
      feedback.innerText = "✅ " + answer.explanation;
      score++;              // +1 to the score
      btn.style.background = "green";
    } else {
      feedback.innerText = "❌ Wrong! " + answer.explanation;
      btn.style.background = "red";
    }
  
    disableAnswers();
    setTimeout(nextQuestion, 2000);
  }
  
  // blocking buttons
  function disableAnswers() {
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(btn => btn.disabled = true);
  }
  
  // next question
  function nextQuestion() {
    currentIndex++; // adding to the index +1 to go to the next question
  
    if (currentIndex < currentQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
  
// showing result
  function showResult() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = `
      <h2>Your score: ${score} / ${currentQuestions.length}</h2>
      <button id="back-button" class="button-30" role="button">Back to the level selection</button>
    `;
  
    document.getElementById("back-button").addEventListener("click", () => {
      location.reload();
    })
    };
  
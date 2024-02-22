// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
let questionsEl = document.getElementById('questions');
let startBtn = document.getElementById('start');
let initialsEl = document.getElementById('initials');
let submitBtn = document.getElementById('submit');
let choicesEl = document.getElementById('choices');
let feedbackEl = document.getElementById('feedback');
let timeEl = document.getElementById('time');
let highscoresEl = document.getElementById('highscores');

// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  document.getElementById('start-screen').classList.add('hide');

  // un-hide questions section
  questionsEl.classList.remove('hide');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timeEl.textContent = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  let currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.getElementById('question-title').textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over the choices for each question
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    // create a new button for each choice, setting the label and value for the button
    let choiceBtn = document.createElement('button');
    choiceBtn.textContent = currentQuestion.choices[i];
    choiceBtn.setAttribute('value', currentQuestion.choices[i]);

    // display the choice button on the page
    choicesEl.appendChild(choiceBtn);
  }
}

function questionClick(event) {
  if (!event.target.matches('button')) return;

  // identify the targeted button that was clicked on
  let selectedChoice = event.target.value;

  // check if user guessed wrong
  if (selectedChoice !== questions[currentQuestionIndex].answer) {
    // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 15;

    // display new time on page
    timeEl.textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();

    // display "wrong" feedback on page
    feedbackEl.textContent = 'Wrong!';
  } else {
    // play "right" sound effect
    sfxRight.play();

    // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    feedbackEl.textContent = 'Correct!';
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.classList.remove('hide');
  setTimeout(() => {
    feedbackEl.classList.add('hide');
  }, 500);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length || time <= 0) {
    // stop the timer
    clearInterval(timerId);

    // show end screen
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // hide the "questions" section
  questionsEl.classList.add('hide');

  // show end screen
  document.getElementById('end-screen').classList.remove('hide');

  // show final score
  document.getElementById('final-score').textContent = time;

  // stop the timer
  clearInterval(timerId);
}

function clockTick() {
  // update time
  time--;

  // update the element to display the new time value
  timeEl.textContent = time;

  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighScore() {
  // get the value of the initials input box
  let initials = initialsEl.value.trim();

  // make sure the value of the initials input box wasn't empty
  if (initials !== '') {
    // get scores from local storage or set to empty array
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

    // add the new initials and high score to the array
    highscores.push({ initials: initials, score: time });

    // sort highscores by score property in descending order
    highscores.sort((a, b) => b.score - a.score);

    // store the high score in local storage
    localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect the user to the high scores page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

// listen for "enter" key press to submit initials
initialsEl.addEventListener('keyup', checkForEnter);



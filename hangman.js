var words = [
	"dog",
  "cat",
  "elephant",
  "lion",
  "tiger",
  "rabbit",
  "mouse",
  "shark",
  "dolphin",
  "spider",
  "butterfly",
  "bird",
  "whale",
  "duck",
  "goat",
  "Horse",
  "Pig"
]

let answer = '';
let maxWrong = 8;
let mistakes = 0;
let guessed = [];
let wordStatus = null;

var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

function randomWord() {
  answer = words[Math.floor(Math.random() * words.length)];
}

function generateButtons() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
      <button
        class="btn btn-lg btn-primary m-2"
        id='` + letter + `'
        onClick="handleGuess('` + letter + `')"
        style="border-radius: 5px;"
      >
        ` + letter + `
      </button>
    `).join('');

  document.getElementById('keyboard').innerHTML = buttonsHTML;
}

function handleGuess(chosenLetter) {
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute('disabled', true);
  var button = document.getElementById(chosenLetter);
  button.style.backgroundColor = "lightblue";


  if (answer.indexOf(chosenLetter) >= 0) {
    guessedWord();
    saveGameState();
    checkIfGameWon();
  } else if (answer.indexOf(chosenLetter) === -1) {
    mistakes++;
    updateMistakes();
    saveGameState();
    checkIfGameLost();
    updateHangmanPicture();
  }
  
}

function updateHangmanPicture() {
  switch(mistakes)
  {
    case 1:
      //Draw head
      ctx.beginPath();
      ctx.arc(260, 110, 30, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 2:
      // Draw body
      ctx.beginPath();
      ctx.moveTo(260, 140);
      ctx.lineTo(260, 270);
      ctx.stroke();
      break;
    case 3:
      // Draw the left arm
      ctx.beginPath();
      ctx.moveTo(260, 200);
      ctx.lineTo(200, 140);
      ctx.stroke();
      break;
    case 4:
      // Draw the right arm
      ctx.beginPath();
      ctx.moveTo(260, 200);
      ctx.lineTo(320, 140);
      ctx.stroke();
      break;
    case 5:
      //Draw the right leg
      ctx.beginPath();
      ctx.moveTo(260, 270);
      ctx.lineTo(320, 360);
      ctx.stroke();
      break;
    case 6:
       //Draw the left leg
       ctx.beginPath();
       ctx.moveTo(260, 270);
       ctx.lineTo(200, 360);
       ctx.stroke();
       break;
    case 7:
      //Draw eyes
      ctx.beginPath();
      ctx.arc(270, 100, 3, 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(250, 100, 3, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 8:
      //Draw mouth
      ctx.beginPath();
      ctx.arc(260, 120, 5, Math.PI,  0);
      ctx.stroke();
      break;
  }
}

function checkIfGameWon() {
  if (wordStatus === answer) {
    document.getElementById('keyboard').innerHTML = 'You Won!!!';
    localStorage.clear()
  }
}

function checkIfGameLost() {
  if (mistakes === maxWrong) {
    document.getElementById('wordSpotlight').innerHTML = 'The answer was: ' + answer;
    document.getElementById('keyboard').innerHTML = 'You Lost!!!';
    localStorage.clear()
  }
}

function guessedWord() {
  wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');

  document.getElementById('wordSpotlight').innerHTML = wordStatus;
}

function updateMistakes() {
  document.getElementById('mistakes').innerHTML = mistakes;
}

function reset() {
  mistakes = 0;
  guessed = [];
  

  randomWord();
  guessedWord();
  updateMistakes();
  generateButtons();
  drawStart();
  localStorage.clear()

}

function drawStart()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(30, 400); // Starting point of the line
  ctx.lineTo(30, 30); // Ending point of the line
  ctx.lineTo(260, 30); 
  ctx.lineTo(260, 80);
  ctx.moveTo(30, 370);
  ctx.lineTo(45, 400);
  ctx.moveTo(30, 370);
  ctx.lineTo(15, 400);
  ctx.moveTo(30, 45);
  ctx.lineTo(45, 30);


  ctx.stroke(); 

}

// Save the canvas state to local storage
function saveGameState() {
  // Save the canvas element
  var canvasState = {
    width: canvas.width,
    height: canvas.height,
    dataURL: canvas.toDataURL()
  };
  localStorage.setItem('canvasState', JSON.stringify(canvasState));

  // Save the context state
  var contextState = {
    fillStyle: canvas.getContext('2d').fillStyle,
    strokeStyle: canvas.getContext('2d').strokeStyle,
    lineWidth: canvas.getContext('2d').lineWidth
  };
  localStorage.setItem('contextState', JSON.stringify(contextState));

  localStorage.setItem('answer', answer);
  localStorage.setItem('mistakes', mistakes);
  localStorage.setItem('guessed', JSON.stringify(guessed));
  localStorage.setItem('wordStatus', wordStatus);

}

function loadGameState() {
  // Load the canvas element
  var canvasState = JSON.parse(localStorage.getItem('canvasState'));
  canvas.width = canvasState.width;
  canvas.height = canvasState.height;
  var img = new Image();
  img.src = canvasState.dataURL;
  img.onload = function() {
    canvas.getContext('2d').drawImage(img, 0, 0);
  };

  // Load the context state
  var contextState = JSON.parse(localStorage.getItem('contextState'));
  canvas.getContext('2d').fillStyle = contextState.fillStyle;
  canvas.getContext('2d').strokeStyle = contextState.strokeStyle;
  canvas.getContext('2d').lineWidth = contextState.lineWidth;

  answer = localStorage.getItem("answer");
  mistakes = localStorage.getItem("mistakes");
  guessed = JSON.parse(localStorage.getItem("guessed"));
  wordStatus = localStorage.getItem("wordStatus");

  updateMistakes();
}

if (localStorage.getItem("mistakes") === null) {
  randomWord();
  drawStart();
}
else{
  loadGameState();
  guessedWord();
}


generateButtons();
document.getElementById('maxWrong').innerHTML = maxWrong;


import { startStopwatch, stopwatchTime } from './components/Stopwatch.js'
import { addLogRow, clearLog, toggleLog } from './components/Log.js'

const ANSWER_LIMIT 			 = 10e5
const MULTIPLIER_LIMIT   = 10e2
const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 	'Backspace', 'ArrowLeft', 'ArrowRight']
// Elements
const toggleLogButton	= document.getElementById('toggleLogButton')		
const clearLogButton	= document.getElementById('clearLogButton')
const mathExpression 	= document.getElementById('mathExpression')
const startButton  	 	= document.getElementById('start')
const checkButton 	 	= document.getElementById('check')
const correctIcon 	 	= document.getElementById('correctIcon')
const wrongIcon			 	= document.getElementById('wrongIcon')
const stopwatch			  = document.getElementById('stopwatch')
const logTable				= document.getElementById('logTable')
const answerInput 		= document.getElementById('answerInput')

let stopwatchId		= null
let correctAnswer = null		

window  .addEventListener('load',    onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup',   onKeyup)
document.addEventListener('click',   onClick)

// Handlers
function onLoad() {
	clearLogButton.hidden = true
	mathExpression.hidden = true
	correctIcon.hidden 		= true
	wrongIcon.hidden 			= true
	logTable.hidden 			= true
	checkButton.disabled 	= true
	answerInput.disabled  = true
}

function onKeydown(event) {
	if (event.target === answerInput) onKeydownInput(event)
}

function onKeyup(event) {
	if (event.target === answerInput && event.key === 'Enter') onCheck()
}

function onClick(event) {
	if (event.target === stopwatch)     	onStop()
	if (event.target === startButton)   	onStart()
	if (event.target === checkButton)   	onCheck()
	if (event.target === clearLogButton)  clearLog()
	if (event.target === toggleLogButton)	toggleLog()
	
	// Close log if click outside of log
	if ( !logTable.hidden && !event.target.closest('#log') ) toggleLog()		
}

// Implementation
function onKeydownInput(event) {
	if ( !( VALID_INPUT_VALUES.includes(event.key) ) || event.key === ' ' ) {
		event.preventDefault()
	}
}

function onCheck() {
	let expression = mathExpression.textContent
	let userAnswer = Number(answerInput.value)
	let isCorrect  = correctAnswer === +userAnswer

	// Check
	checkAnswer(isCorrect)

	if (stopwatchId) {
		// Add
		addLogRow( { expression,
							 	 userAnswer,
							 	 correctAnswer,
							 	 isCorrect,
							 	 stopwatchTime } )

		// Clear
		clearInterval(stopwatchId)
	}

	// Start & SaveId
	stopwatchId = startStopwatch(stopwatch)

	// Next expression
	updateExpression()
}

function onStart() {
	mathExpression.hidden = false
	startButton.hidden 		= true
	checkButton.disabled 	= false
	answerInput.disabled 	= false

	stopwatch.classList.remove('stopwatch--timestop')

	// First expression
	updateExpression()
	
	// Start & SaveId
	stopwatchId = startStopwatch(stopwatch)
}

function onStop() {
	clearInterval(stopwatchId)

	stopwatch.classList.add('stopwatch--timestop')

	mathExpression.hidden = true
	startButton.hidden 		= false
	checkButton.disabled 	= true
	answerInput.disabled	= true
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    correctIcon.hidden = false
    answerInput.classList.add('correct-input')

    setTimeout(() => {
      correctIcon.hidden = true
      answerInput.classList.remove('correct-input')
    }, 700)

  } else {
    wrongIcon.hidden = false
    answerInput.classList.add('wrong-input')

    setTimeout(() => {
      wrongIcon.hidden = true
      answerInput.classList.remove('wrong-input')
    }, 700)
  }
}

function updateExpression() {
	const firstNum  = getRandomMultiplier(2, 20)
	const secondNum = getRandomMultiplier(2, 20)

	correctAnswer = firstNum * secondNum

	renderExpression(firstNum, secondNum)
	clearAnswerInput()
}

function renderExpression(firstNum, secondNum) {
	mathExpression.textContent = `${firstNum} * ${secondNum}`
}

function clearAnswerInput() {
	answerInput.value = ''
}

function getRandomMultiplier(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min)) 
}

// For tests
export { getRandomMultiplier }
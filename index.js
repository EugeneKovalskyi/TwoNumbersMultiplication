const { startStopwatch, stopwatchTime } = require('./components/Stopwatch.js')
const { addLogRow, calculateResults, clearLog, allAnswerRows } = require('./components/Log.js')

const ANSWER_LIMIT 			 = 10e5
const MULTIPLIER_LIMIT   = 10e2
const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 	'Backspace', 'ArrowLeft', 'ArrowRight']
// Elements
const toggleLogButton	= document.getElementById('toggleLogButton')		
const clearLogButton	= document.getElementById('clearLogButton')
const mathExpression 	= document.getElementById('mathExpression')
const logContainer	  = document.getElementById('logContainer')								
const startButton  	 	= document.getElementById('start')
const checkButton 	 	= document.getElementById('check')
const correctIcon 	 	= document.getElementById('correctIcon')
const wrongIcon			 	= document.getElementById('wrongIcon')
const stopwatch			  = document.getElementById('stopwatch')
const logTable				= document.getElementById('logTable')
const input 				 	= document.getElementById('input')

let stopwatchId		= null
let correctAnswer = null		

window  .addEventListener('load',    onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup',   onKeyup)
document.addEventListener('click',   onClick)

// Handlers
function onLoad() {
	clearLogButton.hidden 	= true
	mathExpression.hidden 	= true
	correctIcon		.hidden 	= true
	wrongIcon			.hidden 	= true
	logTable			.hidden 	= true
	checkButton		.disabled = true
	input					.disabled = true
}

function onKeydown(event) {
	if (event.target === input) onKeydownInput(event)
}

function onKeyup(event) {
	if (event.target === input && event.key === 'Enter') onCheck()
}

function onClick(event) {
	if (event.target === stopwatch)     	onStop()
	if (event.target === startButton)   	onStart()
	if (event.target === checkButton)   	onCheck()
	if (event.target === clearLogButton)  clearLog()
	if (event.target === toggleLogButton)	toggleLog()
	
	// Close log if click outside of log
	if ( !logTable.hidden && !event.target.closest('#logContainer') ) toggleLog()		
}

// Implementation
function onCheck() {
	let expression = mathExpression.textContent
	let userAnswer = Number(input.value)
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

function onKeydownInput(event) {
	if ( !( VALID_INPUT_VALUES.includes(event.key) ) || event.key === ' ' ) {
		event.preventDefault()
	}
}

function onStart() {
	mathExpression.hidden 	= false
	startButton		.hidden 	= true
	checkButton		.disabled = false
	input					.disabled = false

	stopwatch.classList.remove('timestop')

	// First expression
	updateExpression()
	
	// Start & SaveId
	stopwatchId = startStopwatch(stopwatch)
}

function onStop() {
	clearInterval(stopwatchId)

	stopwatch.classList.add('timestop')

	mathExpression.hidden 	= true
	startButton		.hidden 	= false
	checkButton		.disabled = true
	input					.disabled	= true
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    correctIcon.hidden = false
    input.classList.add('right-answer')

    setTimeout(() => {
      correctIcon.hidden = true
      input.classList.remove('right-answer')
    }, 700)

  } else {
    wrongIcon.hidden = false
    input.classList.add('wrong-answer')

    setTimeout(() => {
      wrongIcon.hidden = true
      input.classList.remove('wrong-answer')
    }, 700)
  }
}

function updateExpression() {
	const firstNum  = getRandomMultiplier(2, 20)
	const secondNum = getRandomMultiplier(2, 20)

	correctAnswer = firstNum * secondNum

	renderExpression(firstNum, secondNum)
	clearInput()
}

function renderExpression(firstNum, secondNum) {
	mathExpression.textContent = `${firstNum} * ${secondNum}`
}

function toggleLog() {
	logTable			.hidden = !logTable.hidden
	clearLogButton.hidden = !clearLogButton.hidden

	logContainer	 .classList.toggle('log-visible')
	toggleLogButton.classList.toggle('show-log')

	// Calculation results
	if ( !logTable.hidden && allAnswerRows.length ) calculateResults()
}

function clearInput() {
	input.value = ''
}

function getRandomMultiplier(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min)) 
}

// For tests
module.exports = { getRandomMultiplier }
import { startStopwatch, stopwatchTime } from './Stopwatch.js'

const ANSWER_LIMIT 			 = 10e5
const MULTIPLIER_LIMIT   = 10e2
const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 	'Backspace', 'ArrowLeft', 'ArrowRight']
// Elements
const mathExpression 		 = document.getElementById('mathExpression')
const startButton  			 = document.getElementById('start')
const checkButton 			 = document.getElementById('check')
const rightIcon 				 = document.getElementById('rightIcon')
const wrongIcon					 = document.getElementById('wrongIcon')
const stopwatch					 = document.getElementById('stopwatch')								
const input 						 = document.getElementById('input')


const allAnswerLogs	= []

let stopwatchId		  = null
let correctAnswer   = null		

window  .addEventListener('load',    onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup',   onKeyup)
document.addEventListener('click',   onClick)

// Handlers
function onLoad() {
	mathExpression.hidden = true
	rightIcon.hidden   		= true
	wrongIcon.hidden   		= true
	checkButton.disabled 	= true
	input.disabled     		= true
}

function onKeydown(event) {
	if (event.target === input) onKeydownInput(event)
}

function onKeyup(event) {
	if (event.target === input && event.key === 'Enter') onCheck()
}

function onClick(event) {
	if (event.target === checkButton)   onCheck()
	if (event.target === startButton)   onStart()
	if (event.target === stopwatch)     onStop()
}

// Implementation
function onCheck() {
	let expression = mathExpression.textContent
	let userAnswer = input.value
	let isCorrect  = correctAnswer === +userAnswer

	// Check
	checkAnswer(isCorrect)

	// PushLog 
	if (stopwatchId) {
		allAnswerLogs.push({
			expression,
			userAnswer,
			correctAnswer,
			isCorrect,
			stopwatchTime,
		})

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
	mathExpression.hidden = false
	startButton.hidden 		= true
	checkButton.disabled 	= false
	input.disabled     		= false

	stopwatch.classList.remove('timestop')

	// First expression
	updateExpression()
	
	// Start & SaveId
	stopwatchId = startStopwatch(stopwatch)
}

function onStop() {
	clearInterval(stopwatchId)

	stopwatch.classList.add('timestop')

	mathExpression.hidden = true
	startButton.hidden 		= false
	checkButton.disabled  = true
	input.disabled     		= true
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    rightIcon.hidden = false
    input.classList.add('right-answer')

    setTimeout(() => {
      rightIcon.hidden = true
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

function clearInput() {
	input.value = ''
}

function getRandomMultiplier(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min)) 
}
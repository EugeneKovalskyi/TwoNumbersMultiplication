import { startStopwatch, stopwatchTime } from './components/Stopwatch.js'
import { addLogRow, clearLog, toggleLog } from './components/Log.js'
import { toggleSettings, getRange } from "./components/Settings.js";

const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 	'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete']
// Elements
const toggleLogButton			 = document.getElementById('toggleLogButton')		
const clearLogButton			 = document.getElementById('clearLogButton')
const mathExpression 			 = document.getElementById('mathExpression')
const startButton  	 			 = document.getElementById('start')
const checkButton 	 			 = document.getElementById('check')
const correctIcon 	 			 = document.getElementById('correctIcon')
const wrongIcon			 			 = document.getElementById('wrongIcon')
const stopwatch			  		 = document.getElementById('stopwatch')
const logTable						 = document.getElementById('logTable')
const answerInput 				 = document.getElementById('answerInput')
const toggleSettingsButton = document.getElementById('toggleSettingsButton')
const settingsContainer 	 = document.getElementById('settingsContainer')
const stopwatchCheckbox		 = document.getElementById('stopwatchCheckbox')
const autocheckCheckbox    = document.getElementById('autocheckCheckbox')
const soundCheckbox				 = document.getElementById('soundCheckbox')
const themeCheckbox				 = document.getElementById('themeCheckbox')

const soundCorrectAnswer = new Audio('sound/correctAnswer.mp3')
const soundWrongAnswer   = new Audio('sound/wrongAnswer.mp3')

let stopwatchId		= null
let correctAnswer = null

window  .addEventListener('load',    onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup',   onKeyup)
document.addEventListener('click',   onClick)

// Handlers
function onLoad() {
	settingsContainer.hidden = true
	clearLogButton.hidden 	 = true
	mathExpression.hidden 	 = true
	correctIcon.hidden 			 = true
	wrongIcon.hidden 				 = true
	logTable.hidden 				 = true
	checkButton.disabled 		 = true
	answerInput.disabled  	 = true
}

function onKeydown(event) {
	const target = event.target

	// Restrict number-typed input to VALID_INPUT_VALUES
	if ( !VALID_INPUT_VALUES.includes(event.key) 
		|| event.key === ' ' )  
	{ 
		event.preventDefault() 
	}

		// Limit input answer to 6 digits
	if ( target.closest('#answerInput') 
		&& target.value.length === 6  
		&& !VALID_INPUT_VALUES.slice(10).includes(event.key)) 
	{ 
		event.preventDefault() 
	}

	// Limit input range to 3 digits
	if ( target.closest('#range') 
		&& target.value.length === 3  
		&& !VALID_INPUT_VALUES.slice(10).includes(event.key)) 
	{ 
		event.preventDefault() 
	}
}

function onKeyup(event) {
	const target = event.target

	// Check on ENTER
	if ( target === answerInput && event.key === 'Enter' ) 
	{
		onCheck()
	}

	// Autocheck correct answer
	if ( target === answerInput 
		&& autocheckCheckbox.checked 
		&& +target.value === correctAnswer ) 
	{
		onCheck()
	}

}

function onClick(event) {
	const target = event.target

	if (target === stopwatch) 						onStop()
	if (target === startButton)   				onStart()
	if (target === checkButton)   				onCheck()
	if (target === clearLogButton)  			clearLog()
	if (target === toggleLogButton)				toggleLog()
	if (target === toggleSettingsButton)	toggleSettings()
	if (target === stopwatchCheckbox)			toggleStopwatch()
	if (target === themeCheckbox) 				toggleTheme()
	
	// Close log if click outside of log window
	if ( !logTable.hidden && !event.target.closest('#log') ) 
	{
		toggleLog()		
	}

	// Close log if click outside of settings window
	if ( !settingsContainer.hidden && !event.target.closest('#settings') ) 
	{
		toggleSettings()		
		onStop()
		updateExpression()
	}
}

// Implementation
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
		if (soundCheckbox.checked) soundCorrectAnswer.play()

    correctIcon.hidden = false
    answerInput.classList.add('answer__input--correct')

    setTimeout(() => {
      correctIcon.hidden = true
      answerInput.classList.remove('answer__input--correct')
    }, 700)

  } else {
		if (soundCheckbox.checked) soundWrongAnswer.play()

    wrongIcon.hidden = false
    answerInput.classList.add('answer__input--wrong')

    setTimeout(() => {
      wrongIcon.hidden = true
      answerInput.classList.remove('answer__input--wrong')
    }, 700)
  }
}

function updateExpression() {
	const range 		= getRange() // array
	const firstNum  = getRandomMultiplier(...range)
	const secondNum = getRandomMultiplier(...range)

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

function toggleStopwatch() {
	stopwatch.hidden = !stopwatch.hidden
}

function toggleTheme() {
	document.body.classList.toggle('body--light')
}

// For tests
export { getRandomMultiplier }
import { startStopwatch, stopwatchTime } from './components/Stopwatch.js'
import { addLogRow, clearLog, toggleLog } from './components/Log.js'
import { toggleSettings, getRange, getMs } from "./components/Settings.js";

const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 	'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete']
// Elements
const app									 = document.getElementById('app')
const landscapeOrientMsg	 = document.getElementById('landscapeOrientMsg')
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
const autocheckDelay   		 = document.getElementById('autocheckDelay')

const soundCorrectAnswer = new Audio('sound/correctAnswer.mp3')
const soundWrongAnswer   = new Audio('sound/wrongAnswer.mp3')

let stopwatchId		= null
let correctAnswer = null
let autocheckId 	= null
let delay 				= null

window.addEventListener('load', onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup', onKeyup)
document.addEventListener('click', onClick)
screen.orientation.addEventListener('change', onOrientChange)

// Handlers
function onLoad() {
	landscapeOrientMsg.hidden = true
	settingsContainer.hidden  = true
	clearLogButton.hidden 	  = true
	mathExpression.hidden 	  = true
	correctIcon.hidden 			  = true
	wrongIcon.hidden 				  = true
	logTable.hidden 				  = true
	checkButton.disabled 		  = true
	answerInput.disabled  	  = true

	// to local storage
	if (stopwatchCheckbox.checked) stopwatch.hidden = false
	else stopwatch.hidden = true

	if (autocheckCheckbox.checked) {
		delay = 500

		checkButton.hidden 		= true
		autocheckDelay.hidden = false
	} else {
		checkButton.hidden 		= false
		autocheckDelay.hidden = true
	}
}

function onKeydown(event) {
	const target = event.target

	// Autocheck answer
	if ( target === answerInput && autocheckCheckbox.checked ) {
		clearTimeout(autocheckId)
		autocheckId = setTimeout(onCheck, delay)
	}

	// Restrict number-typed input to VALID_INPUT_VALUES
	if ( !VALID_INPUT_VALUES.includes(event.key) 
		|| event.key === ' ' )  
	{ 
		event.preventDefault() 
	}

	// Restrict input answer to 6 digits
	if ( target.closest('#answerInput') ) restrictNumInput(6, event)

	// Restrict input range to 3 digits
	if ( target.closest('#range') ) restrictNumInput(4, event)
}

function onKeyup(event) {
	const target = event.target

	// Check on ENTER
	if ( target === answerInput 
		&& event.key === 'Enter'
		&& !autocheckCheckbox.checked ) {
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
	if (target === stopwatchCheckbox)			toggleStopwatch()
	if (target === themeCheckbox) 				toggleTheme()

	if (target === toggleSettingsButton)	{
		toggleSettings()
		onStop()
	}
	
	if (target === autocheckCheckbox) {
		if (autocheckCheckbox.checked) {
			autocheckDelay.hidden = false
			checkButton.hidden 		= true
		}	else {
			autocheckDelay.hidden = true
			checkButton.hidden    = false
		}
	}

	if ( target.classList.contains('autocheck__radio') ) 
	{
		delay = getMs(target)
	}

	// Close log if click outside of log window
	if ( !logTable.hidden && !event.target.closest('#log') ) 
	{
		toggleLog()		
	}

	// Close log if click outside of settings window
	if ( !settingsContainer.hidden && !event.target.closest('#settings') ) 
	{
		toggleSettings()	
		// ...and apply range if was changed
		updateExpression()
	}
}

function onOrientChange(event) {
	const target = event.target

	if ( target.type.includes('landscape') ) {
		landscapeOrientMsg.hidden = false
		app.hidden 								= true

	} else {
		landscapeOrientMsg.hidden = true
		app.hidden 							  = false
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

	if (autocheckCheckbox.checked) checkButton.hidden = true
	else checkButton.hidden = false

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
    }, 500)

  } else {
		if (soundCheckbox.checked) soundWrongAnswer.play()

    wrongIcon.hidden = false
    answerInput.classList.add('answer__input--wrong')

    setTimeout(() => {
      wrongIcon.hidden = true
      answerInput.classList.remove('answer__input--wrong')
    }, 500)
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

function restrictNumInput(characterNum, event) {
	if ( event.target.value.length === characterNum 
		&& !VALID_INPUT_VALUES.slice(10).includes(event.key)) 
	{ 
		event.preventDefault() 
	}
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
import { startStopwatch, stopwatchTime } from './components/Stopwatch.js'
import { addLogRow, clearLog, toggleLog } from './components/Log.js'
import { toggleSettings, getMs } from "./components/Settings.js";
import { onNumpad } from './components/Numpad.js';

const CORRECTNESS_RENDERING_DELAY = 500
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
const stopwatchCheckbox		 = document.getElementById('stopwatchCheckbox')
const settingsContainer 	 = document.getElementById('settingsContainer')
const autocheckCheckbox    = document.getElementById('autocheckCheckbox')
const soundCheckbox				 = document.getElementById('soundCheckbox')
const themeCheckbox				 = document.getElementById('themeCheckbox')
const autocheckDelay   		 = document.getElementById('autocheckDelay')
const numpad 					 		 = document.getElementById('numpad')
const numpadCheckbox			 = document.getElementById('numpadCheckbox')
const rangeLeft 					 = document.getElementById('rangeLeft')
const rangeRight 					 = document.getElementById('rangeRight')

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

// Handlers
function onLoad() {
	if (!localStorage.length) {
		localStorage.setItem('range', '2-19')
		localStorage.setItem('autocheck', '0')
		localStorage.setItem('delay', '500')
		localStorage.setItem('stopwatch', '1')
		localStorage.setItem('numpad', '1')
		localStorage.setItem('sound', '1')
		localStorage.setItem('theme', '1')
	}

	settingsContainer.hidden  = true
	clearLogButton.hidden 	  = true
	mathExpression.hidden 	  = true
	correctIcon.hidden 			  = true
	wrongIcon.hidden 				  = true
	logTable.hidden 				  = true
	checkButton.disabled 		  = true
	answerInput.disabled  	  = true

	// Range
	;[ rangeLeft.value, rangeRight.value ] = localStorage.getItem('range').split('-')
	
	// Stopwatch
	const isStopwatch = Boolean(+localStorage.getItem('stopwatch'))
	stopwatchCheckbox.checked = isStopwatch
	stopwatch.hidden 					= !isStopwatch
	
	// Autocheck
	const isAutocheck = Boolean(+localStorage.getItem('autocheck'))
	autocheckCheckbox.checked = isAutocheck
	autocheckDelay.hidden 		= !isAutocheck

	// Autocheck delay
	delay = +localStorage.getItem('delay')
	switch (delay) {
		case 300:
			document.getElementById('quickDelay').checked = true
			break
		
		case 500:
			document.getElementById('mediumDelay').checked = true
			break

		case 700:
			document.getElementById('slowDelay').checked = true
	}

	// Numpad
	const isNumpad = Boolean(+localStorage.getItem('numpad'))
	numpadCheckbox.checked 	= isNumpad
	numpad.hidden 					= !isNumpad

	// Hide Check button if autocheck or numpad
	if (autocheckCheckbox.checked || numpadCheckbox.checked) {
		checkButton.hidden = true
	}

	// Sound
	soundCheckbox.checked = Boolean(+localStorage.getItem('sound'))

	// Theme
	const isDarkTheme = Boolean(+localStorage.getItem('theme'))
	themeCheckbox.checked = isDarkTheme
	if (themeCheckbox.checked) document.body.classList.remove('body--light')
	else document.body.classList.add('body--light')
}

function onKeydown(event) {
	const target = event.detail.target ?? event.target

	// Autocheck answer without numpad
	if ( target === answerInput ) {
		restrictNumInput(8, event)

		if ( autocheckCheckbox.checked ) {
			clearTimeout(autocheckId)
			autocheckId = setTimeout(onCheck, delay)
		}
	}

	// Autocheck answer with numpad
	if ( event.detail.target && autocheckCheckbox.checked ) {
		clearTimeout(autocheckId)
		autocheckId = setTimeout(onCheck, delay)
	}

	// Restrict number-typed input to VALID_INPUT_VALUES
	if ( !VALID_INPUT_VALUES.includes(event.key) 
		|| event.key === ' ' ) { 
		event.preventDefault() 
	}

		
	if ( target === rangeLeft || target === rangeRight) {
		restrictNumInput(4, event)

		localStorage.setItem('range', `${rangeLeft.value}-${rangeRight.value}`)
	}
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

	if (target === stopwatch) 				onStop()
	if (target === startButton)   		onStart()
	if (target === checkButton)   		onCheck()
	if (target === clearLogButton)  	clearLog()
	if (target === toggleLogButton)		toggleLog()
	if (target === stopwatchCheckbox)	toggleStopwatch()

	if (target === soundCheckbox) {
		if (target.checked) {
			localStorage.setItem('sound', '1')
		} else {
			localStorage.setItem('sound', '0')
		}
	}

	if (target === themeCheckbox) {
		if (target.checked) {
			document.body.classList.remove('body--light')
			localStorage.setItem('theme', '1')
		} else {
			document.body.classList.add('body--light')
			localStorage.setItem('theme', '0')
		}
	}

	// Settings button
	if (target === toggleSettingsButton)	{
		toggleSettings()
		onStop()
	}
	
	// Autocheck
	if (target === autocheckCheckbox) {
		if (target.checked) {
			localStorage.setItem('autocheck', '1')
			autocheckDelay.hidden = false
			checkButton.hidden = true
		}	else {
			localStorage.setItem('autocheck', '0')
			autocheckDelay.hidden = true

			if (!numpadCheckbox.checked) checkButton.hidden = false
		}
	}

	// Autocheck delay
	if ( target.classList.contains('autocheck__radio') ) {
		delay = getMs(target)

		localStorage.setItem('delay', delay)
	}

	// Numpad
	if ( target === numpadCheckbox ) {
		if (target.checked) {
			localStorage.setItem('numpad', '1')
			numpad.hidden = false
			checkButton.hidden = true
		} else {
			localStorage.setItem('numpad', '0')
			numpad.hidden = true

			if (!autocheckCheckbox.checked) checkButton.hidden = false
		}
	}

	// Numpad input
	if ( target.hasAttribute('data-key') && !answerInput.disabled ) {
		onNumpad(event)
	}

	// Close log if click outside of log window
	if ( !logTable.hidden && !event.target.closest('#log') ) {
		toggleLog()		
	}

	// Close log if click outside of settings window
	if ( !settingsContainer.hidden && !event.target.closest('#settings') ) {
		toggleSettings()	
		// ... and save range to localStorage
		localStorage.setItem('range', `${rangeLeft.value}-${rangeRight.value}`)
	}
}

// Implementation
function onCheck() {
	let expression = mathExpression.textContent
	let userAnswer = +answerInput.value
	let isCorrect  = correctAnswer === +userAnswer

	renderCorrectness(isCorrect)

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

	setTimeout(() => {
			// Start & SaveId
			stopwatchId = startStopwatch(stopwatch)
			// Next expression
			updateExpression()
	}, delay)
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

function renderCorrectness(isCorrect) {
  if (isCorrect) {
		if (soundCheckbox.checked) soundCorrectAnswer.play()

    correctIcon.hidden = false
    answerInput.classList.add('answer__input--correct')

    setTimeout(() => {
      correctIcon.hidden = true
      answerInput.classList.remove('answer__input--correct')
    }, CORRECTNESS_RENDERING_DELAY)

  } else {
		if (soundCheckbox.checked) soundWrongAnswer.play()

    wrongIcon.hidden = false
    answerInput.classList.add('answer__input--wrong')

    setTimeout(() => {
      wrongIcon.hidden = true
      answerInput.classList.remove('answer__input--wrong')
    }, CORRECTNESS_RENDERING_DELAY)
  }
}

function updateExpression() {
	const min = +rangeLeft.value
	const max = +rangeRight.value
	const firstNum  = getRandomMultiplier(min, max)
	const secondNum = getRandomMultiplier(min, max)

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

function restrictNumInput(numOfChar, event) {
	if ( event.target.value.length === numOfChar 
		&& !VALID_INPUT_VALUES.slice(10).includes(event.key)) { 
		event.preventDefault() 
	}
}

function getRandomMultiplier(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min)) 
}

function toggleStopwatch() {
	stopwatch.hidden = !stopwatch.hidden

	if (stopwatch.hidden) localStorage.setItem('stopwatch', '0')
	else localStorage.setItem('stopwatch', '1')
}

export { onCheck }

// For tests
export { getRandomMultiplier }
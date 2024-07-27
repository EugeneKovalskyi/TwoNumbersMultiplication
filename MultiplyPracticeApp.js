const ANSWER_LIMIT 			 = 10e5
const MULTIPLIER_LIMIT   = 10e2
const VALID_INPUT_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
													 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight']

const rightIcon 						= document.getElementById('rightIcon')
const wrongIcon							= document.getElementById('wrongIcon')
const firstMultiplierElem 	= document.getElementById('firstMultiplier')
const secondMultiplierElem 	= document.getElementById('secondMultiplier')
const checkButton 					= document.getElementById('check')
const input 								= document.getElementById('input')

let userAnswer 		  				= null
let correctAnswer   				= null

window.addEventListener('load', onLoad)
document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup', onKeyup)
document.addEventListener('click', onClick)

function onLoad() {
	rightIcon.hidden = true
	wrongIcon.hidden = true

	updateExp()
}

function onKeydown(event) {
	if (event.target === input) onKeydownInput(event)
}

function onKeyup(event) {
	if (event.target === input && event.key === 'Enter') onKeyupEnter()
}

function onKeyupEnter() {
	onClickCheck()
}

function onClick(event) {
	if (event.target === checkButton)  onClickCheck()
}

function onKeydownInput(event) {
	if ( !( VALID_INPUT_VALUES.includes(event.key) ) || event.key === ' ' ) {
		event.preventDefault()
	}
}

function updateExp() {
	const firstNumber  = getRandomMultiplier(2, 20)
	const secondNumber = getRandomMultiplier(2, 20)

	renderMultiplier(firstMultiplierElem, firstNumber)
	renderMultiplier(secondMultiplierElem, secondNumber)

	calculateCorrectAnswer(firstNumber, secondNumber)
	clearInput()
}

function onClickCheck() {
	setUserAnswer()

	if (correctAnswer === +userAnswer) {
		rightIcon.hidden = false
		setTimeout(() => rightIcon.hidden = true, 1000)	
	} else {
		wrongIcon.hidden = false
		setTimeout(() => wrongIcon.hidden = true, 1000)
	}

	updateExp()
}

function setUserAnswer() {
	userAnswer = input.value
}

function calculateCorrectAnswer(firstNumber, secondNumber) {
	correctAnswer = firstNumber * secondNumber
}

function renderMultiplier(elem, number) {
	elem.textContent = number
}

function clearInput() {
	userAnswer  = null
	input.value = ''
}

function getRandomMultiplier(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min)) 
}

module.exports = getRandomMultiplier
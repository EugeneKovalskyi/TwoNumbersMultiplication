import { onCheck } from "../index.js"

const answerInput = document.getElementById('answerInput')

function onNumpad(event) {
	const target = event.target

	if ( target.hasAttribute('data-key')) {
		const key = target.dataset.key
		const numpadEvent = new CustomEvent('keydown', { detail: { target } })
		
		if (key === 'Backspace') {
			answerInput.value = answerInput.value.slice(0, -1)

		}	else if (key === 'Check') {
			onCheck()

		} else if (answerInput.value.length < 6) {
			answerInput.value += key
			document.dispatchEvent(numpadEvent)
		}
	}
}

export { onNumpad }
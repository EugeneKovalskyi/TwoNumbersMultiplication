import { onCheck } from "../index.js"

const answerInput = document.getElementById('answerInput')

function onNumpad(event) {
  const target = event.target

  const key = target.dataset.key
  const numpadEvent = new CustomEvent('keydown', { detail: { target } })

  if (key === 'Backspace' && answerInput.value.length) {
    answerInput.value = answerInput.value.slice(0, -1)
    document.dispatchEvent(numpadEvent)

  } else if (key === 'Check' && answerInput.value.length) {
		onCheck()
		
  } else if (answerInput.value.length < 8) {
    answerInput.value += key
    document.dispatchEvent(numpadEvent)
  }
}

export { onNumpad }
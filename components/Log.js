const tableBody 	   = document.getElementById('tableBody')
const totalAnswersTd = document.getElementById('totalAnswers')
const averageTimeTd  = document.getElementById('averageTime')
const totalTimeTd 	 = document.getElementById('totalTime')				

const allAnswerRows  = []

function addLogRow( { expression, 
										  userAnswer, 
											correctAnswer, 
											isCorrect,
											stopwatchTime } ) {

  const tr 							= document.createElement('tr')
  const timeTd 					= document.createElement('td')
  const expressionTd 		= document.createElement('td')
  const userAnswerTd 		= document.createElement('td')
  const correctnessTd 	= document.createElement('td')
  const correctAnswerTd = document.createElement('td')

	tr.append( correctnessTd, 
						 expressionTd, 
						 timeTd, 
						 userAnswerTd,
						 correctAnswerTd )
		
		timeTd				 .textContent = stopwatchTime
		expressionTd	 .textContent = expression
		userAnswerTd	 .textContent = userAnswer
		correctAnswerTd.textContent = correctAnswer
		
		if (isCorrect) correctnessTd.textContent 	= '✔'
		else 					 correctnessTd.textContent  = '×'
		
		tableBody.append(tr)

		// All log data as array of objects
		allAnswerRows.push(arguments[0])
}

function calculateResults() {
		let totalTime 				  = 0
		let totalCorrectAnswers = 0

		for (let row of allAnswerRows) {
			totalTime += row.stopwatchTime

			if (row.isCorrect) totalCorrectAnswers++
		}

		totalTimeTd		.textContent = totalTime.toFixed(2)
		averageTimeTd	.textContent = ( totalTime / allAnswerRows.length ).toFixed(2)
		totalAnswersTd.textContent = `${totalCorrectAnswers} / ${allAnswerRows.length}`
}

function clearLog() {
	allAnswerRows	.length  		 = 0
	tableBody			.textContent = ''
	totalTimeTd		.textContent = '0'
	averageTimeTd	.textContent = '0'
	totalAnswersTd.textContent = '0'
}

export { addLogRow, calculateResults, clearLog, allAnswerRows }
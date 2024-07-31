let stopwatchTime = null

function startStopwatch (stopwatch) {
  // Seconds and centiseconds
  let s  = 0
  let cs = 1

	const stopwatchId = setInterval(() => {
    cs++

    // 60 seconds limit time
    if (s === 99 && cs === 99) {
      s             = 100
      cs            = 0
      stopwatchTime = 100

      clearInterval(stopwatchId)
    }

    if (cs === 99) {
      s++
      cs = 1
    }

    stopwatch.textContent = `${ (s  > 9) ? s : '0' + s }.${ (cs  > 9) ? cs : '0' + cs }`
    stopwatchTime = Number(`${s}.${cs}`)
  }, 10)

	return stopwatchId
}

export { startStopwatch, stopwatchTime }

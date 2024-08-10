// Elements
const settings 						 = document.getElementById('settings')
const toggleSettingsButton = document.getElementById('toggleSettingsButton')
const settingsContainer 	 = document.getElementById('settingsContainer')
const rangeLeft 					 = document.getElementById('rangeLeft')
const rangeRight 					 = document.getElementById('rangeRight')

function toggleSettings() {
	settings.classList.toggle('settings--visible')
	toggleSettingsButton.classList.toggle('settings__button--open')
	settingsContainer.hidden = !settingsContainer.hidden
}

function getRange() {
	const valueRangeLeft	= +rangeLeft.value
  const valueRangeRight = +rangeRight.value

	return [valueRangeLeft, valueRangeRight]
}

function getMs(target) {
	if (target.checked) return +target.value
}

export { toggleSettings, getRange, getMs }
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

function getMs(target) {
	if (target.checked) return +target.value
}

export { toggleSettings, getMs }
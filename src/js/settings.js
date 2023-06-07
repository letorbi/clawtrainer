import {VOICES, getVoices} from './speech.js';

var DEFAULT_SETTINGS = {
    'version': 4,
    'selectedBoardID': "bm1000",
    'showDefaultPrograms': true,
    'speechOutput': true,
    'soundOutput': true,
    'voice':    undefined
};

export var SETTINGS = {};

export function storeSettings() {
    window.localStorage.setItem('settings', JSON.stringify(SETTINGS));
}

export async function loadSettings() {
    if (window.localStorage.getItem('settings')) {
        let loaded_settings = JSON.parse(window.localStorage.getItem('settings'));
        SETTINGS = DEFAULT_SETTINGS;
        for (let prop in DEFAULT_SETTINGS) {
            if ((prop != 'version') &&  (Object.prototype.hasOwnProperty.call(loaded_settings, prop))) {
                SETTINGS[prop] = loaded_settings[prop];
            }
        }
        if (SETTINGS.version != DEFAULT_SETTINGS.version) {
            console.warn('Stored settings outdated. Partially restored.');
        }
    }
    else {
        SETTINGS = DEFAULT_SETTINGS;
        console.info('Using default settings.');
    }

    if (SETTINGS.voice === undefined) {
        console.warn('No voice selected. Selecting first system voice if available.');
        await getVoices();
        if (VOICES[0] !== undefined) {
            SETTINGS.voice = VOICES[0].voiceURI;
        }
    }
}

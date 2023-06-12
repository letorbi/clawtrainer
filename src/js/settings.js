/*
This file is part of Claw Trainer.

Copyright (c) 2023 Torben Haase & contributors
Copyright (c) 2020-2023 Daniel Schroer & contributors
Copyright (c) 2017-2020 Daniel Schroer

Claw Trainer is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

Claw Trainer is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with
Claw Trainer. If not, see <https://www.gnu.org/licenses/>.
*/

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

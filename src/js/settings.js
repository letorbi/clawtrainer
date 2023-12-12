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

import {makeObservable} from "./lib/observable.js";

import { getVoices } from './speech.js';

export var settings = makeObservable({
    version: 4,
    selectedBoardID: "bm1000",
    showDefaultPrograms: true,
    soundOutput: true,
    speechOutput: true,
    voice: undefined
});

export function saveSettings() {
    const json = JSON.stringify(settings);
    console.log(`saving: ${json}`);
    localStorage.setItem("settings", json);
}

export async function loadSettings() {
    const json = localStorage.getItem("settings");
    console.log(`loading: ${json}`);
    Object.assign(settings, JSON.parse(json));

    const voices = await getVoices();
    const [voice] = voices.filter(v => v.voiceURI === settings.voice);
    if (voice === undefined) {
        console.warn('Invalid voice. Selecting first system voice, if available.');
        settings.voice = voices[0]?.voiceURI;
    }
}

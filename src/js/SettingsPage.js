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

import {SETTINGS, storeSettings} from "./settings.js";
import {VOICES, getVoices, speak} from "./speech.js";


async function updateSettingsPage() {
    if (VOICES.length < 1) {
        await getVoices();
    }

    const voice_select = document.getElementById('select_voice');
    // Remove voice select options
    while (voice_select.firstChild) {
        voice_select.removeChild(voice_select.firstChild);
    }

    for (let i in VOICES) {
        const opt = document.createElement('option');
        opt.setAttribute('value', i);
        if (SETTINGS.voice === VOICES[i].voiceURI) {
            opt.defaultSelected = true;
        }
        const content = document.createTextNode(`${VOICES[i].name} (${VOICES[i].lang})`);
        opt.appendChild(content);
        voice_select.appendChild(opt);
    }
    voice_select.onchange = function selectVoice() {
        let v_num = voice_select.options[voice_select.selectedIndex].value;
        SETTINGS.voice = VOICES[v_num].voiceURI;
        storeSettings();
        let temp = SETTINGS['speechOutput'];
        SETTINGS['speechOutput'] = true;
        speak("Claw Trainer: Strong fingers for strong climbing");
        SETTINGS['speechOutput'] = temp;
    };

    let checkbox_showDefaultPrograms = document.getElementById('checkbox_showDefaultPrograms');
    if (SETTINGS.showDefaultPrograms) {
        checkbox_showDefaultPrograms.setAttribute('checked', 'checked');
    }
    checkbox_showDefaultPrograms.onchange = function setShowDefaultPrograms() {
        SETTINGS.showDefaultPrograms = this.checked;
        storeSettings();
    };

    let checkbox_speechOutput = document.getElementById('checkbox_speechOutput');
    if (SETTINGS.speechOutput) {
        checkbox_speechOutput.setAttribute('checked', 'checked');
    }
    checkbox_speechOutput.onchange = function setSpeechOutput() {
        SETTINGS.speechOutput = this.checked;
        storeSettings();
    };

    let checkbox_soundOutput = document.getElementById('checkbox_soundOutput');
    if (SETTINGS.soundOutput) {
        checkbox_soundOutput.setAttribute('checked', 'checked');
    }
    checkbox_soundOutput.onchange = function setSoundOutput() {
        SETTINGS.soundOutput = this.checked;
        storeSettings();
    };
}

export class SettingsPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Edit</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div id="settings_content">
                    <form id="form_settings" onsubmit="return false;">
                        <ul>
                            <li>
                                <i class="material-icons md-dark">visibility</i>
                                <label for="checkbox_showDefaultPrograms">Show built-in programs</label>
                                <div class="matbox">
                                    <input id="checkbox_showDefaultPrograms" type="checkbox" />
                                    <label for="checkbox_showDefaultPrograms"></label>
                                </div>
                            </li>

                            <li>
                                <i class="material-icons md-dark">notifications</i>
                                <label for="checkbox_soundOutput">Play sounds</label>
                                <div class="matbox">
                                    <input id="checkbox_soundOutput" type="checkbox" />
                                    <label for="checkbox_soundOutput"></label>
                                </div>
                            </li>

                            <li>
                                <i class="material-icons md-dark">record_voice_over</i>
                                <label for="checkbox_speechOutput">Speak instructions</label>
                                <div class="matbox">
                                    <input id="checkbox_speechOutput" type="checkbox" />
                                    <label for="checkbox_speechOutput"></label>
                                </div>
                            </li>

                            <li>
                                <div class="selbox">
                                    <label for="select_voice">Voice</label>
                                    <select id="select_voice"></select>
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
            </ion-content>
        `;
        updateSettingsPage();
    }
}

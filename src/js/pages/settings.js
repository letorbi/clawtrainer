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

import {ComponentElement} from "../lib/component.js";

import {settings, SETTINGS} from "../settings.js";
import {VOICES, getVoices, speak} from "../speech.js";

export class SettingsPage extends ComponentElement {
    async connectedCallback() {
        super.connectedCallback(html);

        if (VOICES.length < 1) {
            await getVoices();
        }

        const voice_select = document.getElementById("select_voice");
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

        settings.addObserver(this, 'voice', function () {
            //let temp = SETTINGS['speechOutput'];
            //SETTINGS['speechOutput'] = true;
            speak("Claw Trainer: Strong fingers for strong climbing");
            //SETTINGS['speechOutput'] = temp;
        }, false);
        voice_select.addEventListener("change", () => {
            // There is no easy way to prevent the default behaviour, so we just live with it.
            let v_num = voice_select.options[voice_select.selectedIndex].value;
            settings.data.voice = VOICES[v_num].voiceURI;
        }, false);

        const checkbox_showDefaultPrograms = document.getElementById("checkbox_showDefaultPrograms");
        settings.addObserver(this, 'showDefaultPrograms', function () {
            checkbox_showDefaultPrograms.checked = settings.data.showDefaultPrograms;
        }, true);
        checkbox_showDefaultPrograms.addEventListener("click", (evt) => {
            evt.preventDefault();
            settings.data.showDefaultPrograms = !settings.data.showDefaultPrograms;
        }, false);

        const checkbox_speechOutput = document.getElementById("checkbox_speechOutput");
        settings.addObserver(this, 'speechOutput', function () {
            checkbox_speechOutput.checked = settings.data.speechOutput;
        }, true);
        checkbox_speechOutput.addEventListener("click", (evt) => {
            evt.preventDefault();
            settings.data.speechOutput = !settings.data.speechOutput;
        }, false);

        const checkbox_soundOutput = document.getElementById("checkbox_soundOutput");
        settings.addObserver(this, 'soundOutput', function () {
            checkbox_soundOutput.checked = settings.data.soundOutput;
        }, true);
        checkbox_soundOutput.addEventListener("click", (evt) => {
            evt.preventDefault();
            settings.data.soundOutput = !settings.data.soundOutput;
        }, false);
    }
}

const html = `
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

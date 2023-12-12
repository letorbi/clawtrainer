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

import {SETTINGS} from "../settings.js";
import {getVoices, speak} from "../speech.js";

export class SettingsPage extends ComponentElement {
    async connectedCallback() {
        super.connectedCallback(html);

        const voices = await getVoices();

        const voice_select = document.getElementById("select_voice");
        for (let i in voices) {
            const opt = document.createElement('option');
            opt.setAttribute('value', i);
            if (SETTINGS.voice === voices[i].voiceURI) {
                opt.defaultSelected = true;
            }
            const content = document.createTextNode(`${voices[i].name} (${voices[i].lang})`);
            opt.appendChild(content);
            voice_select.appendChild(opt);
        }
        SETTINGS.addObserver(this, 'voice', function () {
            speak("Claw Trainer: Strong fingers for strong climbing", SETTINGS.voice);
        }, false);
        voice_select.addEventListener("change", () => {
            // There is no easy way to prevent the default behaviour, so we just live with it.
            let v_num = voice_select.options[voice_select.selectedIndex].value;
            SETTINGS.voice = voices[v_num].voiceURI;
        }, false);

        const checkbox_showDefaultPrograms = document.getElementById("checkbox_showDefaultPrograms");
        SETTINGS.addObserver(this, 'showDefaultPrograms', function () {
            checkbox_showDefaultPrograms.checked = SETTINGS.showDefaultPrograms;
        }, true);
        checkbox_showDefaultPrograms.addEventListener("click", (evt) => {
            evt.preventDefault();
            SETTINGS.showDefaultPrograms = !SETTINGS.showDefaultPrograms;
        }, false);

        const checkbox_speechOutput = document.getElementById("checkbox_speechOutput");
        SETTINGS.addObserver(this, 'speechOutput', function () {
            checkbox_speechOutput.checked = SETTINGS.speechOutput;
        }, true);
        checkbox_speechOutput.addEventListener("click", (evt) => {
            evt.preventDefault();
            SETTINGS.speechOutput = !SETTINGS.speechOutput;
        }, false);

        const checkbox_soundOutput = document.getElementById("checkbox_soundOutput");
        SETTINGS.addObserver(this, 'soundOutput', function () {
            checkbox_soundOutput.checked = SETTINGS.soundOutput;
        }, true);
        checkbox_soundOutput.addEventListener("click", (evt) => {
            evt.preventDefault();
            SETTINGS.soundOutput = !SETTINGS.soundOutput;
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

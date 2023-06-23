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

import { StatusBar } from "@capacitor/status-bar";
import { App } from '@capacitor/app';

import { loadPrograms } from './programs.js';
import { settings } from './settings.js';
import { getVoices } from './speech.js';

import { StartPage } from './pages/start.js';
import { EditPage } from './pages/edit.js';
import { RunPage } from './pages/run.js';
import { BoardsPage } from './pages/boards.js';
import { SettingsPage } from './pages/settings.js';
import { AboutPage } from './pages/about.js';

customElements.define('page-start', StartPage);
customElements.define('page-edit', EditPage);
customElements.define('page-run', RunPage);
customElements.define('page-boards', BoardsPage);
customElements.define('page-settings', SettingsPage);
customElements.define('page-about', AboutPage);

function saveSettings() {
    const json = JSON.stringify(settings);
    console.log(`saving: ${json}`);
    localStorage.setItem("settings", json);
}

async function loadSettings() {
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

window.addEventListener('load', async () => {
    await loadSettings();
    loadPrograms();
    StatusBar.hide(); // async, but we don't care
});

App.addListener('resume', async () => {
    await loadSettings();
});

App.addListener('pause', () => {
    saveSettings();
});

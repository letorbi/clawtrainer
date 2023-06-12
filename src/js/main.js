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

import { loadPrograms } from './programs.js';
import { loadSettings } from './settings.js';

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

async function init() {
    try {
        await StatusBar.hide();
    }
    catch (e) {
        console.warn(e.message);
    }

    await loadSettings();
    loadPrograms();
}

init();

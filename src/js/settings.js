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

import {Model} from "./lib/model.js";
import {getVoices} from "./speech.js";

class Settings extends Model {
    constructor() {
        super({
            version: 4,
            selectedBoardID: "bm1000",
            showDefaultPrograms: true,
            soundOutput: true,
            speechOutput: true,
            voice: undefined
        }, "settings");
    }

    async load() {
        super.load();
        const voices = await getVoices();
        const [selected_voice] = voices.filter(v => v.voiceURI === settings.data.voice);

        if (selected_voice === undefined) {
            console.warn('Invalid voice. Selecting first system voice if available.');
            if (voices[0] !== undefined) {
                settings.data.voice = voices[0].voiceURI;
            }
        }
    }
}

export var settings = new Settings();

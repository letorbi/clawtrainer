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

import { TextToSpeech } from '@capacitor-community/text-to-speech';

export async function speak(message, voiceURI) {
    const voices = await getVoices();
    const [voice] = voices.filter(v => v.voiceURI === voiceURI);
    if (voice !== undefined)
        await TextToSpeech.speak({
            text: message,
            lang: voice.lang,
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: voice,
            category: "ambient"
        });
    else
        console.warn(`no voice to speak: "${message}"`);
}

let _voices = null;
export async function getVoices() {
    if (_voices === null) {
        try {
            let {voices} = await TextToSpeech.getSupportedVoices();
            voices = voices.filter(v => v.lang.startsWith('en'));
            voices.sort(function(a,b) {
                if (a.lang > b.lang) {
                    return 1;
                  }
                  if (a.lang < b.lang) {
                    return -1;
                  }
                  return 0;
            });
            _voices = voices;
        }
        catch (e) {
            console.error("unable to get voices", e);
            _voices = [];
        }
    }
    return _voices;
}

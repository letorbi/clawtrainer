import { TextToSpeech } from '@capacitor-community/text-to-speech';

import {SETTINGS} from './settings.js';

export var VOICES = [];

export async function speak(message) {
    if (SETTINGS['speechOutput'] && SETTINGS.voice) {
        if (VOICES.length < 1) {
            await getVoices();
        }
        let selected_voice;
        for (let i in VOICES) {
            if (VOICES[i].voiceURI === SETTINGS.voice) {
                selected_voice = VOICES[i];
                break;
            }
        }
        console.info(`Speaking "${message}"`);
        await TextToSpeech.speak({
            text: message,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: selected_voice,
            category: 'ambient',
        });
    }
    else {
        console.warn(`Not speaking: "${message}"`);
    }
}

export async function getVoices() {
    try {
        console.log("getVoices");
        VOICES = [];
        const { voices } = await TextToSpeech.getSupportedVoices();
        console.log(voices);
        if (voices !== null) {
            for (let i = 0; i < voices.length ; i++) {
                let v = Array.isArray(voices) ? voices[i] : voices.item(i);
                if ((v.lang.startsWith('en')) && (v.localService === true)) {
                    // console.log(`name : ${v.name} lang: ${v.lang} localService: ${v.localService} voiceURI: ${v.voiceURI} default: ${v.default}`);
                    VOICES.push(v);
                }
            }
            VOICES.sort(function(a,b) {
                if (a.lang > b.lang) {
                    return 1;
                  }
                  if (a.lang < b.lang) {
                    return -1;
                  }
                  return 0;
            });
        }
        console.info(`Found ${VOICES.length} matching voices`) ;
    }
    catch (err) {
        console.error("Error while getting voices", err);
    }
}

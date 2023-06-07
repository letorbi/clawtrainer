import { soundEffect }  from "sound";
import {SETTINGS} from './settings.js';

export function ticSound() {
    if (SETTINGS['soundOutput']) {
        soundEffect(
            400,        //frequency
            0.02,       //attack
            0.02,       //decay
            "sine",     //waveform
            10,         //volume
            0,          //pan
            0,          //wait before playing
            1,          //pitch bend amount
            false,      //reverse
            0,          //random pitch range
            0,          //dissonance
            undefined,  //echo: [delay, feedback, filter]
            undefined   //reverb: [duration, decay, reverse?]
        );
    }
}

export function goSound() {
    if (SETTINGS['soundOutput']) {
        soundEffect(
            1046.5,     //frequency
            0,          //attack
            0.1,        //decay
            "sine",     //waveform
            10,         //Volume
            0,          //pan
            0,          //wait before playing
            0,          //pitch bend amount
            true,       //reverse bend
            0,          //random pitch range
            0,          //dissonance
            undefined,  //echo array: [delay, feedback, filter]
            undefined   //reverb array: [duration, decay, reverse?]
        );
    }
}

export function completedSound() {
    if (SETTINGS['soundOutput']) {
        soundEffect( 587.33, 0, 0.2, "square", 1, 0, 0);    //D
        soundEffect( 880   , 0, 0.2, "square", 1, 0, 0.1);  //A
        soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);  //High D
    }
}

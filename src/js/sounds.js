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

import { soundEffect }  from "sound";

function ticSound() {
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

function goSound() {
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

function completedSound() {
    soundEffect( 587.33, 0, 0.2, "square", 1, 0, 0);    //D
    soundEffect( 880   , 0, 0.2, "square", 1, 0, 0.1);  //A
    soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);  //High D
}

export function play(sound) {
    switch(sound) {
        case "tic":
            ticSound();
            break;
        case "go":
            goSound();
            break;
        case "completed":
            completedSound();
            break;
        default:
            console.warn(`unknown sound: ${sound}`);
    }
}

/*
This file is part of Claw Trainer.

Copyright (c) 2017-2020 Daniel Schroer
Copyright (c) 2020-2023 Daniel Schroer & contributors
Copyright (c) 2023 Torben Haase & contributors

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
import { KeepAwake } from "@capacitor-community/keep-awake";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Dialog } from '@capacitor/dialog';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { FilePicker } from '@capawesome/capacitor-file-picker';

import { } from "hammerjs";
import { } from "touch-menu-la";

import { soundEffect }  from "sound";

import {BOARDS} from "./boards.js";
import {DEFAULT_PROGRAMS} from "./programs.js";

var DEFAULT_SETTINGS = {
    'version': 4,
    'selectedBoardID': "bm1000",
    'showDefaultPrograms': true,
    'speechOutput': true,
    'soundOutput': true,
    'voice':    undefined
};

var SETTINGS, CUSTOM_PROGRAMS = {};

var VOICES = [];

const COUNTER = (function () {
    var count, timer, paused, resolve, reject, steps, interval, cb;

    function step() {
        if (++count == steps) {
            window.clearInterval(timer);
            resolve();
        }
        else {
            cb(count);
        }
    }

    return {
        start: function start(_steps, _interval, _cb) {
            steps = _steps;
            interval = _interval;
            cb = _cb;
            count = 0;
            paused = false;
            return new Promise(function(_resolve, _reject) {
                resolve = _resolve;
                reject = _reject;
                timer = window.setInterval(step, interval);
                cb(0);
            });
        },
        stop: function stop() {
            window.clearInterval(timer);
            reject("counter aborted");
        },
        pause: function pause() {
            if (paused) {
                timer = window.setInterval(step, interval);
                paused = false;
            }
            else {
                window.clearInterval(timer);
                paused = true;
            }
        },
        finish: function finish() {
            cb(steps - 1);
            window.clearInterval(timer);
            resolve();
        }
    };
})();

function ticSound() {
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

function goSound() {
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

function completedSound() {
    if (SETTINGS['soundOutput']) {
        soundEffect( 587.33, 0, 0.2, "square", 1, 0, 0);    //D
        soundEffect( 880   , 0, 0.2, "square", 1, 0, 0.1);  //A
        soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);  //High D
    }
}

async function savePrograms() {
    const date = new Date();
    const filename = `programs_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}.json`;

    try {
        await Filesystem.writeFile({
            path: filename,
            data: JSON.stringify(CUSTOM_PROGRAMS, null, "    "),
            directory: Directory.ExternalStorage,
            encoding: Encoding.UTF8,
        });
        await Dialog.alert({
            title: "Export successful",
            message: `Exported custom programs as '${filename}'.`
        });
    }
    catch (e) {
        console.error("Export failed", e);
        await Dialog.alert({
            title: 'Export failed',
            message: e.messsage
        });
    }
}

async function uploadPrograms() {
    const file = (await FilePicker.pickFiles({readData: true})).files[0];
    try {
        const ct = JSON.parse(atob(file.data));
        if (ct.version == DEFAULT_PROGRAMS.version) {
            if (countPrograms(CUSTOM_PROGRAMS) > 0) {
                const { value } = await Dialog.confirm({
                    title: 'Import programs',
                    message: `Do you want to overwrite your ${countPrograms(CUSTOM_PROGRAMS)} custom programs with ${countPrograms(ct)} programs from file '${file.name}'?`
                });
                if (value) {
                    doImport(ct);
                }
            }
            else {
                doImport(ct);
            }
        }
        else {
            await Dialog.alert({
                title: 'Import failed',
                message: `Version of imported programs (${ct.version}) does not match app version (${DEFAULT_PROGRAMS.version}).`
            });
        }
    }
    catch(e) {
        console.error("Import failed", e);
        await Dialog.alert({
            title: 'Import failed',
            message: e.message
        });
    }

    function doImport(ct) {
        CUSTOM_PROGRAMS = ct;
        console.info(`Imported ${countPrograms(ct)} programs from file '${file.name}'`);
        storeProgramsAndSettings();
        updateMainPage();
    }

    function countPrograms(p) {
        let num = 0;
        for (const board in p) {
            if ((board != 'version') && (Object.prototype.hasOwnProperty.call(p, board))) {
                num += p[board].length;
            }
        }
        return num;
    }
}

function storeProgramsAndSettings() {
    window.localStorage.setItem('settings', JSON.stringify(SETTINGS));
    window.localStorage.setItem('programs', JSON.stringify(CUSTOM_PROGRAMS));
}

async function loadProgramsAndSettings() {
    if (window.localStorage.getItem('settings')) {
        let loaded_settings = JSON.parse(window.localStorage.getItem('settings'));
        SETTINGS = DEFAULT_SETTINGS;
        for (let prop in DEFAULT_SETTINGS) {
            if ((prop != 'version') &&  (Object.prototype.hasOwnProperty.call(loaded_settings, prop))) {
                SETTINGS[prop] = loaded_settings[prop];
            }
        }
        if (SETTINGS.version != DEFAULT_SETTINGS.version) {
            console.warn('Stored settings outdated. Partially restored.');
        }
    }
    else {
        SETTINGS = DEFAULT_SETTINGS;
        console.info('Using default settings.');
    }

    if (SETTINGS.voice === undefined) {
        console.warn('No voice selected. Selecting first system voice if available.');
        await getVoices();
        if (VOICES[0] !== undefined) {
            SETTINGS.voice = VOICES[0].voiceURI;
        }
    }

    if (window.localStorage.getItem('programs')) {
        CUSTOM_PROGRAMS = JSON.parse(window.localStorage.getItem('programs'));
        if (CUSTOM_PROGRAMS.version != DEFAULT_PROGRAMS.version) {
            CUSTOM_PROGRAMS = { "version": DEFAULT_PROGRAMS.version };
            console.warn('Stored custom programs outdated. Discarding. Sorry for that.');
        }
    }
    else {
        CUSTOM_PROGRAMS = { "version": DEFAULT_PROGRAMS.version };
        console.info('No stored custom programs found.');
    }
}

async function speak(message) {
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

async function runProgram(board, program) {
    const exercise_title_div = document.getElementById("exercise_title");
    const exercise_description_div = document.getElementById("exercise_description");
    const time_counter = document.getElementById("time_counter");
    const hold_pbar = document.getElementById("hold_pbar");
    const rest_pbar = document.getElementById("rest_pbar");
    const pause_pbar = document.getElementById("pause_pbar");

    document.querySelector('#run_content .board_img').src = "./images/" + board.image;

    for (let i in program.exercises) {
        let exercise = program.exercises[i];
        if (exercise.pause < 15) {
            exercise.pause = 15;
        }

        if (i > 0) { // Vor dem ersten Satz keine Ansage der Pause
            speak(makePauseString(exercise.pause, false));
            exercise_title_div.textContent = "Pause";
            exercise_description_div.textContent = `Pause for ${Math.floor(exercise.pause / 60)}:${(exercise.pause % 60).toString().padStart(2, "0")} min.`;
        }
        else {
            exercise_title_div.textContent = "Get ready";
            exercise_description_div.textContent = "";
        }

        document.querySelectorAll("#run_content .overlay_img").forEach(function(element) {
            element.src = "";
        });

        pause_pbar.max = exercise.pause;
        pause_pbar.style.display = "inline-block";
        hold_pbar.style.display = "none";
        rest_pbar.style.display = "none";
        document.getElementById("exercise_counter").textContent = Number(i) + 1 + "/" + program.exercises.length;
        document.getElementById("repeat_counter").textContent = "   ";

        await COUNTER.start(
            exercise.pause,
            1000,
            function pauseCountdownStep(step) {
                time_counter.textContent = exercise.pause - step;
                pause_pbar.value = step + 1;

                if (exercise.pause - step == 15) { // 15s vor Ende der Pause: Ankündigung des nächsten Satzes
                    speak(`Next exercise: ${exercise.description} for ${exercise.hold} seconds. Left hand ${board.left_holds[exercise.left].name}. Right hand ${board.right_holds[exercise.right].name}. Repeat ${exercise.repeat} ${((exercise.repeat > 1) ? "times" : "time")}.`);

                    exercise_title_div.textContent = exercise.title;
                    exercise_description_div.textContent = exercise.description;

                    document.querySelector("#run_content .overlay_left").src = board.left_holds[exercise.left].image ? "./images/" + board.left_holds[exercise.left].image : "";
                    document.querySelector("#run_content .overlay_right").src = board.right_holds[exercise.right].image ? "./images/" + board.right_holds[exercise.right].image : "";
                }
                if (step > 0 && ((exercise.pause - step) % 30 == 0)) { // alle 30s Zeit ansagen
                    speak(makePauseString(exercise.pause - step, true));
                }
                if (exercise.pause - step <= 5) { // letzte fünf Sekunden der Pause ticken
                    ticSound();
                }
            }
        );

        await runExercise(exercise);
    }
    speak("Congratulations!");
    await Dialog.alert({
        title: 'Congratulations',
        message: `You have completed program ${program.title}!`
    });

    async function runExercise(exercise) {
        pause_pbar.style.display = "none";
        hold_pbar.style.display = "inline-block";
        rest_pbar.style.display = "inline-block";

        hold_pbar.max = exercise.hold;
        hold_pbar.style.width = 100 * exercise.hold / (exercise.hold + exercise.rest) + "%";

        rest_pbar.max = exercise.rest;
        rest_pbar.style.width = 100 * exercise.rest / (exercise.hold + exercise.rest) + "%";

        for (let rep = 0; rep < exercise.repeat; rep++) {
            hold_pbar.value = 0;
            rest_pbar.value = 0;
            if (rep == exercise.repeat - 1) { // bei letzter Wiederholung rest-Balken weg
                rest_pbar.style.display = "none";
            }

            document.getElementById("repeat_counter").textContent = Number(rep) + 1 + "/" + exercise.repeat;

            if (!SETTINGS.speechOutput) {
                goSound();
            }
            speak("Go!");
            await COUNTER.start(
                exercise.hold,
                1000,
                function holdCountdownStep(step) {
                    time_counter.textContent = exercise.hold - step;
                    hold_pbar.value = step + 1;
                }
            );
            completedSound();

            if (rep < exercise.repeat - 1) { // bei letzter Wiederholung keine rest-Pause
                await COUNTER.start(
                    exercise.rest,
                    1000,
                    function restCountdownStep(step) {
                        time_counter.textContent = exercise.rest - step;
                        rest_pbar.value = step + 1;

                        if (exercise.rest - step <= 3) {
                            ticSound();
                        }
                    }
                );
            }
        }
    }

    function makePauseString(pause, short = false) {
        const minutes = Math.floor(pause / 60);
        const seconds = pause % 60;
        let pause_str = short ? "" : "Pause for ";
        if (minutes != 0) {
            pause_str += minutes + ((minutes > 1) ? " minutes" : " minute");
            if (seconds != 0) {
                pause_str += short ? " " : " and ";
            }
        }
        if (seconds != 0) {
            pause_str += seconds;
            if (!short || minutes == 0) {
                pause_str += (seconds > 1) ? " seconds" : " second";
            }
        }
        return pause_str + ".";
    }
}

function getProgram(identifier) {
    // identifier: e.g. c1
    const type = identifier.substr(0, 1);
    const num = identifier.substr(1);
    let program;
    if (type == 'c') {
        program = CUSTOM_PROGRAMS[SETTINGS.selectedBoardID][num];
    }
    else if (type == 'd') {
        program = DEFAULT_PROGRAMS[SETTINGS.selectedBoardID][num];
    }
    return program;
}

async function getVoices() {
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
        storeProgramsAndSettings();
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
        storeProgramsAndSettings();
    };

    let checkbox_speechOutput = document.getElementById('checkbox_speechOutput');
    if (SETTINGS.speechOutput) {
        checkbox_speechOutput.setAttribute('checked', 'checked');
    }
    checkbox_speechOutput.onchange = function setSpeechOutput() {
        SETTINGS.speechOutput = this.checked;
        storeProgramsAndSettings();
    };

    let checkbox_soundOutput = document.getElementById('checkbox_soundOutput');
    if (SETTINGS.soundOutput) {
        checkbox_soundOutput.setAttribute('checked', 'checked');
    }
    checkbox_soundOutput.onchange = function setSoundOutput() {
        SETTINGS.soundOutput = this.checked;
        storeProgramsAndSettings();
    };
}

function updateMainPage(identifier) {
    const program_select = document.getElementsByName('program_select')[0];

    let selected_program_identifier = (typeof identifier !== 'undefined')
        ? identifier
        : program_select.options[program_select.selectedIndex]
            ? program_select.options[program_select.selectedIndex].value
            : (CUSTOM_PROGRAMS[SETTINGS.selectedBoardID] && (CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].length > 0))
                ? "c0"
                : "d0";

    // Remove program select options
    while (program_select.firstChild) {
        program_select.removeChild(program_select.firstChild);
    }

    // Populate program select options
    let showDefaultProgramsExceptionally = false;
    if (CUSTOM_PROGRAMS[SETTINGS.selectedBoardID] && (CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].length > 0)) {
        const custom_optgroup = document.createElement('optgroup');
        custom_optgroup.setAttribute('label', 'Your programs'.toUpperCase());
        for (let program_num in CUSTOM_PROGRAMS[SETTINGS.selectedBoardID]) {
            const program = CUSTOM_PROGRAMS[SETTINGS.selectedBoardID][program_num];
            const opt = document.createElement('option');
            const value = 'c' + program_num;
            opt.setAttribute('value', value);
            if (value == selected_program_identifier) {
                opt.defaultSelected = true;
            }
            const content = document.createTextNode(program.title);
            opt.appendChild(content);
            custom_optgroup.appendChild(opt);
        }
        program_select.appendChild(custom_optgroup);
    }
    else if (!SETTINGS.showDefaultPrograms) {
        showDefaultProgramsExceptionally = true;
    }
    if (SETTINGS.showDefaultPrograms || showDefaultProgramsExceptionally) {
        const default_optgroup = document.createElement('optgroup');
        default_optgroup.setAttribute('label', 'Built-in programs'.toUpperCase());
        for (let program_num in DEFAULT_PROGRAMS[SETTINGS.selectedBoardID]) {
            const program = DEFAULT_PROGRAMS[SETTINGS.selectedBoardID][program_num];
            const opt = document.createElement('option');
            const value = 'd' + program_num;
            opt.setAttribute('value', value);
            if (value == selected_program_identifier) {
                opt.defaultSelected = true;
            }
            const content = document.createTextNode(program.title);
            opt.appendChild(content);
            default_optgroup.appendChild(opt);
        }
        program_select.appendChild(default_optgroup);
    }

    // Select change handler
    program_select.onchange = function selectProgram() {
        const identifier = program_select.options[program_select.selectedIndex].value;
        const type = identifier.substr(0, 1);
        const edit_button = document.getElementsByName('edit')[0];
        const delete_button = document.getElementsByName('delete')[0];
        if (type == "d") {
            edit_button.disabled = true;
            delete_button.disabled = true;
        }
        else {
            edit_button.disabled = false;
            delete_button.disabled = false;
        }
        showProgramDetails();
    };

    //  Activate/deactivate buttons and call showProgramDetails()
    program_select.onchange();

    function showProgramDetails() {
        const program = getProgram(program_select.options[program_select.selectedIndex].value);
        const board = BOARDS[SETTINGS.selectedBoardID];

        const program_details_header = document.getElementById('program_details_header');
        while (program_details_header.firstChild) {
            program_details_header.removeChild(program_details_header.firstChild);
        }

        addElement(program_details_header, 'h2', program.title, {'class': 'program_title'});
        addElement(program_details_header, 'p', program.description.replace(/([^.])$/, '$1.'), {'class': 'program_description'});
        const times = calculateTimes(program);
        addElement(program_details_header, 'p', `Total time: ${Math.floor(times[3] / 60)}:${(times[3] % 60).toString().padStart(2, "0")} min. Hang time: ${Math.floor(times[0] / 60)}:${(times[0] % 60).toString().padStart(2, "0")} min.`, {'class': 'program_times'});

        const program_details_exercises = document.getElementById('program_details_exercises');
        while (program_details_exercises.firstChild) {
            program_details_exercises.removeChild(program_details_exercises.firstChild);
        }

        for (let exercise_num in program.exercises) {
            const exercise = program.exercises[exercise_num];
            //const pause_div = addElement(program_details_exercises, 'div', `Pause for ${exercise.pause} seconds.`, {'class': 'program_pause'});
            const div = addElement(program_details_exercises, 'div', null, {'class': 'program_exercise'});
            addElement(div, 'h3', (Number(exercise_num) + 1) + ". " + exercise.title, {'class': 'exercise_title'});
            const outer = addElement(div, 'div', null, {'class': 'board_small_container'});
            addElement(outer, 'img', null, {'class': 'board_img', 'src': "./images/" + board.image, 'alt': ""});
            addElement(outer, 'img', null, {'class': 'overlay_img overlay_left', 'src': (board.left_holds[exercise.left].image ? "./images/" + board.left_holds[exercise.left].image : ""), 'alt': ""});
            addElement(outer, 'img', null, {'class': 'overlay_img overlay_right', 'src': (board.right_holds[exercise.right].image ? "./images/" + board.right_holds[exercise.right].image : ""), 'alt': ""});
            addElement(div, 'p', exercise.description.replace(/([^.])$/, '$1.'), {'class': 'exercise_description'});
            addElement(div, 'p', `Hold for ${exercise.hold} seconds. Rest for ${exercise.rest} seconds. Repeat ${exercise.repeat} times.`, {'class': 'exercise_details'});
        }

        function addElement(node, type, text, atts) {
            const el = document.createElement(type);
            if (text) {
                const tn = document.createTextNode(text);
                el.appendChild(tn);
            }
            for (let name in atts) {
                el.setAttribute(name, atts[name]);
            }
            node.appendChild(el);
            return el;
        }

        function calculateTimes(program) {
            let pause = 0, inter = 0, hold = 0;
            for (let exercise of program.exercises) {
                pause += exercise.pause;
                inter += (exercise.repeat - 1) * exercise.rest;
                hold += exercise.repeat * exercise.hold;
            }
            return [hold, inter, pause, hold + inter + pause];
        }
    }
}

function updateEditPage(identifier) {
    const program = getProgram(identifier);

    const edit_content = document.getElementById('edit_content');
    if (document.getElementById('program_edit')) {
        edit_content.removeChild(document.getElementById('program_edit'));
    }

    const placeholder = document.getElementById('edit_placeholder');

    const template_edit = document.getElementById('template_edit');
    const fragment = template_edit.content.cloneNode(true);

    const title = fragment.getElementById('edit_program_title');
    title.value = program.title;
    title.addEventListener('change', function changedProgramTitle() {
        program.title = this.value;
        storeProgramsAndSettings();
    });

    const description = fragment.getElementById('edit_program_description');
    description.value = program.description;
    description.addEventListener('change', function changedProgramDescription() {
        program.description = this.value;
        storeProgramsAndSettings();
    });

    const button_add = fragment.querySelector('button[name=add_exercise]');
    button_add.addEventListener("click", async function addExercise() {
        program.exercises.splice(0, 0, {
            "title":        "",
            "description":  "",
            "left":         1,
            "right":        1,
            "hold":         5,
            "rest":         5,
            "repeat":       5,
            "pause":        60,
        });
        storeProgramsAndSettings();
        updateEditPage(identifier);
    });

    edit_content.insertBefore(fragment, placeholder);

    const form = document.getElementById('program_edit');
    const template_edit_exercise = document.getElementById('template_edit_exercise');

    for (let exercise_num in program.exercises) {
        const exercise = program.exercises[exercise_num];

        const fragment = template_edit_exercise.content.cloneNode(true);
        fragment.querySelectorAll('label').forEach(function(label) {
            label.htmlFor += "_" + exercise_num;
        });

        const number = fragment.querySelector('.edit_exercise_number');
        number.innerHTML = 1 + Number(exercise_num);

        const pause = fragment.getElementById('edit_exercise_pause');
        pause.value = exercise.pause;
        pause.id += "_" + exercise_num;
        pause.addEventListener('change', function changeExercisePause() {
            if (this.value < 15) {
                this.value = 15;
            }
            program.exercises[exercise_num].pause = Number(this.value);
            storeProgramsAndSettings();
        });

        const title = fragment.getElementById('edit_exercise_title');
        title.value = exercise.title;
        title.id += "_" + exercise_num;
        title.addEventListener('change', function changeExerciseTitle() {
            program.exercises[exercise_num].title = this.value;
            storeProgramsAndSettings();
        });

        const description = fragment.getElementById('edit_exercise_description');
        description.value = exercise.description;
        description.id += "_" + exercise_num;
        description.addEventListener('change', function changeExerciseDescription() {
            program.exercises[exercise_num].description = this.value;
            storeProgramsAndSettings();
        });

        const img_board = fragment.querySelector('img.board_img');
        const img_left = fragment.querySelector('img.overlay_left');
        const img_right = fragment.querySelector('img.overlay_right');

        img_board.src = "./images/" + BOARDS[SETTINGS.selectedBoardID].image;

        const left = fragment.getElementById('edit_exercise_left');
        left.id += "_" + exercise_num;
        for (let hold_id in BOARDS[SETTINGS.selectedBoardID].left_holds) {
            const opt = document.createElement('option');
            opt.setAttribute('value', hold_id);
            const content = document.createTextNode(BOARDS[SETTINGS.selectedBoardID].left_holds[hold_id].name);
            opt.appendChild(content);
            left.appendChild(opt);
        }
        left.value = exercise.left;
        img_left.src = BOARDS[SETTINGS.selectedBoardID].left_holds[exercise.left].image ? "./images/" + BOARDS[SETTINGS.selectedBoardID].left_holds[exercise.left].image : "";
        left.addEventListener('change', function changeExerciseLeft() {
            program.exercises[exercise_num].left = parseInt(this.value, 10);
            img_left.src = "./images/" + BOARDS[SETTINGS.selectedBoardID].left_holds[this.value].image;
            storeProgramsAndSettings();
        });

        const right = fragment.getElementById('edit_exercise_right');
        right.id += "_" + exercise_num;
        for (let hold_id in BOARDS[SETTINGS.selectedBoardID].right_holds) {
            const opt = document.createElement('option');
            opt.setAttribute('value', hold_id);
            const content = document.createTextNode(BOARDS[SETTINGS.selectedBoardID].right_holds[hold_id].name);
            opt.appendChild(content);
            right.appendChild(opt);
        }
        right.value = exercise.right;
        img_right.src = BOARDS[SETTINGS.selectedBoardID].right_holds[exercise.right].image ? "./images/" + BOARDS[SETTINGS.selectedBoardID].right_holds[exercise.right].image : "";
        right.addEventListener('change', function changeExerciseRight() {
            program.exercises[exercise_num].right = parseInt(this.value, 10);
            img_right.src = "./images/" + BOARDS[SETTINGS.selectedBoardID].right_holds[this.value].image;
            storeProgramsAndSettings();
        });

        const hold = fragment.getElementById('edit_exercise_hold');
        hold.value = exercise.hold;
        hold.id += "_" + exercise_num;
        hold.addEventListener('change', function changeExerciseHold() {
            if (this.value < 1) {
                this.value = 1;
            }
            program.exercises[exercise_num].hold = Number(this.value);
            storeProgramsAndSettings();
        });

        const interr = fragment.getElementById('edit_exercise_rest');
        interr.value = exercise.rest;
        interr.id += "_" + exercise_num;
        interr.addEventListener('change', function changeExerciseRest() {
            if (this.value < 1) {
                this.value = 1;
            }
            program.exercises[exercise_num].rest = Number(this.value);
            storeProgramsAndSettings();
        });

        const repeat = fragment.getElementById('edit_exercise_repeat');
        repeat.value = exercise.repeat;
        repeat.id += "_" + exercise_num;
        repeat.addEventListener('change', function changeExerciseRepeat() {
            if (this.value < 1) {
                this.value = 1;
            }
            program.exercises[exercise_num].repeat = Number(this.value);
            storeProgramsAndSettings();
        });

        const button_add = fragment.querySelector('button[name=add_exercise]');
        button_add.addEventListener("click", async function addExercise() {
            program.exercises.splice(Number(exercise_num) + 1, 0, {
                "title":        "",
                "description":  "",
                "left":         1,
                "right":        1,
                "hold":         5,
                "rest":         5,
                "repeat":       5,
                "pause":        60,
            });
            storeProgramsAndSettings();
            updateEditPage(identifier);
        });

        const button_delete = fragment.querySelector('button[name=delete_exercise]');
        button_delete.addEventListener("click", async function deleteExercise() {
            program.exercises.splice(exercise_num, 1);
            storeProgramsAndSettings();
            updateEditPage(identifier);
        });

        form.appendChild(fragment);
    }
}

function selectBoard(event) {
    document.querySelectorAll('div.hangboard_option').forEach(function(i) {
        i.classList.remove("checked");
    });
    event.target.parentElement.classList.add("checked");
    SETTINGS.selectedBoardID = event.target.value;
    storeProgramsAndSettings();
}

function navigateTo(page) {
    window.location.hash = page;
}

async function handleRouting(event) {
    let match = location.hash.match(/[^#]*#?([^_]+)?(_([cd]\d+)){0,1}/);
    const new_page = match[1] || "";
    const new_identifier = match[3] || null;
    const program = new_identifier ? getProgram(new_identifier) : null;
    let old_page = "";//, old_identifier = null;
    if (event) {
    match = event.oldURL.match(/[^#]*#?([^_]+)?(_([cd]\d+)){0,1}/);
        old_page = match[1] || "";
        //old_identifier = match[3] || null;
    }
    if (old_page == "run") {
        // TODO: are you sure?
        COUNTER.stop();
    }
    window.scrollTo(0,0);
    document.getElementById("toolbar_icon_back").style.display = "none";
    document.getElementById("toolbar_icon_menu").style.display = "none";
    document.getElementById("main_content").style.display = "none";
    document.getElementById("run_content").style.display = "none";
    document.getElementById("edit_content").style.display = "none";
    document.getElementById("about_content").style.display = "none";
    document.getElementById("hangboard_selector_content").style.display = "none";
    document.getElementById("settings_content").style.display = "none";
    switch (new_page) {
        case "":
            updateMainPage();
            document.getElementById("toolbar_title").innerText = "Claw Trainer";
            document.getElementById("toolbar_icon_menu").style.display = "inline";
            document.getElementById("main_content").style.display = "block";
            break;
        case "edit":
            updateEditPage(new_identifier);
            document.getElementById("toolbar_title").innerText = getProgram(new_identifier).title;
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("edit_content").style.display = "block";
            break;
        case "run":
            document.getElementById("toolbar_title").innerText = program.title;
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("run_content").style.display = "block";
            try {
                KeepAwake.keepAwake();
                await runProgram(BOARDS[SETTINGS.selectedBoardID], program);
                history.back();
            }
            catch (err) {
                console.warn("Program aborted", err);
            }
            finally {
                KeepAwake.allowSleep();
            }
            break;
        case "about":
            document.getElementById("toolbar_title").innerText = "About";
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("about_content").style.display = "block";
            break;
        case "switch":
            document.getElementById("toolbar_title").innerText = "Hangboard";
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("hangboard_selector_content").style.display = "block";
            break;
        case "settings":
            await updateSettingsPage();
            document.getElementById("toolbar_title").innerText = "Settings";
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("settings_content").style.display = "block";
            break;
    }
}

async function init() {
    const program_select = document.getElementsByName('program_select')[0];

    StatusBar.hide();

    await loadProgramsAndSettings();

    window.addEventListener('hashchange', handleRouting);

    const start_button = document.getElementsByName('start')[0];
    start_button.addEventListener("click", function startProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        navigateTo("run_" + selected_program_identifier);
    });

    const edit_button = document.getElementsByName('edit')[0];
    edit_button.addEventListener("click", function editProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        navigateTo(`edit_${selected_program_identifier}`);
    });

    const clone_button = document.getElementsByName('clone')[0];
    clone_button.addEventListener("click", function cloneProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        let program = getProgram(selected_program_identifier);
        let clone = JSON.parse(JSON.stringify(program));
        clone.title += " (copy)";
        if (!CUSTOM_PROGRAMS[SETTINGS.selectedBoardID]) {
            CUSTOM_PROGRAMS[SETTINGS.selectedBoardID] = [];
        }
        CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].push(clone);
        storeProgramsAndSettings();
        let new_identifier = "c" + CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].indexOf(clone);
        updateMainPage(new_identifier);
        window.scrollTo(0,0);
    });

    const delete_button = document.getElementsByName('delete')[0];
    delete_button.addEventListener("click", function editProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        // TODO: confirm
        const num = selected_program_identifier.substr(1);
        CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].splice(num, 1);
        storeProgramsAndSettings();
        updateMainPage('c0');
        window.scrollTo(0,0);
        // TODO: else cannot delete last program
        // TODO: delete button disablen
    });

    const pause_button = document.getElementsByName("pause")[0];
    pause_button.addEventListener("click", COUNTER.pause);

	var TouchMenu = window.TouchMenuLA({
		target: document.getElementById('drawer'),
        width: Math.min(Math.min(screen.availWidth, screen.availHeight) - 56, 280),
        zIndex: 2,
        handleSize: 0
	});
	document.getElementById('toolbar_icon_menu').addEventListener('click', function() {
		TouchMenu.toggle();
	}, false);
    document.getElementById('a_export_programs').addEventListener('click', function(event) {
        event.preventDefault();
        TouchMenu.close();
        savePrograms();
	}, false);
    document.getElementById("a_import_programs").addEventListener("click", function(event) {
        event.preventDefault();
        TouchMenu.close();
        uploadPrograms();
    }, false);
    document.getElementById('a_about').addEventListener('click', function(event){
        event.preventDefault();
        TouchMenu.close();
        navigateTo('about');
    }, false);
    document.getElementById('a_switch_board').addEventListener('click', function(event){
        event.preventDefault();
        TouchMenu.close();
        navigateTo('switch');
	}, false);
    document.getElementById('a_settings').addEventListener('click', function(event){
        event.preventDefault();
        TouchMenu.close();
        navigateTo('settings');
	}, false);
    document.getElementById('drawer').style.display = "block";

    // Prepare hangboard selector
    const hs = document.getElementById('hangboard_select');
    hs.onchange = selectBoard;
    for (let bid in BOARDS) {
        const div = document.createElement('div');
        div.setAttribute('class', 'hangboard_option');
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'hangboard');
        radio.setAttribute('value', bid);
        radio.setAttribute('id', 'radio_' + bid);
        if (bid == SETTINGS.selectedBoardID) {
            div.classList.add("checked");
            radio.setAttribute('checked', 'checked');
        }
        div.appendChild(radio);
        const label = document.createElement('label');
        label.setAttribute('for', 'radio_' + bid);
        const span = document.createElement('span');
        const tn = document.createTextNode(BOARDS[bid].name);
        span.appendChild(tn);
        label.appendChild(span);
        const img = document.createElement('img');
        img.setAttribute('class', 'board_img');
        img.setAttribute('src', 'images/' + BOARDS[bid].image);
        img.setAttribute('alt', BOARDS[bid].name);
        label.appendChild(img);
        div.appendChild(label);
        hs.appendChild(div);
    }

    handleRouting();
}

init();

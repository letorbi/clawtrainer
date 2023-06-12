import { Dialog } from '@capacitor/dialog';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

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

import {CUSTOM_PROGRAMS, DEFAULT_PROGRAMS, getProgram, storePrograms} from "../programs.js";
import {SETTINGS} from "../settings.js";
import {BOARDS} from "../boards.js";

function navigateTo(page) {
    window.location.hash = `/${page}`;
}

async function initStart() {
    const program_select = document.getElementsByName('program_select')[0];

    const start_button = document.getElementsByName('start')[0];
    start_button.addEventListener("click", function startProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        navigateTo("run/" + selected_program_identifier);
    });

    const edit_button = document.getElementsByName('edit')[0];
    edit_button.addEventListener("click", function editProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        navigateTo(`edit/${selected_program_identifier}`);
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
        storePrograms();
        let new_identifier = "c" + CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].indexOf(clone);
        updateStartPage(new_identifier);
    });

    const delete_button = document.getElementsByName('delete')[0];
    delete_button.addEventListener("click", function editProgram() {
        const selected_program_identifier = program_select.options[program_select.selectedIndex].value;
        // TODO: confirm
        const num = selected_program_identifier.substr(1);
        CUSTOM_PROGRAMS[SETTINGS.selectedBoardID].splice(num, 1);
        storePrograms();
        updateStartPage('c0');
        // TODO: else cannot delete last program
        // TODO: delete button disablen
    });
}

function updateStartPage(identifier) {
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

    document.getElementById('ExportButton').addEventListener('click', function() {
        document.getElementById("StartMenu").close();
        exportPrograms();
    }, false);
    document.getElementById("ImportButton").addEventListener("click", function() {
        document.getElementById("StartMenu").close();
        importPrograms();
    }, false);
}

export async function exportPrograms() {
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

export async function importPrograms() {
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
        for (const prop of Object.getOwnPropertyNames(CUSTOM_PROGRAMS))
            delete CUSTOM_PROGRAMS[prop];
        Object.assign(CUSTOM_PROGRAMS, ct);
        console.info(`Imported ${countPrograms(ct)} programs from file '${file.name}'`);
        storePrograms();
        updateStartPage();
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

export class StartPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <ion-menu id="StartMenu" content-id="main-content">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Claw Trainer</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-list>
                        <ion-item href="#/boards">
                            <ion-icon name="barbell-outline" slot="start"></ion-icon> 
                            <ion-label>Switch Hangboard</ion-label>
                        </ion-item>
                        <ion-item button id="ExportButton" lines="none">
                            <ion-icon name="arrow-down-outline" slot="start"></ion-icon> 
                            <ion-label>Export Custom Programs</ion-label>
                        </ion-item>
                        <ion-item button id="ImportButton">
                            <ion-icon name="arrow-up-outline" slot="start"></ion-icon> 
                            <ion-label>Import Custom Programs</ion-label>
                        </ion-item>
                        <ion-item href="#/settings">
                            <ion-icon name="settings-outline" slot="start"></ion-icon> 
                            <ion-label>Settings</ion-label>
                        </ion-item>
                        <ion-item href="#/about">
                            <ion-icon name="information-circle-outline" slot="start"></ion-icon> 
                            <ion-label>About</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-menu>
            <div class="ion-page" id="main-content">
                <ion-header>
                    <ion-toolbar color="primary">
                        <ion-buttons slot="start">
                            <ion-menu-button></ion-menu-button>
                        </ion-buttons>
                        <ion-title>Exercises</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <div id="main_content">
                        <select class="big_select" name="program_select"></select>
                        <div id="program_details_header"></div>
                        <div class="button_container">
                            <button class="button_flat" name="clone">Clone</button>
                            <button class="button_flat" name="edit">Edit</button>
                            <button class="button_flat" name="delete">Delete</button>
                        </div>
                        <div id="program_details_exercises"></div>
                        <button class="button_round" name="start"><i class="material-icons md-light md-36">play_arrow</i></button>
                        <!--ion-fab slot="fixed" vertical="bottom" horizontal="end" >
                            <ion-fab-button>
                                <ion-icon name="play"></ion-icon>
                            </ion-fab-button>
                        </ion-fab-->
                    </div>
                </ion-content>
            </div>
        `;
        initStart();
        updateStartPage();
    }
}

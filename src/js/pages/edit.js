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

import { ComponentElement } from '../lib/component.js';

import { getProgram } from "../programs.js";
import { SETTINGS } from "../settings.js";
import { BOARDS } from "../boards.js";

export class EditPage extends ComponentElement {
    connectedCallback() {
        super.connectedCallback(html);
        this.updateEditPage();
    }

    updateEditPage() {
        const selectedBoard = BOARDS[SETTINGS.selectedBoardID];

        const identifier = location.hash.split('/')[2];
        const program = getProgram(identifier);

        const edit_content = document.getElementById("edit_content");
        if (document.getElementById("program_edit")) {
            edit_content.removeChild(document.getElementById("program_edit"));
        }

        const placeholder = document.getElementById("edit_placeholder");

        const template_edit = document.getElementById("template_edit");
        const fragment = template_edit.content.cloneNode(true);

        const title = fragment.getElementById('edit_program_title');
        title.value = program.title;
        title.addEventListener('change', function changedProgramTitle() {
            program.title = this.value;
        });

        const description = fragment.getElementById('edit_program_description');
        description.value = program.description;
        description.addEventListener('change', function changedProgramDescription() {
            program.description = this.value;
        });

        const button_add = fragment.querySelector('button[name=add_exercise]');
        button_add.addEventListener("click", () => {
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
            this.updateEditPage();
        });

        edit_content.insertBefore(fragment, placeholder);

        const form = document.getElementById("program_edit");
        const template_edit_exercise = document.getElementById("template_edit_exercise");

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
            });

            const title = fragment.getElementById('edit_exercise_title');
            title.value = exercise.title;
            title.id += "_" + exercise_num;
            title.addEventListener('change', function changeExerciseTitle() {
                program.exercises[exercise_num].title = this.value;
            });

            const description = fragment.getElementById('edit_exercise_description');
            description.value = exercise.description;
            description.id += "_" + exercise_num;
            description.addEventListener('change', function changeExerciseDescription() {
                program.exercises[exercise_num].description = this.value;
            });

            const img_board = fragment.querySelector('img.board_img');
            const img_left = fragment.querySelector('img.overlay_left');
            const img_right = fragment.querySelector('img.overlay_right');

            img_board.src = "./images/" + selectedBoard.image;

            const left = fragment.getElementById('edit_exercise_left');
            left.id += "_" + exercise_num;
            for (let hold_id in selectedBoard.left_holds) {
                const opt = document.createElement('option');
                opt.setAttribute('value', hold_id);
                const content = document.createTextNode(selectedBoard.left_holds[hold_id].name);
                opt.appendChild(content);
                left.appendChild(opt);
            }
            left.value = exercise.left;
            img_left.src = selectedBoard.left_holds[exercise.left].image ? "./images/" + selectedBoard.left_holds[exercise.left].image : "";
            left.addEventListener('change', function changeExerciseLeft() {
                program.exercises[exercise_num].left = parseInt(this.value, 10);
                img_left.src = "./images/" + selectedBoard.left_holds[this.value].image;
            });

            const right = fragment.getElementById('edit_exercise_right');
            right.id += "_" + exercise_num;
            for (let hold_id in selectedBoard.right_holds) {
                const opt = document.createElement('option');
                opt.setAttribute('value', hold_id);
                const content = document.createTextNode(selectedBoard.right_holds[hold_id].name);
                opt.appendChild(content);
                right.appendChild(opt);
            }
            right.value = exercise.right;
            img_right.src = selectedBoard.right_holds[exercise.right].image ? "./images/" + selectedBoard.right_holds[exercise.right].image : "";
            right.addEventListener('change', function changeExerciseRight() {
                program.exercises[exercise_num].right = parseInt(this.value, 10);
                img_right.src = "./images/" + selectedBoard.right_holds[this.value].image;
            });

            const hold = fragment.getElementById('edit_exercise_hold');
            hold.value = exercise.hold;
            hold.id += "_" + exercise_num;
            hold.addEventListener('change', function changeExerciseHold() {
                if (this.value < 1) {
                    this.value = 1;
                }
                program.exercises[exercise_num].hold = Number(this.value);
            });

            const interr = fragment.getElementById('edit_exercise_rest');
            interr.value = exercise.rest;
            interr.id += "_" + exercise_num;
            interr.addEventListener('change', function changeExerciseRest() {
                if (this.value < 1) {
                    this.value = 1;
                }
                program.exercises[exercise_num].rest = Number(this.value);
            });

            const repeat = fragment.getElementById('edit_exercise_repeat');
            repeat.value = exercise.repeat;
            repeat.id += "_" + exercise_num;
            repeat.addEventListener('change', function changeExerciseRepeat() {
                if (this.value < 1) {
                    this.value = 1;
                }
                program.exercises[exercise_num].repeat = Number(this.value);
            });

            const button_add = fragment.querySelector('button[name=add_exercise]');
            button_add.addEventListener("click", () => {
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
                this.updateEditPage();
            });

            const button_delete = fragment.querySelector('button[name=delete_exercise]');
            button_delete.addEventListener("click", () => {
                program.exercises.splice(exercise_num, 1);
                this.updateEditPage();
            });

            form.appendChild(fragment);
        }
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
        <div id="edit_content">
            <template id="template_edit">
                <form id="program_edit" onsubmit="return false;">
                    <div class="edit_header">
                        <label for="edit_program_title" class="edit-label edit-row1">Title</label>
                        <input id="edit_program_title" class="edit-input edit-row1" type="text" />

                        <label for="edit_program_description" class="edit-label edit-row2">Description</label>
                        <textarea id="edit_program_description" class="edit-input edit-row2"></textarea>
                    </div>
                    <button class="button_wide button_add" name="add_exercise"><i class="material-icons md-dark">add</i>Add Exercise</button>
                </form>
            </template>
            <template id="template_edit_exercise">
                <div class="edit_pause">
                    <label for="edit_exercise_pause" class="edit-label edit-row1">Pause</label>
                    <input id="edit_exercise_pause" class="edit-input edit-row1" type="number" step="1" min="15"/>
                    <label for="edit_exercise_pause" class="edit-label-right edit-row1">s</label>
                </div>

                <div class="edit_exercise">
                    <div class="edit_exercise_number edit-label edit-row1"></div>
                    <div class="board_inner_container edit-input-big edit-row1">
                        <img class="board_img" src="" alt="">
                        <img class="overlay_img overlay_left" src="" alt="">
                        <img class="overlay_img overlay_right" src="" alt="">
                    </div>

                    <label for="edit_exercise_title" class="edit-label edit-row2">Title</label>
                    <input id="edit_exercise_title" class="edit-input-big edit-row2" type="text"/>

                    <label for="edit_exercise_description" class="edit-label edit-row3">Description</label>
                    <textarea id="edit_exercise_description" class="edit-input-big edit-row3"></textarea>

                    <label for="edit_exercise_left" class="edit-label edit-row4">Left hand</label>
                    <select id="edit_exercise_left" class="edit-input-big edit-row4"></select>

                    <label for="edit_exercise_right" class="edit-label edit-row5">Right hand</label>
                    <select id="edit_exercise_right" class="edit-input-big edit-row5"></select>

                    <label for="edit_exercise_hold" class="edit-label edit-row6">Hold</label>
                    <input id="edit_exercise_hold" class="edit-input edit-row6" type="number" min="1" step="1"/>
                    <label for="edit_exercise_hold" class="edit-label-right edit-row6">s</label>

                    <label for="edit_exercise_rest" class="edit-label edit-row7">Rest</label>
                    <input id="edit_exercise_rest" class="edit-input edit-row7" type="number" min="1" step="1"/>
                    <label for="edit_exercise_rest" class="edit-label-right edit-row7">s</label>

                    <label for="edit_exercise_repeat" class="edit-label edit-row8">Repeat</label>
                    <input id="edit_exercise_repeat" class="edit-input edit-row8" type="number" min="1" step="1"/>
                    <label for="edit_exercise_repeat" class="edit-label-right edit-row8">times</label>

                    <button name="delete_exercise" class="edit-span edit-row9 button_wide button_delete"><i class="material-icons md-dark">delete</i>Delete Exercise</button>
                </div>

                <button class="button_add button_wide" name="add_exercise"><i class="material-icons md-dark">add</i>Add Exercise</button>
            </template>
        </div>
    </ion-content>
`;

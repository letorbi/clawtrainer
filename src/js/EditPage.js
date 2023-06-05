import {updateEditPage} from "./nappy.js";

export class EditPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
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
        updateEditPage();
    }
}

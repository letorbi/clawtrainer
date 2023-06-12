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

import {BOARDS} from "../boards.js";
import {SETTINGS, storeSettings} from "../settings.js";

function selectBoard(event) {
    document.querySelectorAll('div.hangboard_option').forEach(function(i) {
        i.classList.remove("checked");
    });
    event.target.parentElement.classList.add("checked");
    SETTINGS.selectedBoardID = event.target.value;
    storeSettings();
}

function initBoards() {
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
}

export class BoardsPage extends HTMLElement {
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
                <div id="hangboard_selector_content">
                    <form id="hangboard_select" onsubmit="return false;"></form>
                </div>
            </ion-content>
        `;
        initBoards();
    }
}

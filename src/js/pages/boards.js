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

import {BOARDS} from "../boards.js";
import {settings} from "../settings.js";

export class BoardsPage extends ComponentElement {
    connectedCallback() {
        super.connectedCallback(html);

        const hs = document.getElementById("hangboard_select");
        for (let bid in BOARDS) {
            const div = document.createElement('div');
            div.setAttribute('class', 'hangboard_option');
            div.setAttribute('id', 'hangboard_' + bid);
            div.addEventListener("click", () => settings.data.selectedBoardID = bid);
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

        settings.addObserver(this, "selectedBoardID", (bid) => {
            this.querySelectorAll('div.hangboard_option')
                .forEach((elmt) => elmt.classList.remove("checked"));
            document.getElementById(`hangboard_${bid}`).classList.add("checked");
        }, true);
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
        <div id="hangboard_selector_content">
            <form id="hangboard_select" onsubmit="return false;"></form>
        </div>
    </ion-content>
`;

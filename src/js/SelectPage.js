import {initSelect} from "./nappy.js";

export class SelectPage extends HTMLElement {
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
        initSelect();
    }
}

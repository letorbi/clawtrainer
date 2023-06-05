import {updateSettingsPage} from "./nappy.js";

export class SettingsPage extends HTMLElement {
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
                <div id="settings_content">
                    <form id="form_settings" onsubmit="return false;">
                        <ul>
                            <li>
                                <i class="material-icons md-dark">visibility</i>
                                <label for="checkbox_showDefaultPrograms">Show built-in programs</label>
                                <div class="matbox">
                                    <input id="checkbox_showDefaultPrograms" type="checkbox" />
                                    <label for="checkbox_showDefaultPrograms"></label>
                                </div>
                            </li>

                            <li>
                                <i class="material-icons md-dark">notifications</i>
                                <label for="checkbox_soundOutput">Play sounds</label>
                                <div class="matbox">
                                    <input id="checkbox_soundOutput" type="checkbox" />
                                    <label for="checkbox_soundOutput"></label>
                                </div>
                            </li>

                            <li>
                                <i class="material-icons md-dark">record_voice_over</i>
                                <label for="checkbox_speechOutput">Speak instructions</label>
                                <div class="matbox">
                                    <input id="checkbox_speechOutput" type="checkbox" />
                                    <label for="checkbox_speechOutput"></label>
                                </div>
                            </li>

                            <li>
                                <div class="selbox">
                                    <label for="select_voice">Voice</label>
                                    <select id="select_voice"></select>
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
            </ion-content>
        `;
        updateSettingsPage();
    }
}

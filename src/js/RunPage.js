import {initRun, updateRunPage} from "./nappy.js";

export class RunPage extends HTMLElement {
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
                <div id="run_content">
                    <div class="board_outer_container">
                        <div class="board_inner_container">
                            <img class="board_img" src="" alt=""/>
                            <img class="overlay_img overlay_left" src="" alt=""/>
                            <img class="overlay_img overlay_right" src="" alt=""/>
                        </div>
                    </div>
                    <h2 id="exercise_title"></h2>
                    <p id="exercise_description"></p>
                    <div id="counter"><span id="exercise_counter"></span><span id="time_counter"></span><span id="repeat_counter"></span></div>
                    <div id="pbars">
                        <progress id="hold_pbar" max="7" value="0"></progress><progress id="rest_pbar" max="3" value="0"></progress>
                        <progress id="pause_pbar" max="7" value="0"></progress>
                    </div>
                    <!--<div id="pause_overlay"><i class="material-icons md-dark md-288">pause_circle_outline</i></div>-->
                    <button class="button_wide" name="pause"><i class="material-icons md-dark">pause</i>Suspend</button>
                </div>
            </ion-content>
        `;
        initRun();
        updateRunPage();
    }
}

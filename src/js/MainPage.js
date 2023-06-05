import {initMain, updateMainPage} from "./nappy.js";

export class MainPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <ion-menu id="MainMenu" content-id="main-content">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Claw Trainer</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-list>
                        <ion-item href="#/select">
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
        initMain();
        updateMainPage();
    }
}

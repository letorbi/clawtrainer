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

import { Dialog } from '@capacitor/dialog';
import { KeepAwake } from "@capacitor-community/keep-awake";

import {ComponentElement} from "../lib/component.js";

import {BOARDS} from "../boards.js";
import {getProgram} from "../programs.js";
import {settings} from "../settings.js";
import {play as _play} from "../sounds.js";
import {speak as _speak} from "../speech.js";

function play(sound) {
    if (settings.data.soundOutput)
        _play(sound);
}

function speak(message) {
    if (settings.data.speechOutput)
        _speak(message, settings.data.voice);
}

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

export class RunPage extends ComponentElement {
    async connectedCallback() {
        super.connectedCallback(html);

        const pause_button = document.getElementsByName("pause")[0];
        pause_button.addEventListener("click", COUNTER.pause);


        const identifier = location.hash.split('/')[2];
        const program = getProgram(identifier);
        try {
            KeepAwake.keepAwake();
            await this.runProgram(BOARDS[settings.data.selectedBoardID], program);
            history.back();
        }
        catch (err) {
            console.warn("Program aborted", err);
        }
        finally {
            KeepAwake.allowSleep();
        }
    }

    disconnectedCallback() {
        COUNTER.stop();
    }

    async runProgram(board, program) {
        const exercise_title_div = document.getElementById("exercise_title");
        const exercise_description_div = document.getElementById("exercise_description");
        const time_counter = document.getElementById("time_counter");
        const hold_pbar = document.getElementById("hold_pbar");
        const rest_pbar = document.getElementById("rest_pbar");
        const pause_pbar = document.getElementById("pause_pbar");

        this.querySelector('#run_content .board_img').src = "./images/" + board.image;

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

            this.querySelectorAll("#run_content .overlay_img").forEach(function(element) {
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
                (step) => {
                    time_counter.textContent = exercise.pause - step;
                    pause_pbar.value = step + 1;

                    if (exercise.pause - step == 15) { // 15s vor Ende der Pause: Ankündigung des nächsten Satzes
                        speak(`Next exercise: ${exercise.description} for ${exercise.hold} seconds. Left hand ${board.left_holds[exercise.left].name}. Right hand ${board.right_holds[exercise.right].name}. Repeat ${exercise.repeat} ${((exercise.repeat > 1) ? "times" : "time")}.`);

                        exercise_title_div.textContent = exercise.title;
                        exercise_description_div.textContent = exercise.description;

                        this.querySelector("#run_content .overlay_left").src = board.left_holds[exercise.left].image ? "./images/" + board.left_holds[exercise.left].image : "";
                        this.querySelector("#run_content .overlay_right").src = board.right_holds[exercise.right].image ? "./images/" + board.right_holds[exercise.right].image : "";
                    }
                    if (step > 0 && ((exercise.pause - step) % 30 == 0)) { // alle 30s Zeit ansagen
                        speak(makePauseString(exercise.pause - step, true));
                    }
                    if (exercise.pause - step <= 5) { // letzte fünf Sekunden der Pause ticken
                        play("tic");
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

                if (!settings.data.speechOutput) {
                    play("go");
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
                play("completed");

                if (rep < exercise.repeat - 1) { // bei letzter Wiederholung keine rest-Pause
                    await COUNTER.start(
                        exercise.rest,
                        1000,
                        function restCountdownStep(step) {
                            time_counter.textContent = exercise.rest - step;
                            rest_pbar.value = step + 1;

                            if (exercise.rest - step <= 3) {
                                play("tic");
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

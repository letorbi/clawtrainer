// phonegap prepare browser & pscp -l schroeer -i "C:\Users\Daniel Schröer\svncode\Gipfelkreuz\private_key.ppk" -r platforms\browser\www\* daimlerstr.de:stella/www/trainer/

"use strict";

var DEFAULT_SETTINGS = {
    board: 0
};

var SETTINGS, TRAININGS;

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
        }
    }
})();

function ticSound() {
    soundEffect(
        400,        //frequency
        0.02,       //attack
        0.02,       //decay
        "sine",     //waveform
        10,         //volume
        0,          //pan
        0,          //wait before playing
        1,          //pitch bend amount
        false,      //reverse
        0,          //random pitch range
        0,          //dissonance
        undefined,  //echo: [delay, feedback, filter]
        undefined   //reverb: [duration, decay, reverse?]
    );
}

function completedSound() {
    soundEffect( 587.33, 0, 0.2, "square", 1, 0, 0);    //D
    soundEffect( 880   , 0, 0.2, "square", 1, 0, 0.1);  //A
    soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);  //High D
}

function downloadTrainings() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(TRAININGS, null, "  "));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const date = new Date();
    const filename = `trainings_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate() + 1).toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}.json`;
    downloadAnchorNode.setAttribute("download", filename);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function uploadTrainings(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const tr = JSON.parse(event.target.result);
            if (tr instanceof Array) {
                TRAININGS = tr;
                console.log(`Imported ${tr.length} trainings from file "${file.name}"`);
                updateMainPage();
            }
        }
        catch(error) {}
    };
    reader.readAsText(file);
}

function storeTrainingsAndSettings() {
    window.localStorage.setItem('settings', JSON.stringify(SETTINGS));
    window.localStorage.setItem('trainings', JSON.stringify(TRAININGS));
    console.log('Stored trainings and settings in local storage');
}

function loadTrainingsAndSettings() {
    if (window.localStorage.getItem('settings')) {
        SETTINGS = JSON.parse(window.localStorage.getItem('settings'));
        console.log('Restored settings from storage');
    }
    else {
        SETTINGS = DEFAULT_SETTINGS;
        console.log('Using default settings');
    }
    if (window.localStorage.getItem('trainings')) {
        TRAININGS = JSON.parse(window.localStorage.getItem('trainings'));
        console.log(`Restored ${TRAININGS.length} trainings from storage`);
    }
    else {
        TRAININGS = DEFAULT_TRAININGS;
        console.log('Using default trainings');
    }
}

async function runTraining(board, training) {
    const set_title_div = document.getElementById("set_title");
    const set_description_div = document.getElementById("set_description");
    const time_counter = document.getElementById("time_counter");
    const hold_pbar = document.getElementById("hold_pbar");
    const rest_pbar = document.getElementById("rest_pbar");
    const pause_pbar = document.getElementById("pause_pbar");
    
    for (let i in training.sets) {
        let set = training.sets[i];
        if (set.pause < 15) {
            set.pause = 15;
        }

        if (i > 0) { // Vor dem ersten Satz keine Ansage der Pause
            speak(makePauseString(set.pause, false));
            set_title_div.textContent = "Pause";
            set_description_div.textContent = `Pause for ${Math.floor(set.pause / 60)}:${(set.pause % 60).toString().padStart(2, "0")} min.`;
        }
        else {
            set_title_div.textContent = "Get ready";
            set_description_div.textContent = "";
        }
        
        document.querySelectorAll("#run_content .overlay_img").forEach(function(element) {
            element.src = "";
        });

        pause_pbar.max = set.pause;
        pause_pbar.style.display = "inline-block";
        hold_pbar.style.display = "none";
        rest_pbar.style.display = "none";
        document.getElementById("set_counter").textContent = Number(i) + 1 + "/" + training.sets.length;
        document.getElementById("repeat_counter").textContent = "   ";

        console.log(`pause ${set.pause} seconds`);
        await COUNTER.start(
            set.pause,
            1000,
            async function pauseCountdownStep(step) {
                time_counter.textContent = set.pause - step;
                pause_pbar.value = step + 1;
                
                if (set.pause - step == 15) { // 15s vor Ende der Pause: Ankündigung des nächsten Satzes
                    speak(`Next exercise: ${set.description} for ${set.hold} seconds. Left hand ${board.left_holds[set.left].name}. Right hand ${board.right_holds[set.right].name}. Repeat ${set.repeat} ${((set.repeat > 1) ? "times" : "time")}.`);

                    set_title_div.textContent = set.title;
                    set_description_div.textContent = set.description;
                    
                    document.querySelector("#run_content .overlay_left").src = board.left_holds[set.left].image ? "images/" + board.left_holds[set.left].image : "";
                    document.querySelector("#run_content .overlay_right").src = board.right_holds[set.right].image ? "images/" + board.right_holds[set.right].image : "";
                }
                if (step > 0 && ((set.pause - step) % 30 == 0)) { // alle 30s Zeit ansagen
                    speak(makePauseString(set.pause - step, true));
                }
                if (set.pause - step <= 5) { // letzte fünf Sekunden der Pause ticken
                    await ticSound();
                }
            }
        );

        await runSet(set);
    }
    speak("Congratulations!");
    console.log("Training completed");
   
    async function runSet(set) {
        const utter_go = new SpeechSynthesisUtterance();
        utter_go.text = "Go!";
        utter_go.lang = 'en-US';

        pause_pbar.style.display = "none";
        hold_pbar.style.display = "inline-block";
        rest_pbar.style.display = "inline-block";
        
        hold_pbar.max = set.hold;
        hold_pbar.style.width = 100 * set.hold / (set.hold + set.rest) + "%";

        rest_pbar.max = set.rest;
        rest_pbar.style.width = 100 * set.rest / (set.hold + set.rest) + "%";
        
        for (let rep = 0; rep < set.repeat; rep++) {
            hold_pbar.value = 0;
            rest_pbar.value = 0;
            if (rep == set.repeat - 1) { // bei letzter Wiederholung rest-Balken weg
                rest_pbar.style.display = "none";
            }

            document.getElementById("repeat_counter").textContent = Number(rep) + 1 + "/" + set.repeat;
            
            console.log(`rep ${rep+1}: hold`);
            speechSynthesis.speak(utter_go);
            await COUNTER.start(
                set.hold,
                1000,
                function hangCountdownStep(step) {
                    time_counter.textContent = set.hold - step;
                    hold_pbar.value = step + 1;
                }
            );
            await completedSound();

            console.log(`rep ${rep+1}: rest`);
            
            if (rep < set.repeat - 1) { // bei letzter Wiederholung keine rest-Pause
                await COUNTER.start(
                    set.rest,
                    1000,
                    async function restCountdownStep(step) {
                        time_counter.textContent = set.rest - step;
                        rest_pbar.value = step + 1;

                        if (set.rest - step <= 3) {
                            await ticSound();
                        }
                    }
                );
            }
        }
        console.log("set complete");
    }
    
    function speak(message) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = message;
        utterance.lang = 'en-US';
        console.log(`Speaking "${message}"`);
        speechSynthesis.speak(utterance);
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

function updateMainPage(preselect) {
    const training_select = document.getElementsByName('training_select')[0];
    let selected_training = (typeof preselect !== 'undefined') ? preselect : training_select.selectedIndex;
    if (selected_training == -1)
        selected_training = 0;
    
    fillTrainingSelect(selected_training);
    
    training_select.onchange = showTrainingDetails;

    function fillTrainingSelect(selected = 0) {
        while (training_select.firstChild) {
            training_select.removeChild(training_select.firstChild);
        }
        for (let training_num in TRAININGS) {
            const training = TRAININGS[training_num];
            if (training.board == BOARDS[SETTINGS.board].id) {
                const opt = document.createElement('option');
                opt.setAttribute('value', training_num);
                const content = document.createTextNode(training.title);
                opt.appendChild(content);
                training_select.appendChild(opt);
            }
        }
        training_select.selectedIndex = selected;
        showTrainingDetails();
    }

    function showTrainingDetails() {
        const selected_training_num = training_select.options[training_select.selectedIndex].value;
        const board = BOARDS[SETTINGS.board];
        const training = TRAININGS[selected_training_num];

        const training_details_header = document.getElementById('training_details_header');
        while (training_details_header.firstChild) {
            training_details_header.removeChild(training_details_header.firstChild);
        }

        addElement(training_details_header, 'h2', training.title, {'class': 'training_title'});
        addElement(training_details_header, 'p', training.description.replace(/([^.])$/, '$1.'), {'class': 'training_description'});
        const times = calculateTimes(training);
        addElement(training_details_header, 'p', `Total time: ${Math.floor(times[3] / 60)}:${(times[3] % 60).toString().padStart(2, "0")} min. Hang time: ${Math.floor(times[0] / 60)}:${(times[0] % 60).toString().padStart(2, "0")} min.`, {'class': 'training_description'});
        
        const training_details_sets = document.getElementById('training_details_sets');
        while (training_details_sets.firstChild) {
            training_details_sets.removeChild(training_details_sets.firstChild);
        }

        for (let set_num in training.sets) {
            const set = training.sets[set_num];
            const pause_div = addElement(training_details_sets, 'div', `Pause for ${set.pause} seconds.`, {'class': 'training_pause'});
            const div = addElement(training_details_sets, 'div', null, {'class': 'training_set'});
            addElement(div, 'h3', (Number(set_num) + 1) + ". " + set.title, {'class': 'set_title'});
            const outer = addElement(div, 'div', null, {'class': 'board_small_container'});
            addElement(outer, 'img', null, {'class': 'board_img', 'src': "images/" + board.image, 'alt': ""});
            addElement(outer, 'img', null, {'class': 'overlay_img overlay_left', 'src': (board.left_holds[set.left].image ? "images/" + board.left_holds[set.left].image : ""), 'alt': ""});
            addElement(outer, 'img', null, {'class': 'overlay_img overlay_right', 'src': (board.right_holds[set.right].image ? "images/" + board.right_holds[set.right].image : ""), 'alt': ""});
            addElement(div, 'p', set.description.replace(/([^.])$/, '$1.'), {'class': 'set_description'});
            addElement(div, 'p', `Hold for ${set.hold} seconds. Rest for ${set.rest} seconds. Repeat ${set.repeat} times.`, {'class': 'set_details'});
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
        
        function calculateTimes(training) {
            let pause = 0, inter = 0, hold = 0;
            for (let set of training.sets) {
                pause += set.pause;
                inter += (set.repeat - 1) * set.rest;
                hold += set.repeat * set.hold;
            }
            return [hold, inter, pause, hold + inter + pause];
        }
    }
}

function updateEditPage(training_num) {
    const training = TRAININGS[training_num];

    const edit_content = document.getElementById('edit_content');
    if (document.getElementById('training_edit')) {
        edit_content.removeChild(document.getElementById('training_edit'));
    }

    const template_edit = document.getElementById('template_edit');
    const fragment = template_edit.content.cloneNode(true);

    const title = fragment.getElementById('edit_training_title');
    title.value = training.title;
    title.addEventListener('change', function changedTrainingTitle() {
        TRAININGS[training_num].title = this.value;
        console.log(`Setting trainings[${training_num}].title = "${this.value}".`);
        storeTrainingsAndSettings();
    });

    const description = fragment.getElementById('edit_training_description');
    description.value = training.description;
    description.addEventListener('change', function changedTrainingDescription() {
        TRAININGS[training_num].description = this.value;
        console.log(`Setting trainings[${training_num}].description = "${this.value}".`);
        storeTrainingsAndSettings();
    });

    const button_add = fragment.querySelector('button[name=add_set]');
    button_add.addEventListener("click", async function addSet() {
        TRAININGS[training_num].sets.splice(0, 0, {
            "title":        "",
            "description":  "",
            "left":         1,
            "right":        1,
            "hold":         5,
            "rest":         5,
            "repeat":       5,
            "pause":        60,
        });
        storeTrainingsAndSettings();
        updateEditPage(training_num);
    });

    edit_content.appendChild(fragment);
    
    const form = document.getElementById('training_edit');
    const template_edit_set = document.getElementById('template_edit_set');
        
    for (let set_num in training.sets) {
        const set = training.sets[set_num];
        
        const fragment = template_edit_set.content.cloneNode(true);
        fragment.querySelectorAll('label').forEach(function(label) {
            label.htmlFor += "_" + set_num;
        });
        
        const number = fragment.querySelector('.edit_set_number');
        number.innerHTML = 1 + Number(set_num);
        
        const pause = fragment.getElementById('edit_set_pause');
        pause.value = set.pause;
        pause.id += "_" + set_num;
        pause.addEventListener('change', function changeSetPause() {
            if (this.value < 15) {
                this.value = 15;
            }
            TRAININGS[training_num].sets[set_num].pause = Number(this.value);
            console.log(`Setting trainings[${training_num}].sets[${set_num}].pause = ${this.value}.`);
            storeTrainingsAndSettings();
        });
        
        const title = fragment.getElementById('edit_set_title');
        title.value = set.title;
        title.id += "_" + set_num;
        title.addEventListener('change', function changeSetTitle() {
            TRAININGS[training_num].sets[set_num].title = this.value;
            console.log(`Setting trainings[${training_num}].sets[${set_num}].title = "${this.value}".`);
            storeTrainingsAndSettings();
        });

        const description = fragment.getElementById('edit_set_description');
        description.value = set.description;
        description.id += "_" + set_num;
        description.addEventListener('change', function changeSetDescription() {
            TRAININGS[training_num].sets[set_num].description = this.value;
            console.log(`Setting trainings[${training_num}].sets[${set_num}].description = "${this.value}".`);
            storeTrainingsAndSettings();
        });

        const img_board = fragment.querySelector('img.board_img');
        const img_left = fragment.querySelector('img.overlay_left');
        const img_right = fragment.querySelector('img.overlay_right');
        
        img_board.src = "images/" + BOARDS[SETTINGS.board].image;

        const left = fragment.getElementById('edit_set_left');
        left.id += "_" + set_num;
        for (let hold_id in BOARDS[SETTINGS.board].left_holds) {
            const opt = document.createElement('option');
            opt.setAttribute('value', hold_id);
            const content = document.createTextNode(BOARDS[SETTINGS.board].left_holds[hold_id].name);
            opt.appendChild(content);
            left.appendChild(opt);
        }
        left.value = set.left;
        img_left.src = BOARDS[SETTINGS.board].left_holds[set.left].image ? "images/" + BOARDS[SETTINGS.board].left_holds[set.left].image : "";
        left.addEventListener('change', function changeSetLeft() {
            TRAININGS[training_num].sets[set_num].left = this.value;
            img_left.src = "images/" + BOARDS[SETTINGS.board].left_holds[this.value].image;
            console.log(`Setting trainings[${training_num}].sets[${set_num}].left = ${this.value} (${this.item(this.selectedIndex).text}).`);
            storeTrainingsAndSettings();
        });

        const right = fragment.getElementById('edit_set_right');
        right.id += "_" + set_num;
        for (let hold_id in BOARDS[SETTINGS.board].right_holds) {
            const opt = document.createElement('option');
            opt.setAttribute('value', hold_id);
            const content = document.createTextNode(BOARDS[SETTINGS.board].right_holds[hold_id].name);
            opt.appendChild(content);
            right.appendChild(opt);
        }
        right.value = set.right;
        img_right.src = BOARDS[SETTINGS.board].right_holds[set.right].image ? "images/" + BOARDS[SETTINGS.board].right_holds[set.right].image : "";
        right.addEventListener('change', function changeSetRight() {
            TRAININGS[training_num].sets[set_num].right = this.value;
            img_right.src = "images/" + BOARDS[SETTINGS.board].right_holds[this.value].image;
            console.log(`Setting trainings[${training_num}].sets[${set_num}].right = ${this.value} (${this.item(this.selectedIndex).text}).`);
            storeTrainingsAndSettings();
        });

        const hold = fragment.getElementById('edit_set_hold');
        hold.value = set.hold;
        hold.id += "_" + set_num;
        hold.addEventListener('change', function changeSetHold() {
            if (this.value < 1) {
                this.value = 1;
            }
            TRAININGS[training_num].sets[set_num].hold = Number(this.value);
            console.log(`Setting trainings[${training_num}].sets[${set_num}].hold = ${this.value}.`);
            storeTrainingsAndSettings();
        });
        
        const interr = fragment.getElementById('edit_set_rest');
        interr.value = set.rest;
        interr.id += "_" + set_num;
        interr.addEventListener('change', function changeSetRest() {
            if (this.value < 1) {
                this.value = 1;
            }
            TRAININGS[training_num].sets[set_num].rest = Number(this.value);
            console.log(`Setting trainings[${training_num}].sets[${set_num}].rest = ${this.value}.`);
            storeTrainingsAndSettings();
        });
        
        const repeat = fragment.getElementById('edit_set_repeat');
        repeat.value = set.repeat;
        repeat.id += "_" + set_num;
        repeat.addEventListener('change', function changeSetRepeat() {
            if (this.value < 1) {
                this.value = 1;
            }
            TRAININGS[training_num].sets[set_num].repeat = Number(this.value);
            console.log(`Setting trainings[${training_num}].sets[${set_num}].repeat = ${this.value}.`);
            storeTrainingsAndSettings();
        });
        
        const button_add = fragment.querySelector('button[name=add_set]');
        button_add.addEventListener("click", async function addSet() {
            TRAININGS[training_num].sets.splice(Number(set_num) + 1, 0, {
                "title":        "",
                "description":  "",
                "left":         1,
                "right":        1,
                "hold":         5,
                "rest":         5,
                "repeat":       5,
                "pause":        60,
            });
            storeTrainingsAndSettings();
            updateEditPage(training_num);
        });
        
        const button_delete = fragment.querySelector('button[name=delete_set]');
        button_delete.addEventListener("click", async function deleteSet() {
            TRAININGS[training_num].sets.splice(set_num, 1);
            storeTrainingsAndSettings();
            updateEditPage(training_num);
        });
        
        form.appendChild(fragment);
    }
}

function navigateTo(page) {
    window.location.hash = page;
}

function handleRouting(event) {
    let match = location.hash.match(/#?([^_]+)_?(\d*)/);
    const new_page = match ? match[1] : "";
    const new_num = match ? match[2] : null;
    let old_page = "", old_num = null;
    if (event) {
        match = event.oldURL.match(/[^#]*#?([^_]+)_?(\d*)/);
        old_page = match ? match[1] : "";
        old_num = match ? match[2] : null;
    }
    console.log(`Navigating to ${new_page}`);
    if (old_page == "run") {
        // TODO: are you sure?
        COUNTER.stop();
    }
    window.scrollTo(0,0);
    switch (new_page) {
        case "":
            updateMainPage();
            document.getElementById("toolbar_title").innerText = "nappy fingers";
            document.getElementById("toolbar_icon_back").style.display = "none";
            document.getElementById("toolbar_icon_menu").style.display = "inline";
            document.getElementById("main_content").style.display = "block";
            document.getElementById("run_content").style.display = "none";
            document.getElementById("edit_content").style.display = "none";
            document.getElementById("about_content").style.display = "none";
            break;
        case "edit":
            updateEditPage(new_num);
            document.getElementById("toolbar_title").innerText = TRAININGS[new_num].title;
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("toolbar_icon_menu").style.display = "none";
            document.getElementById("main_content").style.display = "none";
            document.getElementById("run_content").style.display = "none";
            document.getElementById("edit_content").style.display = "block";
            document.getElementById("about_content").style.display = "none";
            break;
        case "run":
            document.getElementById("toolbar_title").innerText = TRAININGS[new_num].title;
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("toolbar_icon_menu").style.display = "none";
            document.getElementById("main_content").style.display = "none";
            document.getElementById("run_content").style.display = "block";
            document.getElementById("edit_content").style.display = "none";
            document.getElementById("about_content").style.display = "none";
            break;
        case "about":
            document.getElementById("toolbar_title").innerText = "About";
            document.getElementById("toolbar_icon_back").style.display = "inline";
            document.getElementById("toolbar_icon_menu").style.display = "none";
            document.getElementById("main_content").style.display = "none";
            document.getElementById("run_content").style.display = "none";
            document.getElementById("edit_content").style.display = "none";
            document.getElementById("about_content").style.display = "block";
            break;
    }
}

function init() {
    const board_select = document.getElementsByName('board_select')[0];
    const training_select = document.getElementsByName('training_select')[0];
    
    StatusBar.hide();

    loadTrainingsAndSettings();

    window.addEventListener('hashchange', handleRouting);

    window.addEventListener("backbutton", function popstate(event) {
        console.log("backbutton event " + event);
    }, false);

    const start_button = document.getElementsByName('start')[0];
    start_button.addEventListener("click", async function startTraining() {
        const selected_training_num = training_select.options[training_select.selectedIndex].value;
        navigateTo("run_" + selected_training_num);
        try {
            window.plugins.insomnia.keepAwake();
            await runTraining(BOARDS[SETTINGS.board], TRAININGS[selected_training_num]);
            navigateTo("");
        }
        catch (err) {
            console.log(`Training aborted (${err})`);
        }
        finally {
            window.plugins.insomnia.allowSleepAgain();
        }
    });

    const edit_button = document.getElementsByName('edit')[0];
    edit_button.addEventListener("click", async function editTraining() {
        const selected_training_num = training_select.options[training_select.selectedIndex].value;
        navigateTo(`edit_${selected_training_num}`);
    });

    const clone_button = document.getElementsByName('clone')[0];
    clone_button.addEventListener("click", async function cloneTraining() {
        const selected_training_num = Number(training_select.options[training_select.selectedIndex].value);
        TRAININGS.splice(selected_training_num, 0, JSON.parse(JSON.stringify(TRAININGS[selected_training_num])));
        TRAININGS[selected_training_num + 1].title += " (copy)";
        storeTrainingsAndSettings();
        updateMainPage(selected_training_num + 1);
        window.scrollTo(0,0);
    });

    const delete_button = document.getElementsByName('delete')[0];
    delete_button.addEventListener("click", async function editTraining() {
        if (TRAININGS.length > 1) {
            const selected_training_num = training_select.options[training_select.selectedIndex].value;
            // TODO: confirm
            TRAININGS.splice(selected_training_num, 1);
            storeTrainingsAndSettings();
            updateMainPage(0);
            window.scrollTo(0,0);
        }
        // TODO: else cannot delete last training
        // TODO: delete button disablen
    });

    const pause_button = document.getElementsByName("pause")[0];
    pause_button.addEventListener("click", COUNTER.pause);

	var TouchMenu = TouchMenuLA({
		target: document.getElementById('drawer'),
        width: Math.min(Math.min(screen.availWidth, screen.availHeight) - 56, 280),
        zIndex: 2 
	});
	document.getElementById('toolbar_icon_menu').addEventListener('click', function(event){
		TouchMenu.toggle();
	}, false);
    document.getElementById('a_export_trainings').addEventListener('click', function(event){
        event.preventDefault();
        TouchMenu.close();
        downloadTrainings();
	}, false);
    document.getElementById("a_import_trainings").addEventListener("click", function(event) {
        event.preventDefault();
        TouchMenu.close();
        document.getElementById("fileElem").click();
    }, false);
    document.getElementById("a_restore_trainings").addEventListener("click", function restoreTrainings(event) {
        event.preventDefault();
        TouchMenu.close();
        TRAININGS = DEFAULT_TRAININGS;
        console.log('Restored default trainings');
        storeTrainingsAndSettings();
        updateMainPage();
    }, false);
    document.getElementById('a_about').addEventListener('click', function(event){
        event.preventDefault();
        TouchMenu.close();
        navigateTo('about');
	}, false);
    document.getElementById('drawer').style.display = "block";

    handleRouting();
}


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

import { makeObservable } from "./lib/observable.js";

import { settings } from "./settings.js";

export const PROGRAMS = makeObservable({
    custom: {},
    default: {
        "version": 3,
        "bm1000": [
            {
                "title":        "Warm up",
                "description":  "Properly warming up is very important to avoid injuries",
                "exercises":    [
                    {
                        "title":        "Jug pull ups",
                        "description":  "Pull up twice",
                        "left":         1,
                        "right":        1,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       3,
                        "pause":        15,
                    },
                    {
                        "title":        "Jug hang",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         8,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        30,
                    },
                    {
                        "title":        "Four fingers lock off",
                        "description":  "Pull up and lock off with bent arms",
                        "left":         5,
                        "right":        5,
                        "hold":         6,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        60,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         5,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        30,
                    }
                ]
            },
            {
                "title":        "Hang time",
                "description":  "Much hang time on good holds",
                "exercises":    [
                    {
                        "title":        "Warm up",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        15,
                    },
                    {
                        "title":        "Pull up 2x and hang",
                        "description":  "Pull up twice, then hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         10,
                        "rest":         10,
                        "repeat":       3,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       4,
                        "pause":        90,
                    },
                    {
                        "title":        "Three fingers right side",
                        "description":  "Pull up once and stay with bent arms",
                        "left":         1,
                        "right":        9,
                        "hold":         5,
                        "rest":         7,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Three fingers left side",
                        "description":  "Pull up once and stay with bent arms",
                        "left":         9,
                        "right":        1,
                        "hold":         5,
                        "rest":         7,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers pull up",
                        "description":  "Pull up once, then hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         5,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        120,
                    },
                    {
                        "title":        "Jug hang",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        120,
                    }
                ]
            },
            {
                "title":        "Pocket pull ups",
                "description":  "Pull ups on good finger pockets",
                "exercises":    [
                    {
                        "title":        "Warm up",
                        "description":  "Pull up once and stay with bent arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        15,
                    },
                    {
                        "title":        "Four plus two pull up and hang",
                        "description":  "Pull up once, then hang on straight arms",
                        "left":         5,
                        "right":        7,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        90,
                    },
                    {
                        "title":        "Two plus four pull up and hang",
                        "description":  "Pull up once, then hang on straight arms",
                        "left":         7,
                        "right":        5,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Three fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         9,
                        "right":        9,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       6,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers pull up 2x and stay",
                        "description":  "Pull up twice, then stay with bent arms",
                        "left":         5,
                        "right":        5,
                        "hold":         8,
                        "rest":         10,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Jug pull up and hang",
                        "description":  "Pull up once, then hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         8,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        120,
                    }
                ]
            },
            {
                "title":        "Just hang",
                "description":  "Boring hangs on good and medium pockets",
                "exercises":    [
                    {
                        "title":        "Warm up",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        15,
                    },
                    {
                        "title":        "Three finger right side",
                        "description":  "Hang on straight arms",
                        "left":         9,
                        "right":        11,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        60,
                    },
                    {
                        "title":        "Three finger left side",
                        "description":  "Hang on straight arms",
                        "left":         11,
                        "right":        9,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Two fingers left side",
                        "description":  "Hang on straight arms",
                        "left":         7,
                        "right":        9,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Two fingers right side",
                        "description":  "Hang on straight arms",
                        "left":         9,
                        "right":        7,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers chill out",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         7,
                        "rest":         5,
                        "repeat":       7,
                        "pause":        120,
                    }
                ]
            },
            {
                "title": "Maximum strength",
                "description": "Maximum finger strength training",
                "exercises": [
                    {
                        "title":        "Four fingers open hand",
                        "description":  "Four fingers open hand. Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         12,
                        "rest":         120,
                        "repeat":       5,
                        "pause":        15
                    },
                    {
                        "title":        "Three finger open hand",
                        "description":  "Three fingers open hand. Hang on straight arms",
                        "left":         11,
                        "right":        11,
                        "hold":         10,
                        "rest":         150,
                        "repeat":       5,
                        "pause":        180
                    },
                    {
                        "title":        "Half crimp",
                        "description":  "Four finger half crimp. Hang on straight arms",
                        "left":         6,
                        "right":        6,
                        "hold":         10,
                        "rest":         150,
                        "repeat":       5,
                        "pause":        180
                    },
                ]
            },
            {
                "title": "Max two finger strength",
                "description": "Maximum finger strength training for two-finger grips",
                "exercises": [
                    {
                        "title":        "Two fingers RM open hand",
                        "description":  "Ring and middle finger open hand. Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         10,
                        "rest":         150,
                        "repeat":       5,
                        "pause":        15
                    },
                    {
                        "title":        "Two fingers MI open hand",
                        "description":  "Ring and middle finger fully open hand. Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         10,
                        "rest":         150,
                        "repeat":       5,
                        "pause":        180
                    }
                ]
            }
        ],
        "bm2000": [
            {
                "title":        "Warm up",
                "description":  "Properly warming up is very important to avoid injuries",
                "exercises":    [
                    {
                        "title":        "Four fingers pull ups",
                        "description":  "Pull up twice",
                        "left":         5,
                        "right":        5,
                        "hold":         4,
                        "rest":         3,
                        "repeat":       3,
                        "pause":        15,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         10,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        20,
                    },
                    {
                        "title":        "Four fingers lock off",
                        "description":  "Pull up and lock off with bent arms",
                        "left":         5,
                        "right":        5,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        30,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         5,
                        "right":        5,
                        "hold":         5,
                        "rest":         3,
                        "repeat":       5,
                        "pause":        30,
                    }
                ]
            },
            {
                "title": "Maximum strength",
                "description": "Maximum finger strength training",
                "exercises": [
                    {
                        "title":        "Four fingers open hand",
                        "description":  "Four fingers open hand. Hang on straight arms with shoulders engaged",
                        "left":         10,
                        "right":        10,
                        "hold":         10,
                        "rest":         45,
                        "repeat":       5,
                        "pause":        15
                    },
                    {
                        "title":        "Three finger open hand",
                        "description":  "Three fingers fully open hand. Hang on straight arms with shoulders engaged",
                        "left":         5,
                        "right":        5,
                        "hold":         10,
                        "rest":         45,
                        "repeat":       5,
                        "pause":        60
                    },
                    {
                        "title":        "Half crimp",
                        "description":  "Half crimp. Hang on straight arms with shoulders engaged",
                        "left":         10,
                        "right":        10,
                        "hold":         10,
                        "rest":         45,
                        "repeat":       5,
                        "pause":        60
                    },
                    {
                        "title":        "Two fingers RM open hand",
                        "description":  "Ring and middle finger fully open hand. Hang on straight arms with shoulders engaged",
                        "left":         12,
                        "right":        12,
                        "hold":         8,
                        "rest":         60,
                        "repeat":       5,
                        "pause":        60
                    },
                    {
                        "title":        "Two fingers MI open hand",
                        "description":  "Ring and middle finger fully open hand. Hang on straight arms with shoulders engaged",
                        "left":         12,
                        "right":        12,
                        "hold":         7,
                        "rest":         60,
                        "repeat":       5,
                        "pause":        60
                    }
                ]
            }
        ],
        "griptonite": [
            {
                "title":        "Warm up",
                "description":  "Properly warming up is very important to avoid injuries",
                "exercises":    [
                    {
                        "title":        "Four fingers pull ups",
                        "description":  "Pull up twice",
                        "left":         7,
                        "right":        7,
                        "hold":         4,
                        "rest":         3,
                        "repeat":       3,
                        "pause":        15,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         7,
                        "right":        7,
                        "hold":         10,
                        "rest":         5,
                        "repeat":       5,
                        "pause":        20,
                    },
                    {
                        "title":        "Four fingers lock off",
                        "description":  "Pull up and lock off with bent arms",
                        "left":         7,
                        "right":        7,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        30,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         7,
                        "right":        7,
                        "hold":         5,
                        "rest":         3,
                        "repeat":       5,
                        "pause":        30,
                    }
                ]
            },
            {
                "title":        "Hang time",
                "description":  "Much hang time on good holds",
                "exercises":    [
                    {
                        "title":        "Warm up",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        15,
                    },
                    {
                        "title":        "Pull up 2x and hang",
                        "description":  "Pull up twice, then hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         10,
                        "rest":         10,
                        "repeat":       3,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         7,
                        "right":        7,
                        "hold":         6,
                        "rest":         4,
                        "repeat":       4,
                        "pause":        90,
                    },
                    {
                        "title":        "Three fingers right side",
                        "description":  "Pull up once and stay with bent arms",
                        "left":         1,
                        "right":        5,
                        "hold":         5,
                        "rest":         7,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Three fingers left side",
                        "description":  "Pull up once and stay with bent arms",
                        "left":         5,
                        "right":        1,
                        "hold":         5,
                        "rest":         7,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers pull up",
                        "description":  "Pull up once, then hang on straight arms",
                        "left":         7,
                        "right":        7,
                        "hold":         5,
                        "rest":         4,
                        "repeat":       5,
                        "pause":        120,
                    },
                    {
                        "title":        "Four fingers hang",
                        "description":  "Hang on straight arms",
                        "left":         7,
                        "right":        7,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        120,
                    },
                    {
                        "title":        "Jug hang",
                        "description":  "Hang on straight arms",
                        "left":         1,
                        "right":        1,
                        "hold":         7,
                        "rest":         4,
                        "repeat":       7,
                        "pause":        120,
                    }
                ]
            }
        ]
    }
});

export function savePrograms() {
    window.localStorage.setItem('programs', JSON.stringify(PROGRAMS.custom));
}

export function loadPrograms() {
    let programs = JSON.parse(window.localStorage.getItem('programs'));
    if (programs != null) {
        if (programs.version != PROGRAMS.default.version) {
            programs = { "version": PROGRAMS.default.version };
            console.warn('Stored custom programs outdated. Discarding. Sorry for that.');
        }
    }
    else {
        programs = { "version": PROGRAMS.default.version };
        console.info('No stored custom programs found.');
    }

    PROGRAMS.custom = programs;
}

export function cloneProgram(identifier) {
    let clone = JSON.parse(JSON.stringify(getProgram(identifier)));
    clone.title += " (copy)";
    const customPrograms = PROGRAMS.custom; 
    customPrograms[settings.selectedBoardID] = (customPrograms[settings.selectedBoardID] || []).concat([clone]);
    PROGRAMS.custom = customPrograms;
    // TODO return if of cloned program
}

export function deleteProgram(identifier) {
    const index = identifier.substr(1);
    const customPrograms = PROGRAMS.custom;
    customPrograms[settings.selectedBoardID] = customPrograms[settings.selectedBoardID].filter((_, i) =>
        i != index
    );
    PROGRAMS.custom = customPrograms;
}

export function getProgram(identifier) {
    // identifier: e.g. c1
    const type = identifier.substr(0, 1);
    const num = identifier.substr(1);
    let program;
    if (type == 'c') {
        program = PROGRAMS.custom[settings.selectedBoardID][num];
    }
    else if (type == 'd') {
        program = PROGRAMS.default[settings.selectedBoardID][num];
    }
    return program;
}

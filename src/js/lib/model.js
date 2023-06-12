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

export class Model {
    constructor(init, name) {
        this.observers = Object.create(null);
        this.name = name;
        this.data = new Proxy(init, {
            set: (target, key, value) => {
                target[key] = value;
                if (this.observers[key])
                    this.observers[key].dispatchEvent(new Event('change'));
                return true;
            }
        });
    }

    addObserver(key, observer) {
        if (!Object.prototype.hasOwnProperty.call(this.data, key))
            throw new Error(`key "${key}' does not exist`);
        if (!this.observers[key])
            this.observers[key] = document.createTextNode(null);
        this.observers[key].addEventListener("change", observer, false);
    }

    removeObserver(key, observer) {
        if (!Object.prototype.hasOwnProperty.call(this.data, key))
            throw new Error(`key "${key}' does not exist`);
        this.observers[key].removeEventListener("change", observer, false);
    }

    save() {
        if (!this.name)
            throw new Error("model has no name");
        console.log(`storing model "${this.name}"`);
        window.localStorage.setItem(this.name, JSON.stringify(this.data));
    }

    load() {
        if (!this.name)
            throw new Error("model has no name");
        console.log(`loading model "${this.name}"`);
        let data = JSON.parse(window.localStorage.getItem(this.name));
        Object.assign(this.data, data);
    }
}

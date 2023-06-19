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
                    // The use of setTimeout ensures that the event is dispatched asynchronously
                    setTimeout(() => this.observers[key].dispatchEvent(new Event('change')), 0);
                return true;
            }
        });
    }

    addObserver(owner, key, observer, runImmediately = false) {
        if (!Object.prototype.hasOwnProperty.call(this.data, key))
            throw new Error(`key "${key}' does not exist`);
        if (owner.isConnected === false)
            throw new Error("owner is not connected");
        if (!this.observers[key])
            this.observers[key] = document.createTextNode(null);

        const eventListener = () => observer(this.data[key]);
        this.observers[key].addEventListener("change", eventListener, false);

        (new MutationObserver((mutationsList, mutationObserver) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.removedNodes) {
                    if (node === owner) {
                        this.observers[key].removeEventListener("change", eventListener, false);
                        mutationObserver.disconnect();
                    }
                }
            }
        })).observe(owner.parentNode, { childList: true });

        if (runImmediately)
            eventListener();
    }

    save() {
        if (!this.name)
            throw new Error("model has no name");
        window.localStorage.setItem(this.name, JSON.stringify(this.data));
    }

    load() {
        if (!this.name)
            throw new Error("model has no name");
        const data = JSON.parse(window.localStorage.getItem(this.name));
        Object.assign(this.data, data);
    }
}

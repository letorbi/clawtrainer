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


function addObserver(target, observers, owner, key, observer, runImmediately) {
    if (!Object.prototype.hasOwnProperty.call(target, key))
        throw new Error(`key "${key}' does not exist`);
    if (owner.isConnected === false)
        throw new Error("owner is not connected");
    if (!observers[key])
        observers[key] = document.createTextNode(null);

    const eventListener = () => observer(target[key]);
    observers[key].addEventListener("change", eventListener, false);

    (new MutationObserver((mutationsList, mutationObserver) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.removedNodes) {
                if (node === owner) {
                    observers[key].removeEventListener("change", eventListener, false);
                    mutationObserver.disconnect();
                }
            }
        }
    })).observe(owner.parentNode, { childList: true });

    if (runImmediately)
        eventListener();
}

export function makeObservable(init) {
    if (Object.prototype.hasOwnProperty.call(init, "addObserver"))
        throw new Error("init has reserved property name: addObserver");

    const observers = Object.create(null);

    return new Proxy(init, {
        get: (target, key) => {
            if (key === "addObserver")
                return (owner, key, observer, runImmediately = false) => {
                    addObserver(target, observers, owner, key, observer, runImmediately);
                };
            return target[key];
        },
        set: (target, key, value) => {
            target[key] = value;
            if (observers[key])
                // The use of setTimeout ensures that the event is dispatched in the next loop iteration.
                setTimeout(() => observers[key].dispatchEvent(new Event('change')), 0);
            return true;
        }
    });
}

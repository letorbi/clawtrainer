import { ComponentElement } from '../lib/component.js';

export class AboutPage extends ComponentElement {
    connectedCallback() {
        super.connectedCallback(html);
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
        <div id="about_content">
            <p>Claw Trainer is licensed as open-source under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">the GPL version 3</a>.</p>
            <p><a href="https://github.com/letorbi/clawtrainer/">See the source code and report issues on GitHub.</a></p>
            <p>Copyright (c) 2023 Torben Haase & contributors<br>
                Copyright (c) 2020-2023 Daniel Schroer & contributors<br>
                Copyright (c) 2017-2020 Daniel Schroer</p>
            <h3>Splash screen</h3>
            <p>Photo by <a href="https://unsplash.com/@speckfechta">x )</a> on <a href="https://unsplash.com/photos/N4QTBfNQ8Nk">Unsplash</a></p>
        </div>
    </ion-content>
`;

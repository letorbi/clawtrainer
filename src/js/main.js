import { MainPage } from './MainPage.js';
import { EditPage } from './EditPage.js';
import { RunPage } from './RunPage.js';
import { SelectPage } from './SelectPage.js';
import { SettingsPage } from './SettingsPage.js';
import { AboutPage } from './AboutPage.js';

customElements.define('page-main', MainPage);
customElements.define('page-edit', EditPage);
customElements.define('page-run', RunPage);
customElements.define('page-select', SelectPage);
customElements.define('page-settings', SettingsPage);
customElements.define('page-about', AboutPage);

import {
    Utils
} from '../Utils.js';
import {
    ExitButton,
    HelpButton,
    StartButton,
    ToggleAudioButton,
    userDataManager,
    gameBridge
} from '../../node_modules/@cainc/game-common/src/js/index.js'; // eslint-disable-line
import {
    helpScreens
} from '../HelpData.js';
import * as consts from '../Constants.js';

const LAYOUT = {
    ADD_START_X: 450,
    ADD_START_Y: 650,

    EXIT_X: 1150,
    EXIT_Y: 55,

    HELP_X: 840,
    HELP_Y: 650,

    AUDIO_X: 15,
    AUDIO_Y: 55,
};
Object.freeze(LAYOUT);

export default class MainMenu extends Phaser.State {
    create() {
        this.game.stage.backgroundColor = '#88E1DB';
        const buttonSound = this.game.add.audio('sfxButton');
        Utils.addPaws(this.game);
        this.game.add.image(0, 0, 'title_background');
        if (gameBridge.shouldShowExitButton) {
            this.exitButton = new ExitButton(this, LAYOUT.EXIT_X, LAYOUT.EXIT_Y, {
                atlas: 'assets',
                out: 'btnX0001.png',
                over: 'btnX0001.png',
                down: 'btnX0002.png',
            });
        }
        this.helpButton = new HelpButton(this, LAYOUT.HELP_X, LAYOUT.HELP_Y, {
            atlas: 'assets',
            over: 'btnHelp0001.png',
            out: 'btnHelp0001.png',
            down: 'btnHelp0002.png',
            upSound: buttonSound,
        }, helpScreens);
        this.addStartButton = new StartButton(this, LAYOUT.ADD_START_X, LAYOUT.ADD_START_Y, {
            atlas: 'assets',
            over: 'btnPlay0001.png',
            out: 'btnPlay0001.png',
            down: 'btnPlay0002.png',
            upSound: buttonSound,
        }, consts.DEBUGGING === true || userDataManager.data.playHelpViewed ? null : helpScreens, 'Play');
        this.toggleAudioButton = new ToggleAudioButton(this, LAYOUT.AUDIO_X, LAYOUT.AUDIO_Y, {
            atlas: 'assets',
            out: 'btnAudio0001.png',
            over: 'btnAudio0001.png',
            down: 'btnAudio0001.png',
            up: 'btnAudio0001.png',
            offOut: 'btnAudio0002.png',
            offOver: 'btnAudio0002.png',
            offDown: 'btnAudio0002.png',
            offUp: 'btnAudio0002.png',
            upSound: buttonSound,
        });
        // displayGame();
        const music = this.game.add.audio('musicMenu');
        music.loop = true;
        music.volume = 0.3;
        music.play();
    }

    shutdown() {
        this.game.sound.stopAll();
    }
}



// WEBPACK FOOTER //
// ./src/states/MainMenu.js
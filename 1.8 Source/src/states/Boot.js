import {
    webAudioUtil
} from '../../node_modules/@cainc/game-common/src/js/index.js'; // eslint-disable-line

export default class Boot extends Phaser.State {
    init() {
        webAudioUtil.testAudioDecoding().then((result) => {
            if (!result) {
                console.info('Detected decoding issue...');
                // AV comes from aurora
                // eslint-disable-next-line no-undef
                webAudioUtil.enableAlternateDecoder(AV, window.game.sound.context);
            }
        });

        // Recommended to leave as 1 unless you need multi-touch support
        this.input.maxPointers = 1;

        // Phaser will automatically pause if the browser tab the game is in loses focus
        this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.sound.muteOnPause = true;
        // disable right-click
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    preload() {
        // Load anything you need for the preloader (e.g. loading bars) here
        this.load.image('loadingBarBG', 'assets/loadingBar0001.png');
        this.load.image('loadingBarFG', 'assets/loadingBar0003.png');
        this.load.image('title_background', 'assets/title_background.png');
    }

    create() {
        // Set the stage background colour
        this.game.stage.backgroundColor = '#88E1DB';

        // method in index.html:
        displayGame(); // eslint-disable-line no-undef

        // Everything from the preload function will have been loaded into cache by
        // this point, so we can now start the preloader
        this.state.start('Preloader');
    }
}



// WEBPACK FOOTER //
// ./src/states/Boot.js
import {
    userDataManager
} from '../../node_modules/@cainc/game-common/src/js/index.js';

export default class Preloader extends Phaser.State {
    preload() {
        // These are the assets we loaded in Boot.js
        this.game.add.image(0, 0, 'title_background');

        this.game.add.image(400, 705, 'loadingBarBG');
        const loadingBar = this.game.add.sprite(400, 705, 'loadingBarFG');
        this.game.add.text(1250, 937, 'placeholder', {
            fill: 'white',
            font: '24pt balooregular',
        });
        // Sets a basic loading bar
        this.load.setPreloadSprite(loadingBar);

        // Load any assets for the game here
        this.load.atlas('assets', 'assets/assets.png', 'assets/assets.json');
        // this.load.image('bg_tilesprite', 'assets/bg_tilesprite.png');
        this.load.physics('p2Assets', 'assets/p2Assets.json');

        // main menu state:
        this.load.image('help_background', 'assets/help_background.png');
        this.load.image('tutorial0001', 'assets/tutorial0001.png');
        this.load.image('tutorial0002', 'assets/tutorial0002.png');

        // game over state:
        this.load.image('game_over_background', 'assets/game_over_background.png');
        this.load.image('star', 'assets/star.png');

        // audio
        this.load.audio('AngryMeow01', ['assets/audio/AngryMeow01.mp3', 'assets/audio/AngryMeow01.m4a', 'assets/audio/AngryMeow01.ogg']);
        this.load.audio('Meow01', ['assets/audio/Meow01.mp3', 'assets/audio/Meow01.m4a', 'assets/audio/Meow01.ogg']);
        this.load.audio('Meow02', ['assets/audio/Meow02.mp3', 'assets/audio/Meow02.m4a', 'assets/audio/Meow02.ogg']);
        this.load.audio('PurrMeow01', ['assets/audio/PurrMeow01.mp3', 'assets/audio/PurrMeow01.m4a', 'assets/audio/PurrMeow01.ogg']);
        this.load.audio('PurrMeow02', ['assets/audio/PurrMeow02.mp3', 'assets/audio/PurrMeow02.m4a', 'assets/audio/PurrMeow02.ogg']);
        this.load.audio('ShortMeow01', ['assets/audio/ShortMeow01.mp3', 'assets/audio/ShortMeow01.m4a', 'assets/audio/ShortMeow01.ogg']);
        this.load.audio('ShortMeow02', ['assets/audio/ShortMeow02.mp3', 'assets/audio/ShortMeow02.m4a', 'assets/audio/ShortMeow02.ogg']);
        this.load.audio('TinyCatMeow01', ['assets/audio/TinyCatMeow01.mp3', 'assets/audio/TinyCatMeow01.m4a', 'assets/audio/TinyCatMeow01.ogg']);
        this.load.audio('TinyCatMeow02', ['assets/audio/TinyCatMeow02.mp3', 'assets/audio/TinyCatMeow02.m4a', 'assets/audio/TinyCatMeow02.ogg']);

        this.load.audio('musicGame', ['assets/audio/musicGame.mp3', 'assets/audio/musicGame.m4a', 'assets/audio/musicGame.ogg']);
        this.load.audio('musicMenu', ['assets/audio/musicMenu.mp3', 'assets/audio/musicMenu.m4a', 'assets/audio/musicMenu.ogg']);
        this.load.audio('sfxButton', ['assets/audio/sfxButton.mp3', 'assets/audio/sfxButton.m4a', 'assets/audio/sfxButton.ogg']);
        this.load.audio('sfxDing', ['assets/audio/sfxDing.mp3', 'assets/audio/sfxDing.m4a', 'assets/audio/sfxDing.ogg']);
        this.load.audio('sfxTimer', ['assets/audio/sfxTimer.mp3', 'assets/audio/sfxTimer.m4a', 'assets/audio/sfxTimer.ogg']);
        this.load.audio('sfxDrop', ['assets/audio/sfxDrop.mp3', 'assets/audio/sfxDrop.m4a', 'assets/audio/sfxDrop.ogg']);
        this.load.audio('sfxWhistle', ['assets/audio/sfxWhistle.mp3', 'assets/audio/sfxWhistle.m4a', 'assets/audio/sfxWhistle.ogg']);
    }

    _nextState() {
        this.state.start('MainMenu');
    }

    create() {
        _.bindAll(this, '_nextState');
        userDataManager.load(this._nextState, this._nextState);
    }
}



// WEBPACK FOOTER //
// ./src/states/Preloader.js
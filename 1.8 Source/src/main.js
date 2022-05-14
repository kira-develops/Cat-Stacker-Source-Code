import Boot from './states/Boot.js';
import Preloader from './states/Preloader.js';
import Play from './states/Play.js';
import CatScoreBoard from './states/CatScoreBoard.js';
import MainMenu from './states/MainMenu.js';
import {
    STAGE_SIZE
} from './Constants.js';
// import { ScoreBoard } from '@cainc/game-common'; // eslint-disable-line


class Game extends Phaser.Game {
    constructor() {
        super(STAGE_SIZE.width, STAGE_SIZE.height, Phaser.CANVAS, 'gameContainer');

        this.state.add('Boot', Boot);
        this.state.add('Preloader', Preloader);
        this.state.add('MainMenu', MainMenu);
        this.state.add('Play', Play);
        this.state.add('CatScoreBoard', CatScoreBoard);
        // this.state.add('ScoreBoard', ScoreBoard);

        this.state.start('Boot');
    }
}

window.game = new Game();



// WEBPACK FOOTER //
// ./src/main.js
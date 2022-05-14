import {
    Utils
} from '../Utils.js';
// import { ScoreBoard, LAYOUT } from '@cainc/game-common'; // eslint-disable-line
import {
    ScoreBoard,
    LAYOUT
} from './ScoreBoard.js'; // eslint-disable-line
// import LAYOUT from './ScoreBoard'; // eslint-disable-line

export default class CatScoreBoard extends ScoreBoard {
    create() {
        this.game.stage.backgroundColor = '#88E1DB';
        // override defaults in super:
        _.merge(LAYOUT, {
            EXIT_X: 520,
            EXIT_Y: 730,
            SCORE_STYLE: {
                fill: 'white',
                align: 'center',
                boundsAlignH: 'center',
                font: '100pt balooregular',
            },
            HIGH_SCORE_LAYOUT: [{
                    STAR_X: 50,
                    LIST_X: 100,
                    NAME_X: 140,
                    SCORE_X: 400,
                    SCORE_WIDTH: 100,
                },
                {
                    STAR_X: 660,
                    LIST_X: 710,
                    NAME_X: 750,
                    SCORE_X: 1010,
                    SCORE_WIDTH: 100,
                },
            ],
            LIST_STYLE: {
                fill: '#32615D',
                font: '35pt balooregular',
            },
            LIST_SCORE_STYLE: {
                fill: '#32615D',
                font: '35pt balooregular',
            },
        });

        const music = this.game.add.audio('musicMenu');
        music.loop = true;
        music.volume = 0.3;
        music.play();

        super.create();
    }

    shutdown() {
        this.game.sound.stopAll();
    }

    init(score) {
        Utils.addPaws(this.game);
        super.init(score);
        _.defer(() => {
            this._text.text = `${score} Feet`;
        });
    }
}



// WEBPACK FOOTER //
// ./src/states/CatScoreBoard.js
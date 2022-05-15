import {
    ExitButton,
    gameBridge
} from '../../node_modules/@cainc/game-common/src/js/index.js'; // eslint-disable-line

export const LAYOUT = {
    EXIT_X: 473,
    EXIT_Y: 800,
    EXIT_ASSET_OPTIONS: {
        atlas: 'assets',
        over: 'btnDone0001.png',
        out: 'btnDone0001.png',
        down: 'btnDone0002.png',
    },

    SCORE_X: 455,
    SCORE_Y: 170,
    SCORE_WIDTH: 356,
    SCORE_HEIGHT: 46,
    SCORE_STYLE: {
        boundsAlignH: 'center'
    },

    HIGH_SCORE_LAYOUT: [{
            STAR_X: 121,
            LIST_X: 176,
            NAME_X: 206,
            SCORE_X: 500,
            SCORE_WIDTH: 67,
        },
        {
            STAR_X: 621,
            LIST_X: 676,
            NAME_X: 706,
            SCORE_X: 999,
            SCORE_WIDTH: 67,
        },
    ],
    LIST_STYLE: {},
    LIST_SCORE_STYLE: {
        boundsAlignH: 'right'
    },

    SCORE_START_Y: 467,
    SCORE_ROW_HEIGHT: 50,
    SCORE_START_DY: 10,
};
// Object.freeze(LAYOUT);
// Object.freeze(LAYOUT.HIGH_SCORE_LAYOUT);
// Object.freeze(LAYOUT.HIGH_SCORE_LAYOUT[0]);
// Object.freeze(LAYOUT.HIGH_SCORE_LAYOUT[1]);

const NAME_MAX = 8;
const SCORE_ROWS = 5;

export class ScoreBoard extends Phaser.State {
    init(score) {
        this._score = score;
    }

    create() {
        const {
            sendScore,
            skipScoreCard = false,
            close
        } = gameBridge;

        if (skipScoreCard) {
            sendScore && sendScore(this._score);
            return close();
        }

        _.bindAll(this, 'showHighScores');
        this.background = this.add.image(0, 0, 'game_over_background');
        if (gameBridge.shouldShowExitButton) {
            this.exitButton = new ExitButton(this, LAYOUT.EXIT_X, LAYOUT.EXIT_Y, LAYOUT.EXIT_ASSET_OPTIONS);
        }
        this._text = this.add.text(0, 0, this._score, LAYOUT.SCORE_STYLE);
        this._text.setTextBounds(LAYOUT.SCORE_X, LAYOUT.SCORE_Y, LAYOUT.SCORE_WIDTH, LAYOUT.SCORE_HEIGHT);


        if (sendScore) {
            sendScore(this._score)
                .then(this.showHighScores)
                .catch(error => close());
        } else {
            this.showHighScores(this.createDefaultHighScores());
        }
    }

    showHighScores(scores) {
        this._createHighScoreDisplay(scores.allTimeScores, LAYOUT.HIGH_SCORE_LAYOUT[0]);
        this._createHighScoreDisplay(scores.currentWeekScores, LAYOUT.HIGH_SCORE_LAYOUT[1]);
    }

    _createHighScoreDisplay(scoreArray, layout) {
        const starIndex = this._findScoreForPlaySession(scoreArray);
        for (let i = 0; i < SCORE_ROWS && i < scoreArray.length; i++) {
            const scoreObj = scoreArray[i];
            const y = LAYOUT.SCORE_START_Y + i * LAYOUT.SCORE_ROW_HEIGHT;
            if (i === starIndex) {
                this.add.image(layout.STAR_X, y + LAYOUT.SCORE_START_DY, 'star');
            }
            this.add.text(layout.LIST_X, y, `${i + 1}.`, LAYOUT.LIST_STYLE);
            this.add.text(layout.NAME_X, y, this._trimName(scoreObj.firstName), LAYOUT.LIST_STYLE);
            const score = this.add.text(0, 0, scoreObj.score, LAYOUT.LIST_SCORE_STYLE);
            score.setTextBounds(layout.SCORE_X, y, layout.SCORE_WIDTH, y + LAYOUT.SCORE_ROW_HEIGHT);
        }
    }

    _trimName(name) {
        if (name.length > NAME_MAX) {
            name = `${name.substring(0, NAME_MAX)}…`;
        }
        return name;
    }

    _findScoreForPlaySession(scoreArray) {
        let index = -1;
        if (gameBridge.usingRealBridge) {
            const studentId = gameBridge.info.studentId;
            index = _.findIndex(scoreArray, scoreObj => scoreObj.studentId === studentId && scoreObj.score === this._score);
        }
        return index;
    }

    createDefaultHighScores() {
        const scoreObj = {
            allTimeScores: [{
                    studentId: 0,
                    firstName: 'Matt',
                    score: 20000
                },
                {
                    studentId: 1,
                    firstName: 'Tif',
                    score: 20000
                },
                {
                    studentId: 2,
                    firstName: 'Kim',
                    score: 20000
                },
                {
                    studentId: 3,
                    firstName: 'Ken',
                    score: 20000
                },
                {
                    studentId: 4,
                    firstName: 'lengthTest',
                    score: 20000
                },
            ],
            currentWeekScores: [{
                    studentId: 0,
                    firstName: 'Matt',
                    score: 20000
                },
                {
                    studentId: 1,
                    firstName: 'Tif',
                    score: 20000
                },
                {
                    studentId: 2,
                    firstName: 'Kim',
                    score: 20000
                },
                {
                    studentId: 3,
                    firstName: 'Ken',
                    score: 20000
                },
                {
                    studentId: 4,
                    firstName: 'lengthTest',
                    score: 20000
                },
            ],
        };
        scoreObj.allTimeScores = _.shuffle(scoreObj.allTimeScores);
        scoreObj.currentWeekScores = _.shuffle(scoreObj.currentWeekScores);

        return scoreObj;
    }
}



// WEBPACK FOOTER //
// ./src/states/ScoreBoard.js
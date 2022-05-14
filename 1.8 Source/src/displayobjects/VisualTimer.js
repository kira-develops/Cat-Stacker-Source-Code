/* ==========================================
 * VisualTimer.js
 * https://github.com/terebentina/VisualTimer
 * ==========================================
 * Copyright 2014 Dan Caragea.
 * Converted to ES6 by Matt Bargar
 *
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 * ========================================== */

export default class VisualTimer {
    constructor(opts) {
        this.type = opts.type || 'down';
        this.dir = opts.dir || 'horizontal';
        this.totalTime = opts.seconds;
        this.totalTimeMillis = this.totalTime * 1000;
        this.game = opts.game;
        this.onComplete = opts.onComplete;

        this.bgSprite = this.game.add.sprite(opts.x, opts.y, opts.atlas, opts.bg);
        this.sprite = this.game.add.sprite(opts.x, opts.y, opts.atlas, opts.fg);
        this.fullWidth = this.sprite.width;
        this.fullHeight = this.sprite.height;
        this.reset();
    }

    reset() {
        if (this.timer) {
            this.timer.stop();
        }
        const self = this;
        this.hasFinished = false;
        this.timer = this.game.time.create(true);
        this.timer.repeat(100, this.totalTimeMillis / 100, () => {
            const myTime = (this.type === 'down') ? this.remainingTimeMillis : this.timer.ms;
            if (this.dir === 'horizontal') {
                this.rect.width = Math.max(0, (myTime / this.totalTimeMillis) * this.fullWidth);
            } else {
                this.rect.height = Math.max(0, (myTime / this.totalTimeMillis) * this.fullHeight);
            }
            this.sprite.crop(this.rect);
        });
        this.timer.onComplete.removeAll();
        this.timer.onComplete.add(() => {
            self.hasFinished = true;
            if (self.onComplete) {
                self.onComplete();
            }
        });
        if (this.dir === 'horizontal') {
            this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
        } else {
            this.rect = new Phaser.Rectangle(0, 0, this.sprite.width, 0);
        }
        if (this.type === 'down') {
            this.sprite.crop(null);
        } else {
            this.sprite.crop(this.rect);
        }
    }

    setTime(seconds) {
        this.totalTime = seconds;
        this.totalTimeMillis = seconds;
        this.reset();
    }

    start() {
        this.reset();
        this.timer.start();
    }

    stop() {
        this.timer.stop();
    }

    pause() {
        this.timer.pause();
    }

    resume() {
        this.timer.resume();
    }

    get remainingTime() {
        return this.totalTime - this.timer.seconds;
    }
    get remainingTimeMillis() {
        return this.totalTimeMillis - this.timer.ms;
    }
    /**
     * setter to enabled fixedToCamera for UI
     * @param  {Boolean} val true to fix this to the camera
     */
    set fixedToCamera(val) {
        this.sprite.fixedToCamera = val;
        this.bgSprite.fixedToCamera = val;
    }
    get fixedToCamera() {
        return this.sprite.fixedToCamera;
    }
}



// WEBPACK FOOTER //
// ./src/displayobjects/VisualTimer.js
import {
    userDataManager,
    ExitButton,
    gameBridge
} from '../../node_modules/@cainc/game-common/src/js/index.js';
// import _ from 'lodash';
import VisualTimer from '../displayobjects/VisualTimer.js';
import * as consts from '../Constants.js';

const LAYOUT = {
    EXIT_X: 1150,
    EXIT_Y: 55,
};

export default class Play extends Phaser.State {
    create() {
        // TODO: do better with es6
        this.audioRefs = {
            AngryMeow01: this.game.sound.add('AngryMeow01'),
            Meow01: this.game.sound.add('Meow01'),
            Meow02: this.game.sound.add('Meow02'),
            PurrMeow01: this.game.sound.add('PurrMeow01'),
            PurrMeow02: this.game.sound.add('PurrMeow02'),
            ShortMeow01: this.game.sound.add('ShortMeow01'),
            ShortMeow02: this.game.sound.add('ShortMeow02'),
            TinyCatMeow01: this.game.sound.add('TinyCatMeow01'),
            TinyCatMeow02: this.game.sound.add('TinyCatMeow02'),
            sfxDing: this.game.sound.add('sfxDing'),
            sfxTimer: this.game.sound.add('sfxTimer'),
            sfxDrop: this.game.sound.add('sfxDrop'),
            sfxWhistle: this.game.sound.add('sfxWhistle'),
        };
        userDataManager.data.playHelpViewed = true;
        userDataManager.save();

        // Add your game content here
        //  Make our game world big (the default is to match the game size)
        this.game.world.setBounds(0, 0, consts.WORLD_SIZE.width, consts.WORLD_SIZE.height);
        // scroll all the way down
        this.game.camera.y = consts.WORLD_SIZE.height - consts.STAGE_SIZE.height;
        // add bg
        const bgGroup = this.game.add.group();
        bgGroup.add(this.game.add.image(0, 0, 'assets', 'bg_01.png'));
        bgGroup.add(this.game.add.image(0, 2048, 'assets', 'bg_02.png'));
        bgGroup.add(this.game.add.image(0, 4096, 'assets', 'bg_03.png'));


        // this.bg = this.game.add.tileSprite(0, 0,
        // consts.STAGE_SIZE.width, consts.STAGE_SIZE.height, 'bg_tilesprite');
        //
        // this.bg.fixedToCamera = true;
        // this.bg.tilePosition.y = consts.WORLD_SIZE.height;
        // Start the P2 Physics Engine
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        //  Turn on impact events for the world, without this we get no collision callbacks
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.friction = 1;

        this.game.physics.p2.setBounds(
            0, 0, this.game.width, this.game.height,
            true, true, false, false,
        );

        // Set the gravity
        this.game.physics.p2.gravity.y = consts.GRAVITY.y;

        // Set the restitution
        this.game.physics.p2.restitution = consts.RESTITUTION;

        // const contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);

        // Friction to use in the contact of these two materials.
        // contactMaterial.friction = 0.3;
        // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        // contactMaterial.restitution = 1.0;
        // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        this.game.physics.p2.stiffness = 1e7;
        // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
        this.game.physics.p2.relaxation = 0;
        // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
        this.game.physics.p2.frictionStiffness = 1e7;
        // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
        this.game.physics.p2.frictionRelaxation = 0;
        // Will add surface velocity to this material.
        // If bodyA rests on top if bodyB, and the surface velocity is positive,
        // bodyA will slide to the right.
        this.game.physics.p2.surfaceVelocity = 0;

        // this.myCollisionGroup = this.game.physics.p2.createCollisionGroup();
        //  This part is vital if you want the objects with their own collision groups
        //  to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        // this.game.physics.p2.updateBoundsCollisionGroup();

        // add platform
        const platform = this.game.add.sprite(0, 0, 'assets', 'scratchingPost.png');
        platform.anchor.setTo(0.5, -0.5);
        // platform.scale = { x: scale, y: scale };
        platform.x = consts.WORLD_SIZE.width / 2;
        platform.y = consts.WORLD_SIZE.height - (platform.height / 2);
        // Enable physics, use "true" to enable debug drawing
        this.game.physics.p2.enable([platform], consts.DEBUGGING);
        platform.id = 'scratchingPost';
        // Get rid of current bounding box
        platform.body.clearShapes();

        // Add our PhysicsEditor bounding shape
        platform.body.loadPolygon('p2Assets', platform.id);
        platform.body.static = true;

        this.catsGroup = this.game.add.group();

        // add max height line
        this.heightMarkerGroup = this.game.add.group();
        this.heightMarkerGroup.add(this.game.add.sprite(0, -20, 'assets', 'heightMarker.png'));
        const txt = this.game.add.text(1180, -18, '0 ft', {
            fill: 'white',
            align: 'center',
            boundsAlignH: 'center',
            font: '24pt balooregular',
        }); // TODO fix these magic numbers
        txt.setTextBounds(0, 0, 60, 20);
        this.heightTxt = txt;
        this.heightMarkerGroup.add(txt);
        this.heightMarkerGroup.y = consts.WORLD_SIZE.height;
        this.heightMarkerGroup.visible = false;

        this.indicator = new VisualTimer({
            game: this.game,
            x: 60,
            y: 530,
            dir: 'vertical',
            type: 'up',
            seconds: consts.SESSION_DURATION_SECONDS,
            onComplete: () => this.handleSessionComplete(),
            atlas: 'assets',
            bg: 'timer0001.png',
            fg: 'timer0002.png',
        });
        this.indicator.fixedToCamera = true;
        this.indicator.start();
        const timerIcon = this.game.add.image(52, 500, 'assets', 'timerIcon.png');
        timerIcon.fixedToCamera = true;
        if (gameBridge.shouldShowExitButton) {
            this.exitButton = new ExitButton(this, LAYOUT.EXIT_X, LAYOUT.EXIT_Y, {
                atlas: 'assets',
                out: 'btnX0001.png',
                over: 'btnX0001.png',
                down: 'btnX0002.png',
            });
            this.exitButton.button.fixedToCamera = true;
        }

        // add timers for the tick and the ding - do it cheaply
        this.game.time.events.add((consts.SESSION_DURATION_SECONDS * 1000) - 5000, () => {
            this.audioRefs.sfxTimer.play();
        });
        this.game.time.events.add((consts.SESSION_DURATION_SECONDS * 1000) - 1000, () => {
            this.audioRefs.sfxDing.play();
        });

        // test:
        // this.cursors = this.game.input.keyboard.createCursorKeys();

        this.cameraPos = consts.WORLD_SIZE.height - consts.STAGE_SIZE.height;

        const music = this.game.add.audio('musicGame');
        music.loop = true;
        music.volume = 0.3;
        music.play();

        this.startGameplay();
    }
    shutdown() {
        this.game.sound.stopAll();
    }

    startGameplay() {
        this.activeSession = true;
        this.sessionScore = 0;
        this.updateStackHeight();
        this.game.input.onTap.add(( /* pointer */ ) => {
            if (this.activeSession && this.activeCat && this.activeCat.is('attached')) {
                this.addPhysicsToCat(this.activeCat);
            }
        });
    }
    stopGameplay() {
        this.activeSession = false;
        this.playLevelEndSequence(() => {
            this.state.start('CatScoreBoard', true, false, this.sessionScore);
        });
    }

    playLevelEndSequence(myCallback) {
        const cameraOffset = {
            x: 625,
            y: -250
        };
        const fps = 18.0;
        this.audioRefs.sfxWhistle.play();
        // TODO here: cancel tween
        if (this.activeCat) {
            this.addPhysicsToCat(this.activeCat);
            this.activeCat.body.static = true;
        }

        const g = this.game;
        const group = g.add.group();

        const graphics = g.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(-cameraOffset.x, -cameraOffset.y,
            consts.STAGE_SIZE.width, consts.STAGE_SIZE.height,
        );
        graphics.alpha = 0;

        group.add(graphics);
        const bgTween = g.add.tween(graphics).to({
            alpha: 0.5
        }, 500);

        const upImg = g.add.image(13, -531.35, 'assets', 'levelEnd-Up.png');
        upImg.anchor.setTo(0.4448039342565031, 0.35450608372860387);
        const upTween1 = g.add.tween(upImg).to({
            y: 667
        }, (5 / fps) * 1000);
        const upTween2 = g.add.tween(upImg).to({
            y: 697
        }, (1 / fps) * 1000);
        const upTween3 = g.add.tween(upImg).to({
            y: 683
        }, (2 / fps) * 1000);
        const upTween4 = g.add.tween(upImg).to({
            y: 662
        }, (4 / fps) * 1000);
        const upTween5 = g.add.tween(upImg).to({
            y: 667
        }, (4 / fps) * 1000);
        upTween1.chain(upTween2, upTween3, upTween4, upTween5);
        //
        const upTweenScale1 = g.add.tween(upImg.scale).to({
            x: 1,
            y: 1
        }, (5 / fps) * 1000);
        const upTweenScale2 = g.add.tween(upImg.scale).to({
            x: 1.136,
            y: 0.809
        }, (1 / fps) * 1000);
        const upTweenScale3 = g.add.tween(upImg.scale).to({
            x: 1.05,
            y: 0.898
        }, (2 / fps) * 1000);
        const upTweenScale4 = g.add.tween(upImg.scale).to({
            x: 0.986,
            y: 1.032
        }, (4 / fps) * 1000);
        const upTweenScale5 = g.add.tween(upImg.scale).to({
            x: 1,
            y: 1
        }, (4 / fps) * 1000);
        const waitTween = g.add.tween(upImg).to(null, 1000);
        upTweenScale1.chain(upTweenScale2, upTweenScale3, upTweenScale4, upTweenScale5, waitTween);
        //
        group.add(upImg);
        //
        //
        const timeImg = g.add.image(21, -684, 'assets', 'leveEnd-Time.png');
        timeImg.anchor.setTo(0.5043794414146422, 1.3);
        const timeTween1 = g.add.tween(timeImg).to({
            y: -684
        }, (2 / fps) * 1000); // nothing
        const timeTween2 = g.add.tween(timeImg).to({
            y: 667
        }, (5 / fps) * 1000);
        const timeTween3 = g.add.tween(timeImg).to({
            y: 698
        }, (1 / fps) * 1000);
        const timeTween4 = g.add.tween(timeImg).to({
            y: 655
        }, (4 / fps) * 1000);
        const timeTween5 = g.add.tween(timeImg).to({
            y: 667
        }, (5 / fps) * 1000);
        timeTween1.chain(timeTween2, timeTween3, timeTween4, timeTween5);
        //
        const s = timeImg.scale;
        const timeTweenScale1 = g.add.tween(s).to({
            x: 1,
            y: 1
        }, (7 / fps) * 1000);
        const timeTweenScale2 = g.add.tween(s).to({
            x: 1.098,
            y: 0.818
        }, (1 / fps) * 1000);
        const timeTweenScale3 = g.add.tween(s).to({
            x: 1,
            y: 1
        }, (4 / fps) * 1000);
        timeTweenScale1.chain(timeTweenScale2, timeTweenScale3);

        group.add(timeImg);

        group.fixedToCamera = true;
        group.cameraOffset.x = 625;
        group.cameraOffset.y = -250;

        bgTween.onComplete.add(() => {
            upTween1.start();
            upTweenScale1.start();
            timeTween1.start();
            timeTweenScale1.start();
        });
        bgTween.start();

        if (myCallback) {
            waitTween.onComplete.add(myCallback, this);
        }
    }

    addCatToScreen() {
        const cat = this.createCat(); // returns a Sprite
        const halfWidth = Math.abs(cat.width) / 2;
        const minX = halfWidth;
        const maxX = consts.STAGE_SIZE.width - halfWidth;
        const startX = this.game.rnd.between(minX, maxX);
        const pct = 1 - (startX / maxX); // 0..1, not quite right i think
        const fullTweenTime = consts.CLAW_TIMES[cat.size];
        this.activeCat = cat;
        this.activeCat.x = startX;
        this.activeCat.y = this.cameraPos + (cat.height / 2);
        cat.scale.x = 0.01 * cat.flip;
        cat.scale.y = 0.01;
        const showTween = this.game.add.tween(cat.scale).to({
                x: consts.CAT_SCALE * cat.flip,
                y: consts.CAT_SCALE
            },
            500,
            Phaser.Easing.Back.Out,
            true,
        );
        showTween.onComplete.add(() => {
            this.activeCat.attach(); // FSM method
        });
        const startMoveTween = this.game.add.tween(cat).to({
                x: maxX
            },
            pct * fullTweenTime,
            Phaser.Easing.Quadratic.InOut,
            false, // autostart
            0, // delay
        );
        const yoyoTween = this.game.add.tween(cat).to({
                x: minX
            },
            fullTweenTime,
            Phaser.Easing.Quadratic.InOut,
            false, // autostart
            0, // delay
            -1, // repeat
            true, // yoyo
        );
        showTween.chain(startMoveTween);
        startMoveTween.chain(yoyoTween);
    }

    /**
     * [createCat description]
     * @param  {Boolean} [usePhysics=false] [description]
     * @return {Sprite}                     [description]
     */
    createCat(usePhysics = false) {
        const choices = consts.CAT_LINKAGES; // ['cat-lg1']; //
        const id = this.game.rnd.pick(choices);
        const flip = this.game.rnd.pick([-1, 1]);
        const cat = this.game.add.sprite(0, 0, 'assets', `${id}.png`);
        cat.flip = flip;
        let size = 'lg';
        if (id.indexOf('med') > -1) size = 'med';
        else if (id.indexOf('sm') > -1) size = 'sm';
        cat.size = size;
        cat.id = id; // just saving for later
        cat.anchor.setTo(0.5, 0.5);
        if (usePhysics) {
            this.addPhysicsToCat(cat);
        }

        this.catsGroup.add(cat);

        StateMachine.apply(cat, {
            init: 'justBorn',
            transitions: [{
                    name: 'attach',
                    from: 'justBorn',
                    to: 'attached'
                },
                {
                    name: 'drop',
                    from: 'attached',
                    to: 'dropping'
                },
                {
                    name: 'stick',
                    from: 'dropping',
                    to: 'sticking'
                },
                {
                    name: 'dropDown',
                    from: ['dropping', 'sticking'],
                    to: 'offScreen'
                },
            ],
            methods: {
                onStick: () => {
                    if (consts.DEBUGGING) {
                        cat.tint = 0xff00ff;
                    }
                    cat.body.static = true;

                    if (cat === this.activeCat) {
                        this.activeCat = null;
                    }
                    this.updateStackHeight();
                },
                onDropDown: () => {
                    if (cat === this.activeCat) {
                        this.activeCat = null;
                    }
                    const audioKey = this.game.rnd.pick(consts.CAT_SFX.dropDown);
                    const audioRef = this.audioRefs[audioKey];
                    audioRef.play();
                    cat.destroy();
                    this.updateStackHeight();
                },
            },
        });

        return cat;
    }

    addPhysicsToCat(cat) {
        // Enable physics, use "true" to enable debug drawing
        cat.scale.x = Math.abs(consts.CAT_SCALE); // eslint-disable-line no-param-reassign
        this.game.physics.p2.enable(cat, consts.DEBUGGING, false);

        // Get rid of current bounding box
        cat.body.clearShapes();

        // Add our PhysicsEditor bounding shape
        cat.body.loadPolygon('p2Assets', cat.id, consts.CAT_SCALE);
        cat.scale.x = consts.CAT_SCALE * cat.flip; // eslint-disable-line no-param-reassign

        const {
            body
        } = cat;

        // body.collideWorldBounds = false;
        body.static = false;
        // https://phaser.io/examples/v2/p2-physics/contact-events
        body.onBeginContact.add(this.handleBeginContact, this);
    }
    handleBeginContact(body) {
        // active cat hit something
        const catBody = this.activeCat.body;
        const catSprite = catBody.sprite;
        catBody.static = true;
        catBody.setZeroVelocity();
        catBody.angularVelocity = 0;
        catBody.rotation = 0;
        catBody.onBeginContact.removeAll();

        const otherSprite = body.sprite;
        // new idea: FAKE IT
        const catShapeHeightData = Play.getShapeHeight(this.game.cache.getPhysicsData('p2Assets', catSprite.id));
        const otherShapeHeightData = Play.getShapeHeight(this.game.cache.getPhysicsData('p2Assets', otherSprite.id));
        const otherSpriteBounds = otherSprite.getBounds();
        const catSpriteBounds = catSprite.getBounds();

        // what we want to do is,
        // set the bottom of the cat's SHAPE to the top of the other's SHAPE.
        // We know the height of the shapes
        const topOfOtherShape = body.y - otherSpriteBounds.halfHeight + otherShapeHeightData.yMin; // eslint-disable-line
        const bottomOfCatShape = catSpriteBounds.halfHeight + (catShapeHeightData.yMax - catSpriteBounds.height); // eslint-disable-line
        const showTween = this.game.add.tween(catBody).to({
                y: topOfOtherShape - bottomOfCatShape
            },
            40,
            Phaser.Easing.Linear.None,
            true,
        );
        showTween.onComplete.add(() => {
            const audioKey = this.game.rnd.pick(consts.CAT_SFX.stick[catSprite.size]);
            const audioRef = this.audioRefs[audioKey];
            audioRef.play();
            this.activeCat.stick(); // FSM method
        });
    }

    // this is super cheap
    static getShapeHeight(shape) {
        const shapeData = shape[0].shape;
        let yMin = 1000;
        let yMax = 0;
        shapeData.forEach((val, idx) => {
            if (idx % 2 === 1) {
                yMin = Math.min(yMin, val);
                yMax = Math.max(yMax, val);
            }
        });
        return {
            yMin,
            yMax,
            height: yMax - yMin
        };
    }

    updateStackHeight() {
        // loop over all cats; get the smallest y value for an edge; 937 - that; bam!
        // calculate the *current* stack height and the *max* stack height
        let top = consts.WORLD_SIZE.height; // this.heightMarkerGroup.y;
        // todo: revise with some nice es6 construct
        this.catsGroup.children.forEach((cat) => {
            if (cat.is('sticking')) top = Math.min(top, cat.top);
        });
        const currentStackHeight = top;
        top = Math.min(top, this.heightMarkerGroup.y);
        // do it un-animated first
        this.heightMarkerGroup.y = top;
        this.heightMarkerGroup.visible = top !== consts.WORLD_SIZE.height;
        this.sessionScore = Math.floor((consts.WORLD_SIZE.height - top) / 120);
        this.heightTxt.setText(`${this.sessionScore} ft`);

        // update camera pos
        const halfStageHeight = consts.STAGE_SIZE.height / 2; // TODO move elsewhere make a real const
        const cameraPos = this.cameraPos; // eslint-disable-line prefer-destructuring
        let newCameraPos;
        if (this.activeSession) {
            const animated = true;
            if (currentStackHeight - cameraPos < halfStageHeight) {
                // move camera up
                newCameraPos = Math.max(0, currentStackHeight - halfStageHeight);
                if (animated) {
                    if (this.cameraTween) {
                        this.game.tweens.remove(this.cameraTween);
                    }
                    this.cameraTween = this.add.tween(this).to({
                            cameraPos: newCameraPos
                        },
                        1000,
                        Phaser.Easing.Quadratic.InOut,
                        true,
                    );
                } else {
                    this.cameraPos = newCameraPos;
                }
            } else if (currentStackHeight > cameraPos + consts.STAGE_SIZE.height) {
                // move camera down
                newCameraPos = Math.min(
                    consts.WORLD_SIZE.height - consts.STAGE_SIZE.height,
                    currentStackHeight - halfStageHeight,
                );
                if (animated) {
                    if (this.cameraTween) {
                        this.game.tweens.remove(this.cameraTween);
                    }
                    this.cameraTween = this.add.tween(this).to({
                            cameraPos: newCameraPos
                        },
                        1000,
                        Phaser.Easing.Quadratic.InOut,
                        true,
                    );
                } else {
                    this.cameraPos = newCameraPos;
                }
            }
        }

        if (!this.activeCat) {
            this.addCatToScreen();
        }
    }

    set cameraPos(val) {
        this.game.camera.y = val;
        // this.bg.tilePosition.y = consts.WORLD_SIZE.height - val;
        if (this.activeCat && (this.activeCat.is('attached') || this.activeCat.is('justBorn'))) {
            this.activeCat.y = val + (this.activeCat.height / 2);
        }
    }
    get cameraPos() {
        return this.game.camera.y;
    }

    update() {
        // test
        // if (this.cursors.up.isDown) {
        //   this.cameraPos = this.cameraPos - 10;
        // } else if (this.cursors.down.isDown) {
        //   this.cameraPos = this.cameraPos + 10;
        // }

        this.catsGroup.children.forEach((cat) => {
            if (cat.y > consts.WORLD_SIZE.height) {
                cat.dropDown();
            }
            const tempCat = cat;
            if (tempCat.body) {
                if (tempCat.is('attached') &&
                    Math.abs(tempCat.body.velocity.x) <= 1 &&
                    Math.abs(tempCat.body.velocity.y) <= 1) {
                    // there is 1 frame when this happens -- transition
                    tempCat.drop();
                    this.audioRefs.sfxDrop.play();
                }
            }
        });
        if (consts.DEBUGGING) {
            if (this.activeCat) {
                this.game.debug.text(`${this.activeCat.id} ${this.activeCat.state} `, 0, 100);
            } else {
                this.game.debug.text('no active cat', 0, 100);
            }
            // this.game.debug.text(`${this.currentStackHeight}`, 0, 150);
        }
    }

    handleSessionComplete() {
        this.stopGameplay();
    }
}



// WEBPACK FOOTER //
// ./src/states/Play.js
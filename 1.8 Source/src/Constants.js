// how big the viewport is
export const STAGE_SIZE = {
    width: 1250,
    height: 937
};
// how big the scrolling area is in gameplay
export const WORLD_SIZE = {
    width: 1250,
    height: 4879
};

export const SESSION_DURATION_SECONDS = 60;

export const GRAVITY = {
    x: 0,
    y: 5000
};

// 'bounciness'
export const RESTITUTION = 0;

// bigger scale = BIGGER CATS
export const CAT_SCALE = 1;

export const CAT_LINKAGES = [
    'cat-lg1', 'cat-lg2', 'cat-lg3',
    'cat-med1', 'cat-med2', 'cat-med3',
    'cat-sm1', 'cat-sm2', 'cat-sm3',
];

// number of millis for the claw to go from one side of the screen to the other, by size of cat
export const CLAW_TIMES = {
    lg: 1700,
    med: 1400,
    sm: 1200
};

export const CAT_SFX = {
    stick: {
        lg: ['Meow01', 'Meow02', 'PurrMeow01', 'PurrMeow02', 'ShortMeow01', 'ShortMeow02', 'TinyCatMeow01', 'TinyCatMeow02'],
        med: ['Meow01', 'Meow02', 'PurrMeow01', 'PurrMeow02', 'ShortMeow01', 'ShortMeow02', 'TinyCatMeow01', 'TinyCatMeow02'],
        sm: ['Meow01', 'Meow02', 'PurrMeow01', 'PurrMeow02', 'ShortMeow01', 'ShortMeow02', 'TinyCatMeow01', 'TinyCatMeow02'],
    },
    dropDown: ['AngryMeow01'],
};

export const DEBUGGING = false;



// WEBPACK FOOTER //
// ./src/Constants.js
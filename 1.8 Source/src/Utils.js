export class Utils { // eslint-disable-line import/prefer-default-export
    static addPaws(game) {
        /*
        to do this smart:
        - make list of column Ys
        - make list of 'even Xes' and 'odd Xes'
        - do math
         */
        const deltaY = 96.45;
        const startY = -59.15;
        const yCount = 12;
        const deltaX = 99.25;
        const startEvenX = -22.55;
        const startOddX = -72.3;
        const xCount = 14;
        const locs = [];
        // step 1, make a flat array of all of the starts
        for (let y = 0; y < yCount; y += 1) {
            for (let x = 0; x < xCount; x += 1) {
                const isEven = (y % 2 === 0);
                const xPx = isEven ? startEvenX + (x * deltaX) : startOddX + (x * deltaX);
                const yPx = startY + (y * deltaY);
                locs.push({
                    from: [xPx, yPx],
                    x,
                    y,
                    isEven,
                });
            }
        }

        locs.forEach((location) => {
            const paw = game.add.sprite(location.from[0], location.from[1], 'assets', 'paw.png');
            paw.alpha = 0.25;

            // now need to do something smart for the `to`
            // basically, grab the one that appears to be down and to the right
            // This is different for even and odd rows
            const to = location.isEven ? _.find(locs, {
                    x: location.x + 1,
                    y: location.y + 1
                }) :
                _.find(locs, {
                    x: location.x + 0,
                    y: location.y + 1
                });
            location.to = to ? to.from : null; // eslint-disable-line no-param-reassign
            if (location.to) {
                game.add.tween(paw).to({
                        x: location.to[0],
                        y: location.to[1],
                    },
                    1000,
                    Phaser.Easing.Linear.None,
                    true, // autostart
                    0, // delay
                    -1, // repeat
                );
            }
        });
    }
}



// WEBPACK FOOTER //
// ./src/Utils.js
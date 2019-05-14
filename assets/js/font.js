var LEADERBOARD_FONT = {
    fontFamily: 'Luckiest Guy',
    fontSize: 80,
    color: '#fffdd9',
    stroke: '#4d377d',
    strokeThickness: 10,
    shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#3e5288',
        blur: 2,
        stroke: false,
        fill: true
    },
};

var TITLE_FONT = {
    fontFamily: 'Luckiest Guy',
    fontSize: 100,
    color: '#fffdd9',
    stroke: '#4d377d',
    strokeThickness: 10,
    shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#3e5288',
        blur: 2,
        stroke: false,
        fill: true
    },
};

var TUTORIAL_FONT = {
    fontFamily: 'Acme',
    color: '#fffdd9',
    stroke: '#4d377d',
    strokeThickness: 10,
    shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#3e5288',
        blur: 2,
        stroke: false,
        fill: true
    }
};


async function loadFont () {
    await   WebFont.load({
            google: {
            families: ['Luckiest Guy', 'Kalam', 'Acme']
        }
    });
}


var Phaser = require('Phaser');
var _ = require('lodash');

var states = {
    boot: require('./states/boot.js'),
    menu: require('./states/menu.js'),
    game: require('./states/game.js')
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

_.each(states, function (state, key) {
    game.state.add(key, state(game));
});

game.state.start('boot');

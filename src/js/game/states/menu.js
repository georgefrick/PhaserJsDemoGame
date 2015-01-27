/**
 * George Frick (@brewcitycoder)
 * Show the title screen.
 */
(function () {
    'use strict';

    module.exports = function (game) {

        var menu = function() {};

        menu.prototype = {
            create: function() {
                var stateText = game.add.text(game.world.centerX, game.world.centerY, 'Demo Shooter ', {
                    font: '28px Arial',
                    fill: '#fff'
                });
                stateText.anchor.setTo(0.5, 0.5);
                stateText.visible = true;

                var playText = game.add.text(game.world.centerX, game.world.centerY + 50, 'Click To Play', {
                    font: '18px Arial',
                    fill: '#fff'
                });
                playText.anchor.setTo(0.5, 0.5);
                playText.visible = true;

                game.input.onTap.addOnce(this.startGame, this);
            },
            startGame: function() {
                game.state.start('game');
            }
        };

        return menu;
    };

}());

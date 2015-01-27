/**
 * George Frick (@brewcitycoder)
 * Load all resources here, and setup the basic game parameters. Then start the menu state.
 */
(function () {
    'use strict';

    module.exports = function (game) {

        var boot = function () {
        };

        boot.prototype = {
            preload: function () {               
                game.load.image('playerShip', 'images/player.png');
                game.load.image('enemyShip', 'images/enemyShip.png');
                game.load.image('laserRed', 'images/laserRed.png');
                game.load.image('laserGreen', 'images/laserGreen.png');
                game.load.image('life', 'images/life.png');
                game.load.image('meteorSmall', 'images/meteorSmall.png');
                game.load.image('starBackground', 'images/starBackground.png');
                game.load.spritesheet('explosion', 'images/explosion.png', 84, 84);

                // http://opengameart.org/content/spaceship-shoting
                game.load.audio('shotSound', 'audio/normalShot.ogg');
                // http://opengameart.org/content/bombexplosion8bit
                game.load.audio('explodeSound', 'audio/8bit_bomb_explosion.wav');
                game.load.audio('laserSound', 'audio/laser1.ogg');
                game.load.audio('blastSound', 'audio/blast.wav');

            },
            create: function () {
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.scale.refresh();
                this.game.state.start('menu');
            }
        };

        return boot;
    };

}());

/**
 * The following objects will be added and available when this state is created.
 this.game;      // a reference to the currently running game
 this.add;       // used to add sprites, text, groups, etc
 this.camera;    // a reference to the game camera
 this.cache;     // the game cache
 this.input;     // the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
 this.load;      // for preloading assets
 this.math;      // lots of useful common math operations
 this.sound;     // the sound manager - add a sound, play one, set-up markers, etc
 this.stage;     // the game stage
 this.time;      // the clock
 this.tweens;    // the tween manager
 this.world;     // the game world
 this.particles; // the particle manager
 this.physics;   // the physics manager
 this.rnd;       // the repeatable random number generator
 */
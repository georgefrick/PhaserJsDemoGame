/**
 * George Frick (@brewcitycoder)
 * The 'Play' State. This is a demo game, so all code is here. For a real game it is advised you
 * move the majority of your code into modules.
 */
(function () {
    'use strict';

    module.exports = function (game) {

        var gameState = function () {
        };

        gameState.prototype = {
            /**
             * The Phaser JS create function, called when the state is loaded.
             */
            create: function () {
                // Game Variables
                this.bulletTime = 0;
                this.score = 0;
                this.livingEnemies = [];
                this.firingTimer = 0;
                this.level = 1;
                this.playerSpeed = 300;
                this.playerShootSpeed = 500;
                this.enemyShootSpeed = 1500;

                // Startup the physics Engine
                game.physics.startSystem(Phaser.Physics.ARCADE);

                // Add the scrolling background
                this.scrollingStars = game.add.tileSprite(0, 0, 800, 600, 'starBackground');

                // Setup the sound effects
                this.shotSound = game.add.audio('shotSound');
                this.explodeSound = game.add.audio('explodeSound');
                this.laserSound = game.add.audio('laserSound');
                this.blastSound = game.add.audio('blastSound');

                // Setup the main sprites by building sprite 'pools'
                this.lasers = this.addLasers('laserGreen');
                this.enemyLasers = this.addLasers('laserRed');
                this.player = this.addPlayer();
                this.enemies = this.addEnemies();
                this.explosions = this.addExplosions();

                // Show the score, life count and state of the game.
                this.scoreText = game.add.text(10, 10, this.score, {font: '28px Arial', fill: '#fff'});
                this.stateText = this.addStateText();
                this.lives = this.addLifeCount();

                // Handle game input.
                this.cursors = game.input.keyboard.createCursorKeys();
                this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                this.pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
                this.pauseButton.onDown.add(this.pause, this);
                this.muteButton = game.input.keyboard.addKey(Phaser.Keyboard.M);
                this.muteButton.onDown.add(this.mute, this);
            },
            /**
             * The phaser JS update function. Called each tick.
             */
            update: function () {
                this.scrollingStars.tilePosition.y += 2;

                if (this.player.alive) {
                    this.player.body.velocity.setTo(0, 0);

                    if (this.cursors.left.isDown) {
                        this.player.body.velocity.x = -this.playerSpeed;
                    }
                    else if (this.cursors.right.isDown) {
                        this.player.body.velocity.x = this.playerSpeed;
                    }

                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    if (game.time.now > this.firingTimer) {
                        this.enemyFires();
                    }

                    game.physics.arcade.overlap(this.lasers, this.enemies, this.collisionHandler, null, this);
                    game.physics.arcade.overlap(this.enemyLasers, this.player, this.enemyHitsPlayer, null, this);
                }
            },
            pause: function() {
                game.paused = !game.paused;
                if( game.paused ) {
                    this.stateText.text = "(P)aused";
                    this.stateText.visible = true;
                } else {
                    this.stateText.text = " ";
                    this.stateText.visible = false;
                }
            },
            mute: function() {
                game.sound.mute = !game.sound.mute;
            },
            addLasers: function(imageName) {
                var lasers = game.add.group();
                lasers.enableBody = true;
                lasers.physicsBodyType = Phaser.Physics.ARCADE;
                lasers.createMultiple(5, imageName);
                // One way to change everything in a group is to use 'setAll'
                lasers.setAll('anchor.x', 0.5);
                lasers.setAll('anchor.y', 1);
                lasers.setAll('outOfBoundsKill', true);
                lasers.setAll('checkWorldBounds', true);
                return lasers;
            },
            addPlayer: function() {
                var player = game.add.sprite(400, 550, 'playerShip');
                player.anchor.setTo(0.5, 0.5);
                game.physics.enable(player, Phaser.Physics.ARCADE);
                player.body.collideWorldBounds = true;
                return player;
            },
            addStateText: function() {
                var stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
                    font: '28px Arial',
                    fill: '#fff'
                });
                stateText.anchor.setTo(0.5, 0.5);
                stateText.visible = false;
                return stateText;
            },
            addLifeCount: function() {
                var lives = game.add.group();

                for (var i = 0; i < 3; i++) {
                    var ship = lives.create(game.world.width - 90 + (30 * i), 25, 'life');
                    ship.anchor.setTo(0.5, 0.5);
                    ship.angle = 90;
                }
                return lives;
            },
            addExplosions: function() {
                var explosions = game.add.group();
                explosions.createMultiple(5, 'explosion');
                // A second way to set something for everything in a group is to loop through it.
                explosions.forEach(function (explosion) {
                    explosion.anchor.x = 0.5;
                    explosion.anchor.y = 0.5;
                    explosion.animations.add('explosion');
                }, this);
                return explosions;
            },
            addEnemies: function () {
                var enemies = game.add.group();
                enemies.enableBody = true;
                enemies.physicsBodyType = Phaser.Physics.ARCADE;
                this.resetEnemies(enemies);
                var tween = game.add.tween(enemies).to({x: 200}, 2000 , Phaser.Easing.Linear.None, true, 0, 1000, true);
                tween.onLoop.add(this.descend, this);
                return enemies;
            },
            resetEnemies: function (enemies) {
                enemies.removeAll();

                for (var y = 0; y < 3; y++) {
                    for (var x = 0; x < 6; x++) {
                        var enemy = enemies.create(x * 110, y * 75, 'enemyShip');
                        enemy.anchor.setTo(0.5, 0.5);
                        enemy.body.moves = false;
                    }
                }
                enemies.x = 55;
                enemies.y = 50;
            },
            descend: function () {
                this.enemies.y += game.rnd.integerInRange(5, 10 + this.level);
            },
            fireBullet: function () {
                if (game.time.now > this.bulletTime) {
                    var bullet = this.lasers.getFirstExists(false);

                    if (bullet) {
                        //  And fire it
                        bullet.reset(this.player.x, this.player.y - 12);
                        bullet.body.velocity.y = -450;
                        this.bulletTime = game.time.now + this.playerShootSpeed;
                        this.shotSound.play();
                    }
                }
            },
            enemyFires: function () {
                var enemyBullet = this.enemyLasers.getFirstExists(false);
                this.livingEnemies.length = 0;

                this.enemies.forEachAlive(function (enemy) {
                    this.livingEnemies.push(enemy);
                }, this);

                if (enemyBullet && this.livingEnemies.length > 0) {
                    var random = game.rnd.integerInRange(0, this.livingEnemies.length - 1);

                    // randomly select one of them
                    var shooter = this.livingEnemies[random];
                    // And fire the bullet from this enemy
                    enemyBullet.reset(shooter.body.x, shooter.body.y);
                    enemyBullet.body.velocity.y = 300 + (this.level * 10);

                    this.laserSound.play();
                    this.firingTimer = game.time.now + (this.enemyShootSpeed - (this.level*100));
                }
            },
            collisionHandler: function (bullet, enemy) {
                bullet.kill();
                enemy.kill();

                this.score += 20;
                this.scoreText.text = '' + this.score;

                var explosion = this.explosions.getFirstExists(false);
                explosion.reset(enemy.body.x, enemy.body.y);
                explosion.play('explosion', 30, false, true);
                this.explodeSound.play();

                if (this.enemies.countLiving() == 0) {
                    this.score += 1000;
                    this.scoreText.text = '' + this.score;

                    this.enemyLasers.callAll('kill',this);
                    this.stateText.text = "Space To Continue";
                    this.stateText.visible = true;

                    this.level++;
                    game.input.onTap.addOnce(this.restart, this);
                    this.fireButton.onDown.addOnce(this.restart,this);
                }
            },
            enemyHitsPlayer: function (player, bullet) {
                bullet.kill();
                var live = this.lives.getFirstAlive();

                if (live) {
                    live.kill();
                }

                var explosion = this.explosions.getFirstExists(false);
                explosion.reset(player.body.x, player.body.y);
                explosion.play('explosion', 30, false, true);
                this.blastSound.play();

                if (this.lives.countLiving() < 1) {
                    player.kill();
                    this.enemyLasers.callAll('kill');
                    game.state.start('menu');
                }
            },
            restart: function () {
              //  this.lives.callAll('revive');
                this.resetEnemies(this.enemies);
                this.player.revive();
                this.stateText.visible = false;
            }
        };
        return gameState;
    };
}());
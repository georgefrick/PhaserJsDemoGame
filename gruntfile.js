var properties = require('./package.json');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            project: {
                src: 'src/js',
                js: '<%= project.src %>/game/{,*/}*.js',
                dest: 'build/js',
                bundle: 'build/js/game.min.js',
                port: properties.port,
                banner: '/*\n' +
                ' * <%= properties.title %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' */\n'
            },
            browserify: {
                app: {
                    src: ['<%= project.src %>/game/application.js'],
                    dest: '<%= project.bundle %>',
                    options: {
                        transform: ['browserify-shim'],
                        watch: true,
                        bundleOptions: {
                            debug: true
                        }
                    }
                }
            },
            clean: ['./build'],
            connect: {
                dev: {
                    options: {
                        port: '<%= project.port %>',
                        base: './build'
                    }
                }
            },
            copy: {
                audio: {
                    files: [{expand: true, cwd: 'src/audio/', src: ['**'], dest: 'build/audio/'}]
                },
                html: {
                    files: [{expand: true, cwd: 'src/html/', src: ['**'], dest: 'build/'}]
                },
                images: {
                    files: [{expand: true, cwd: 'src/images/', src: ['**'], dest: 'build/images/'}]
                }
            },
            open: {
                server: {
                    path: 'http://localhost:<%= project.port %>'
                }
            },
            watch: {
                options: {
                    livereload: properties.liveReloadPort
                },
                js: {
                    files: '<%= project.dest %>/**/*.js'
                },
                images: {
                    files: 'src/images/**/*',
                    tasks: ['copy:images']
                },
                audio: {
                    files: 'src/audio/**/*',
                    tasks: ['copy:audio']
                }
            }
        }
    );

    grunt.registerTask('default', ['clean', 'browserify', 'copy', 'connect', 'open', 'watch']);
};

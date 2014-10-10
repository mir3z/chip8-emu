/* global AudioContext, webkitAudioContext */

var chip8;

(function (chip8) {
    'use strict';

    var ctx = null,
        oscillator = null;

    /**
     * Creates triangle wave with 40Hz frequency.
     * @private
     */
    function createOscillator() {
        oscillator = ctx.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = 400;
        oscillator.connect(ctx.destination);
    }

    /**
     * Emits sound.
     * @class chip8.Audio
     */
    function Audio() {
        var AudioContextClass = AudioContext || webkitAudioContext;
        ctx = new AudioContextClass();
    }

    /**
     * Starts playing.
     * @function play
     * @memberof chip8.Audio
     * @instance
     */
    Audio.prototype.play = function () {
        if (!oscillator) {
            createOscillator();
            if (oscillator) {
                oscillator.start(0);
            }
        }
    };

    /**
     * Stops playing.
     * @function stop
     * @memberof chip8.Audio
     * @instance
     */
    Audio.prototype.stop = function () {
        if (oscillator) {
            oscillator.stop(0);
            oscillator.disconnect(ctx.destination);
            oscillator = null;
        }
    };

    chip8.Audio = Audio;

})(chip8 || (chip8 = {}));
var chip8;

(function (chip8) {
    'use strict';

    /**
     * Creates keyboard instance which handles chip8 input.
     * @class chip8.Keyboard
     */
    function Keyboard() {
        var reversedKey,
            self = this;

        this.keyState = new Array(16);

        for (var key in Keyboard.PC_KEY_MAP) {
            if (Keyboard.PC_KEY_MAP.hasOwnProperty(key)) {
                reversedKey = 'KEY_' + (Keyboard.PC_KEY_MAP[key]).toString(16).toUpperCase();
                Keyboard.CHIP8_KEYS[reversedKey] = parseInt(key, 10);
            }
        }

        function onKeyDown(e) {
            var key = e.which || e.keyCode,
                chip8Key = Keyboard.PC_KEY_MAP[key];

            if (typeof chip8Key !== 'undefined') {
                self.keyDown(chip8Key);
            }
        }

        function onKeyUp(e) {
            var key = e.which || e.keyCode,
                chip8Key = Keyboard.PC_KEY_MAP[key];

            if (typeof chip8Key !== 'undefined') {
                self.keyUp(chip8Key);
            }
        }

        /**
         * This method is called and set to NOP after each key down.
         * @param {number} chip8Key - pressed key number (0x0 - 0xF)
         * @function onNextKeyPressed
         * @memberof chip8.Keyboard
         * @instance
         */
        this.onNextKeyPressed = function (chip8Key) {
            // override in class instance
            void chip8Key;
        };

        window.removeEventListener('keydown',onKeyDown);
        window.removeEventListener('keyup', onKeyUp);

        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
    }

    /**
     * Checks if given key is pressed.
     * @param {number} key - key number (0x0 - 0xF)
     * @returns {boolean} true if key is pressed, false otherwise
     * @function isKeyPressed
     * @memberof chip8.Keyboard
     * @instance
     */
    Keyboard.prototype.isKeyPressed = function (key) {
        return !!this.keyState[key];
    };

    /**
     * Simulates key down.
     * @param {number} chip8Key - key number (0x0 - 0xF)
     * @function keyDown
     * @memberof chip8.Keyboard
     * @instance
     */
    Keyboard.prototype.keyDown = function (chip8Key) {
        this.keyState[chip8Key] = true;
        this.onNextKeyPressed(chip8Key);
        this.onNextKeyPressed = function () {};
    };

    /**
     * Simulates key up.
     * @param {number} chip8Key - key number (0x0 - 0xF)
     * @function keyUp
     * @memberof chip8.Keyboard
     * @instance
     */
    Keyboard.prototype.keyUp = function (chip8Key) {
        this.keyState[chip8Key] = false;
    };

    /**
     * Resets keyboard state.
     * @function reset
     * @memberof chip8.Keyboard
     * @instance
     */
    Keyboard.prototype.reset = function () {
        this.keyState = new Array(16);
        this.onNextKeyPressed = function () {};
    };

    /**
     * Maps PC keys to chip8 keys.
     * @memberof chip8.Keyboard
     * @type {Object}
     * @enum
     */
    Keyboard.PC_KEY_MAP = {
        88: 0x0,
        49: 0x1,
        50: 0x2,
        51: 0x3,
        81: 0x4,
        87: 0x5,
        69: 0x6,
        65: 0x7,
        83: 0x8,
        68: 0x9,
        90: 0xA,
        67: 0xB,
        52: 0xC,
        82: 0xD,
        70: 0xE,
        86: 0xF
    };

    /**
     * Maps chip8 keys to PC keys.
     * Populated in constructor.
     * @memberof chip8.Keyboard
     * @type {Object}
     */
    Keyboard.CHIP8_KEYS = {};

    chip8.Keyboard = Keyboard;

})(chip8 || (chip8 = {}));
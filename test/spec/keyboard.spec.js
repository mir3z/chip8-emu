/* global chip8, describe, it, beforeEach, expect */

describe('Keyboard', function () {
    'use strict';

    var keyb = null,
        Keyboard = chip8.Keyboard;

    beforeEach(function () {
        keyb = new chip8.Keyboard();
    });

    function keys(obj) {
        var ret = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                ret.push(prop);
            }
        }
        return ret;
    }

    it('is defined', function () {
        expect(Keyboard).toBeDefined();
    });

    it('has key map property', function () {
        expect(Keyboard.PC_KEY_MAP).toBeDefined();
        expect(keys(Keyboard.PC_KEY_MAP).length).toEqual(16);
    });

    it('has keys property', function () {
        expect(Keyboard.CHIP8_KEYS).toBeDefined();
        expect(keys(Keyboard.CHIP8_KEYS).length).toEqual(16);
    });

    it('handles key down and key up', function () {
        var key = Keyboard.CHIP8_KEYS.KEY_5;
        expect(keyb.isKeyPressed(key)).toBeFalsy();
        keyb.keyDown(key);
        expect(keyb.isKeyPressed(key)).toBeTruthy();
        keyb.keyUp(key);
        expect(keyb.isKeyPressed(key)).toBeFalsy();
    });

    it('allows to run callback when next key is pressed', function () {
        var key = Keyboard.CHIP8_KEYS.KEY_6,
            called = false;

        keyb.onNextKeyPressed = function (key) {
            called = true;
            expect(key).toEqual(key);
        };
        keyb.keyDown(key);

        expect(called).toBeTruthy();
    });
});
/**
 * Chip8 Emulator.
 * This object acts as global namespace and thin proxy to the most important CPU methods.
 * @namespace
 */
var chip8;

(/** @lends chip8 */ function (chip8) {
    'use strict';

    var SCREEN_WIDTH = 64,
        SCREEN_HEIGHT = 32;

    /**
     * Initializes emulator and its default modules.
     * @param params
     * @param {chip8.Screen} params.screen - emulator screen instance. If omitted, default chip8.CanvasScreen is
     * created.
     * @param {CanvasRenderingContext2D} params.ctx - context of canvas element which acts as default emulator screen,
     * if params.screen is not specified.
     * @param {chip8.Audio} params.audio - audio module, chip8.Audio instance by default
     * @param {chip8.Keyboard} params.keyboard - keyboard module, chip8.Keyboard by default.
     */
    chip8.initialize = function (params) {
        params.screen = params.screen ||
            new chip8.CanvasScreen(SCREEN_WIDTH, SCREEN_HEIGHT, { ctx: params.ctx });

        params.keyboard = params.keyboard ||
            new chip8.Keyboard();

        params.audio = params.audio ||
            new chip8.Audio();

        this.cpu = new chip8.CPU({
            screen: params.screen,
            keyboard: params.keyboard,
            audio: params.audio
        });
    };

    /**
     * Starts processing.
     * @see {@link chip8.CPU#run}
     */
    chip8.run = function () {
        this.cpu.run();
    };

    /**
     * Stops processing.
     * @see {@link chip8.CPU#stop}
     */
    chip8.stop = function () {
        this.cpu.stop();
    };

    /**
     * Halts processing. CPU performs idle loop.
     * @see {@link chip8.CPU#halt}
     */
    chip8.halt = function () {
        this.cpu.halt();
    };

    /**
     * Resumes CPU from halted state.
     * @see {@link chip8.CPU#resume}
     */
    chip8.resume = function () {
        this.cpu.resume();
    };

    /**
     * Resets state of CPU and all peripherals.
     * @see {@link chip8.CPU#reset}
     */
    chip8.reset = function () {
        this.cpu.reset();
    };

    /**
     * Simulates key down.
     * @param {number} key - key number (0x0 - 0xF)
     * @see {@link chip8.Keyboard#keyDown}
     */
    chip8.keyDown = function (key) {
        this.cpu.keyboard.keyDown(key);
    };

    /**
     * Simulates key up.
     * @param {number} key - key number (0x0 - 0xF)
     * @see {@link chip8.Keyboard#keyUp}
     */
    chip8.keyUp = function (key) {
        this.cpu.keyboard.keyUp(key);
    };

    chip8.loadROM = function (file, successCallback, errorCallback) {
        var req = new XMLHttpRequest();
        req.open("GET", file, true);
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.responseType = 'arraybuffer';
        req.onreadystatechange = function() {
            if (req.readyState !== 4)  { return; }
            if (req.status !== 200)  {
                console.error('Could not load ROM file: ' + req.statusText);
                if (typeof errorCallback === 'function') {
                    errorCallback.call(chip8, req);
                }
            }
            if (typeof errorCallback === 'function') {
                errorCallback.call(chip8, req);
            }
        };
        req.onload = function () {
            chip8.cpu.loadToMemory(new Uint8Array(req.response));
            if (typeof successCallback === 'function') {
                successCallback.call(chip8);
            }
        };
        req.onerror = function () {
            console.error('Could not load ROM file');
            if (typeof errorCallback === 'function') {
                errorCallback.call(chip8, req);
            }
        };
        req.send();
    };

})(chip8 || (chip8 = {}));
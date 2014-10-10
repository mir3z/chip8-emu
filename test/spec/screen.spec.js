/* global chip8, describe, it, expect */

describe('Screen', function () {
    'use strict';

    var Screen = chip8.Screen;

    it('is defined', function () {
        expect(Screen).toBeDefined();
    });

    it('should have clean pixel map after construction', function () {
        var screen = new Screen(5, 10),
            allClean = true;

        for (var i = 0; i < screen.pixelmap.length; ++i) {
            if (screen.pixelmap[i] !== 0) {
                allClean = false;
                break;
            }
        }

        expect(allClean).toBeTruthy();
    });

    it('should have repaint method defined', function () {
        var screen = new Screen(5, 4);
        expect(screen.repaint).toBeDefined();
    });

    it('should allow to draw pixels', function () {
        var screen = new Screen(6, 3);

        screen.togglePixel(0, 0);
        expect(screen.pixelmap[0]).toBeTruthy();

        screen.togglePixel(0, 0);
        expect(screen.pixelmap[0]).toBeFalsy();

        screen.togglePixel(0, 1);
        expect(screen.pixelmap[6]).toBeTruthy();

        screen.togglePixel(5, 2);
        expect(screen.pixelmap[17]).toBeTruthy();
    });

    it('should detect collision', function () {
        var screen = new Screen(6, 3),
            collision;

        collision = screen.togglePixel(0, 0);
        expect(collision === false).toBeTruthy();

        collision = screen.togglePixel(0, 0);
        expect(collision === true).toBeTruthy();

        collision = screen.togglePixel(0, 0);
        expect(collision === false).toBeTruthy();
    });
});
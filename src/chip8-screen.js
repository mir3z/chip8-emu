var chip8;

(function (chip8) {
    'use strict';

    /**
     * Pixel size (square pixel side size)
     * @type {number}
     * @private
     */
    var PIXEL_SIZE = 10;

    /**
     * Constructs monochromatic screen instance. Handles chip8 output.
     * This class should be treated as abstract class. It implements logic but does not perform any rendering.
     * @param {number} cols - number of colums
     * @param {number} rows - number of rows
     * @param {object} [options] - additional options
     * @class chip8.Screen
     */
    function Screen(cols, rows, options) {
        this.cols = cols;
        this.rows = rows;
        this.options = options || {};
        this.pixelmap = null;
        this.clear();
    }

    /**
     * Toggles pixel at location (x, y).
     * @param {number} x
     * @param {number} y
     * @returns {boolean} true if collision occurs, false otherwise.
     * @function togglePixel
     * @memberof chip8.Screen
     * @instance
     */
    Screen.prototype.togglePixel = function (x, y) {
        var idx = x + y * this.cols,
            collision;

        collision = !!this.pixelmap[idx];
        this.pixelmap[idx] ^= 1;

        return collision;
    };

    /**
     * Clears internal screen representation.
     * @function clear
     * @memberof chip8.Screen
     * @instance
     */
    Screen.prototype.clear = function () {
        this.pixelmap = new Uint8Array(this.rows * this.cols);
    };

    /**
     * Does repaint. Implement in subclass.
     * @function repaint
     * @memberof chip8.Screen
     * @instance
     */
    Screen.prototype.repaint = function () {
        // override
    };

    /**
     * Extends abstract screen. Extending object should implement *render* method and optionally *initialize* method
     * which works as constructor.
     * @param {object} obj - object which extends base functionality.
     * @returns {function} new constructor.
     * @function extend
     * @memberof chip8.Screen
     * @static
     */
    Screen.extend = function (obj) {
        var F = function () {
            if (obj.initialize) {
                obj.initialize.apply(this, arguments);
            } else {
                F.prototype.constructor.apply(this, arguments);
            }
        };
        F.prototype = new Screen(null, null, {});
        F.prototype.repaint = obj.repaint;
        return F;
    };
    chip8.Screen = Screen;

    chip8.CanvasScreen = Screen.extend(/** lends chip8.CanvasScreen.prototype */ {
        /**
         * Renders to canvas.
         * @param {number} cols - number of colums
         * @param {number} rows - number of rows
         * @param {object} options - additional options
         * @param {object} options.ctx - canvas context
         * @param {boolean} [options.drawGrid] - true if pixel grid should be rendered (default: true)
         * @param {string} [options.bgColor] - background color (default: #080808)
         * @param {string} [options.fgColor] - foreground color (default: #FFF)
         * @param {string} [options.gridColor] - grid color (default: #121212)
         * @constructs chip8.CanvasScreen
         * @extends chip8.Screen
         */
        initialize: function (cols, rows, options) {
            chip8.CanvasScreen.prototype.constructor.apply(this, arguments);
            this.drawGrid = ((typeof options.drawGrid !== 'undefined') ? options.drawGrid : true);
            this.bgColor = ((typeof options.bgColor !== 'undefined') ? options.bgColor : '#080808');
            this.fgColor = ((typeof options.fgColor !== 'undefined') ? options.fgColor : '#FFF');
            this.gridColor = ((typeof options.gridColor !== 'undefined') ? options.gridColor : '#121212');

            this.ctx = options.ctx;
            this.ctx.canvas.width = cols * PIXEL_SIZE;
            this.ctx.canvas.height = rows * PIXEL_SIZE;
        },

        /**
         * Repaints screen.
         * @memberof chip8.CanvasScreen#
         */
        repaint: function () {
            var x, y, i, len;

            // background
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.cols * PIXEL_SIZE, this.rows * PIXEL_SIZE);

            // pixels
            this.ctx.fillStyle = this.fgColor;
            for (i = 0, len = this.rows * this.cols; i < len; ++i) {
                if (this.pixelmap[i]) {
                    x = i % this.cols;
                    y = Math.floor(i / this.cols);
                    this.ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                }
            }

            // grid
            if (this.drawGrid) {
                this.ctx.strokeStyle = this.gridColor;
                for (i = 1; i < this.cols; ++i) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i * PIXEL_SIZE, 0);
                    this.ctx.lineTo(i * PIXEL_SIZE, this.rows * PIXEL_SIZE);
                    this.ctx.stroke();
                }

                for (i = 1; i < this.rows; ++i) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, i * PIXEL_SIZE);
                    this.ctx.lineTo(this.cols * PIXEL_SIZE, i * PIXEL_SIZE);
                    this.ctx.stroke();
                }
            }
        }
    });

})(chip8 || (chip8 = {}));
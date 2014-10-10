var chip8;

(function (chip8) {
    'use strict';

    /**
     * Module which keeps instructions set.
     * @namespace chip8.CPU.IS
     * @memberof chip8.CPU
     */
    chip8.CPU.IS =  /** @lends chip8.CPU.IS */ {
        /**
         * <pre><code>0nnn - SYS addr</code></pre>
         * Jump to a machine code routine at nnn.
         * This instruction is only used on the old computers on which Chip-8 was originally implemented.
         * It is ignored by modern interpreters.
         * @returns {Function}
         */
        SYS: function () {
            return function (cpu) {
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            } ;
        },

        /**
         * <pre><code>00E0 - CLS</code></pre>
         * Clears the display.
         * @returns {Function}
         */
        CLS: function () {
            return function (cpu) {
                cpu.screen.clear();
                cpu.repaint = true;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy0 - LD Vx, Vy</code></pre>
         * Set Vx = Vy
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        LD_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[x] = cpu.V[y];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },


        /**
         * <pre><code>6xkk - LD Vx, kk</code></pre>
         * Set Vx = kk
         * @param {number} x
         * @param {number} kk
         * @returns {Function}
         */
        LD_Vx_kk: function (x, kk) {
            return function (cpu) {
                cpu.V[x] = kk;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy1 - OR Vx, Vy</code></pre>
         * Set Vx = Vx OR Vy.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        OR_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[x] = cpu.V[x] | cpu.V[y];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy2 - AND Vx, Vy</code></pre>
         * Set Vx = Vx AND Vy.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        AND_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[x] = cpu.V[x] & cpu.V[y];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy3 - XOR Vx, Vy</code></pre>
         * Set Vx = Vx XOR Vy.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        XOR_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[x] = cpu.V[x] ^ cpu.V[y];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy4 - ADD Vx, Vy</code></pre>
         * Set Vx = Vx + Vy, set VF = carry.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        ADD_Vx_Vy: function (x, y) {
            return function (cpu) {
                var sum = cpu.V[x] + cpu.V[y];
                cpu.V[0xF] = (sum > 0xFF ? 1 : 0); // carry
                cpu.V[x] = sum;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy5 - SUB Vx, Vy</code></pre>
         * Set Vx = Vx - Vy, set VF = NOT borrow.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SUB_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[0xF] = (cpu.V[x] >= cpu.V[y] ? 1 : 0); // NOT borrow
                cpu.V[x] = cpu.V[x] - cpu.V[y];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy7 - SUBN Vx, Vy</code></pre>
         * Set Vx = Vy - Vx, set VF = NOT borrow.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SUBN_Vx_Vy: function (x, y) {
            return function (cpu) {
                cpu.V[0xF] = (cpu.V[y] >= cpu.V[x] ? 1 : 0); // NOT borrow
                cpu.V[x] = cpu.V[y] - cpu.V[x];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xy6 - SHR Vx, Vy</code></pre>
         * Set Vx = Vy SHR 1.
         * If shift quirks enabled Vx = Vx SHR 1.
         * If the least-significant bit of shifted value is 1, then VF is set to 1, otherwise 0.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SHR_Vx_Vy: function (x, y) {
            return function (cpu) {
                if (cpu.quirks.shift) {
                    y = x;
                }
                cpu.V[0xF] = cpu.V[y] & 0x01;
                cpu.V[x] = cpu.V[y] >> 1;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>8xyE - SHL Vx, Vy</code></pre>
         * Set Vx = Vy SHL 1.
         * If shift quirks enabled Vx = Vx SHL 1.
         * If the most-significant bit of shifted value is 1, then VF is set to 1, otherwise to 0.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SHL_Vx_Vy: function (x, y) {
            return function (cpu) {
                if (cpu.quirks.shift) {
                    y = x;
                }
                cpu.V[0xF] = (cpu.V[y] >> 7) & 0x01;
                cpu.V[x] = cpu.V[y] << 1;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>7xkk - ADD Vx, kk</code></pre>
         * Set Vx = Vx + kk.
         * @param {number} x
         * @param {number} kk
         * @returns {Function}
         */
        ADD_Vx_kk: function (x, kk) {
            return function (cpu) {
                cpu.V[x] = cpu.V[x] + kk;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>9xy0 - SNE Vx, Vy</code></pre>
         * Skip next instruction if Vx != Vy.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SNE_Vx_Vy: function (x, y) {
            return function (cpu) {
                if (cpu.V[x] !== cpu.V[y]) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>4xkk - SNE Vx, kk</code></pre>
         * Skip next instruction if Vx != kk.
         * @param {number} x
         * @param {number} kk
         * @returns {Function}
         */
        SNE_Vx_kk: function (x, kk) {
            return function (cpu) {
                if (cpu.V[x] !== kk) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>3xkk - SE Vx, kk</code></pre>
         * Skip next instruction if Vx = kk.
         * @param {number} x
         * @param {number} kk
         * @returns {Function}
         */
        SE_Vx_kk: function (x, kk) {
            return function (cpu) {
                if (cpu.V[x] === kk) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>5xy0 - SE Vx, Vy</code></pre>
         * Skip next instruction if Vx = Vy.
         * @param {number} x
         * @param {number} y
         * @returns {Function}
         */
        SE_Vx_Vy: function (x, y) {
            return function (cpu) {
                if (cpu.V[x] === cpu.V[y]) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>1nnn - JP nnn</code></pre>
         * Jump to location nnn.
         * @param {number} nnn
         * @returns {Function}
         */
        JP_nnn: function (nnn) {
            return function (cpu) {
                cpu.pc = nnn;
            };
        },

        /**
         * <pre><code>00EE - RET</code></pre>
         * Return from a subroutine.
         * @returns {Function}
         */
        RET: function () {
            return function (cpu) {
                cpu.sp = (cpu.sp - 1) & (cpu.stack.length - 1);
                cpu.pc = cpu.stack[cpu.sp];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>2nnn - CALL nnn</code></pre>
         * Call subroutine at nnn.
         * @param {number} nnn
         * @returns {Function}
         */
        CALL_nnn: function (nnn) {
            return function (cpu) {
                cpu.stack[cpu.sp] = cpu.pc;
                cpu.sp = (cpu.sp + 1) & (cpu.stack.length - 1);
                cpu.pc = nnn;
            };
        },

        /**
         * <pre><code>Annn - LD I, nnn</code></pre>
         * Set I = nnn.
         * @param {number} nnn
         * @returns {Function}
         */
        LD_I_nnn: function (nnn) {
            return function (cpu) {
                cpu.i = nnn;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Bnnn - JP V0, nnn</code></pre>
         * Jump to location nnn + V0.
         * @param {number} nnn
         * @returns {Function}
         */
        JP_V0_nnn: function (nnn) {
            return function (cpu) {
                cpu.pc = (nnn + cpu.V[0]) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Cxkk - RND Vx, kk</code></pre>
         * Set Vx = random byte AND kk.
         * @param {number} x
         * @param {number} kk
         * @returns {Function}
         */
        RND_Vx_kk: function (x, kk) {
            return function (cpu) {
                cpu.V[x] = Math.floor(Math.random() * (0xFF + 1)) & kk;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx33 - LD B, Vx</code></pre>
         * Store BCD representation of Vx in memory locations I, I+1, and I+2.
         * @param {number} x
         * @returns {Function}
         */
        LD_B_Vx : function (x) {
            return function (cpu) {
                cpu.mem[cpu.i]     = parseInt(cpu.V[x] / 100, 10);
                cpu.mem[cpu.i + 1] = parseInt(cpu.V[x] % 100 / 10, 10);
                cpu.mem[cpu.i + 2] = cpu.V[x] % 10;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx07 - LD Vx, DT</code></pre>
         * Set Vx = delay timer value.
         * @param {number} x
         * @returns {Function}
         */
        LD_Vx_DT: function (x) {
            return function (cpu) {
                cpu.V[x] = cpu.dt;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx15 - LD DT, Vx</code></pre>
         * Set delay timer = Vx.
         * @param {number} x
         * @returns {Function}
         */
        LD_DT_Vx: function (x) {
            return function (cpu) {
                cpu.dt = cpu.V[x];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx18 - LD ST, Vx</code></pre>
         * Set sound timer = Vx.
         * @param {number} x
         * @returns {Function}
         */
        LD_ST_Vx: function (x) {
            return function (cpu) {
                cpu.st = cpu.V[x];
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx1E - ADD I, Vx</code></pre>
         * Set I = I + Vx.
         * @param {number} x
         * @returns {Function}
         */
        ADD_I_Vx: function (x) {
            return function (cpu) {
                cpu.i = (cpu.i + cpu.V[x]) & 0xFFF;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx55 - LD [I], Vx</code></pre>
         * Store registers V0 through Vx in memory starting at location I.
         * The value of the I register will be incremented by X + 1, if load/store quirks are disabled.
         * @param {number} x
         * @returns {Function}
         */
        LD_I_Vx: function (x) {
            return function (cpu) {
                for (var i = 0 ; i <= x; ++i) {
                    cpu.mem[cpu.i + i] = cpu.V[i];
                }
                if (!cpu.quirks.loadStore) {
                    cpu.i += x + 1;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx65 - LD Vx, [I]</code></pre>
         * Read registers V0 through Vx from memory starting at location I.
         * The value of the I register will be incremented by X + 1, if load/store quirks are disabled.
         * @param {number} x
         * @returns {Function}
         */
        LD_Vx_I: function (x) {
            return function (cpu) {
                for (var i = 0; i <= x; ++i) {
                    cpu.V[i] = cpu.mem[cpu.i + i];
                }
                if (!cpu.quirks.loadStore) {
                    cpu.i += x + 1;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx0A - LD Vx, K</code></pre>
         * Wait for a key press, store the value of the key in Vx.
         * @param {number} x
         * @returns {Function}
         */
        LD_Vx_K: function (x) {
            return function (cpu) {
                cpu.halted = true;
                cpu.keyboard.onNextKeyPressed = function (key) {
                    cpu.V[x] = key;
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                    cpu.halted = false;
                };
            };
        },

        /**
         * <pre><code>Ex9E - SKP Vx</code></pre>
         * Skip next instruction if key with the value of Vx is pressed.
         * @param {number} x
         * @returns {Function}
         */
        SKP_Vx: function (x) {
            return function (cpu) {
                if (cpu.keyboard.isKeyPressed(cpu.V[x])) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>ExA1 - SKNP Vx</code></pre>
         * Skip next instruction if key with the value of Vx is not pressed.
         * @param {number} x
         * @returns {Function}
         */
        SKNP_Vx: function (x) {
            return function (cpu) {
                if (!cpu.keyboard.isKeyPressed(cpu.V[x])) {
                    cpu.pc = (cpu.pc + 2) & 0x0FFF;
                }
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Fx29 - LD F, Vx</code></pre>
         * Set I = location of sprite for digit Vx.
         * @param {number} x
         * @returns {Function}
         */
        LD_F_Vx: function (x) {
            return function (cpu) {
                cpu.i = cpu.V[x] * 5;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        },

        /**
         * <pre><code>Dxyn - DRW Vx, Vy, n</code></pre>
         * Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
         * @param {number} x
         * @param {number} y
         * @param {number} n
         * @returns {Function}
         */
        DRW_Vx_Vy_n: function (x, y, n) {
            return function (cpu) {
                var hline, vline, membyte, coll;

                cpu.V[0xF] = 0;
                for (hline = 0; hline < n; ++hline) {
                    membyte = cpu.mem[cpu.i + hline];

                    for  (vline = 0; vline < 8; ++vline) {
                        if ((membyte & (0x80 >> vline)) !== 0) {
                            coll = cpu.screen.togglePixel(cpu.V[x] + vline, cpu.V[y] + hline);
                            if (coll) {

                                cpu.V[0xF] = 1;
                            }
                        }
                    }
                }

                cpu.repaint = true;
                cpu.pc = (cpu.pc + 2) & 0x0FFF;
            };
        }
    };

})(chip8 || (chip8 = {}));
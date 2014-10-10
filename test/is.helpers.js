/* global chip8, expect, spyOn */

(function (CPU) {
    'use strict';

    function testCycle(cpu, params) {
        var spy,
            scope = {
                oldPc: cpu.pc,
                oldSp: cpu.sp
            };

        cpu.mem[cpu.pc] = (params.opCode & 0xFF00) >> 8;
        cpu.mem[cpu.pc + 1] = params.opCode & 0x00FF;

        if (typeof params.preFn === 'function') {
            params.preFn.call(scope);
        }

        if (typeof params.op !== 'undefined') {
            if (typeof CPU.IS[params.op].calls === 'undefined') {
                spyOn(CPU.IS, params.op).and.callThrough();
            }
        }

        cpu.step();
        cpu.updateTimers();

        if (typeof params.postFn === 'function') {
            params.postFn.call(scope);
        }

        if (typeof params.op !== 'undefined') {
            if (typeof params.args !== 'undefined') {
                expect(CPU.IS[params.op]).toHaveBeenCalledWith.apply(expect(CPU.IS[params.op]), params.args);
            } else {
                expect(CPU.IS[params.op]).toHaveBeenCalled();
            }
        }
    }

    window.helpers = {
        test_LD_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8000 | (params.x << 8) | (params.y << 4),
                op: 'LD_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(cpu.V[params.y]);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SYS: function (cpu) {
            testCycle(cpu, {
                opCode: 0x0666,
                op: 'SYS',
                args: [ ],
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_CLS: function (cpu) {
            spyOn(cpu.screen, 'repaint');
            spyOn(cpu.screen, 'clear');

            testCycle(cpu, {
                opCode: 0x00E0,
                op: 'CLS',
                args: [ ],
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.screen.clear).toHaveBeenCalled();
                    expect(cpu.screen.repaint).toHaveBeenCalled();
                }
            });
        },

        test_OR_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8001 | (params.x << 8) | (params.y << 4),
                op: 'OR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_AND_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8002 | (params.x << 8) | (params.y << 4),
                op: 'AND_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_XOR_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8003 | (params.x << 8) | (params.y << 4),
                op: 'XOR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_ADD_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8004 | (params.x << 8) | (params.y << 4),
                op: 'ADD_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                    expect(cpu.V[0xF]).toEqual(params.carry);
                }
            });
        },

        test_SUB_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8005 | (params.x << 8) | (params.y << 4),
                op: 'SUB_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                    expect(cpu.V[0xF]).toEqual(params.noBorrow);
                }
            });
        },

        test_SUBN_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8007 | (params.x << 8) | (params.y << 4),
                op: 'SUBN_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                    expect(cpu.V[0xF]).toEqual(params.noBorrow);
                }
            });
        },

        test_SHR_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x8006 | (params.x << 8) | (params.y << 4),
                op: 'SHR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.expX);
                    expect(cpu.V[params.y]).toEqual(params.expY);
                    expect(cpu.V[0xF]).toEqual(params.regF);
                }
            });
        },

        test_SHL_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x800E | (params.x << 8) | (params.y << 4),
                op: 'SHL_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.y] = params.yVal;
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.expX);
                    expect(cpu.V[params.y]).toEqual(params.expY);
                    expect(cpu.V[0xF]).toEqual(params.regF);
                }
            });
        },

        test_SNE_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
               opCode: 0x9000 | (params.x << 8) | (params.y << 4),
                op: 'SNE_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SNE_Vx_kk: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x4000 | (params.x << 8) | (params.byte),
                op: 'SNE_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                }
            });
        },

        test_SE_Vx_Vy: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x5000 | (params.x << 8) | (params.y << 4),
                op: 'SE_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                    expect(cpu.V[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SE_Vx_kk: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x3000 | (params.x << 8) | (params.byte),
                op: 'SE_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                }
            });
        },

        test_ADD_Vx_kk: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x7000 | (params.x << 8) | params.byte,
                op: 'ADD_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.result);
                }
            });
        },

        test_LD_Vx_kk: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x6000 | (params.x << 8) | params.byte,
                op: 'LD_Vx_kk',
                args: [ params.x, params.byte ],
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.byte);
                }
            });
        },

        test_JP_nnn: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x1000 | params.addr,
                op: 'JP_nnn',
                args: [ params.addr ],
                postFn: function () {
                    expect(cpu.pc).toEqual(params.addr);
                }
            });
        },

        test_CALL_nnn: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x2000 | params.addr,
                op: 'CALL_nnn',
                args: [ params.addr ],
                postFn: function () {
                    expect(cpu.pc).toEqual(params.addr);
                    expect(cpu.stack[this.oldSp]).toEqual(this.oldPc);
                    expect(cpu.sp).toEqual((this.oldSp + 1) & 0xF);
                }
            });
        },

        test_RET: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0x00EE,
                op: 'RET',
                args: [ ],
                preFn: function () {
                    for (var i = 0; i < params.stack.length; ++i) {
                        cpu.stack[i] = params.stack[i];
                    }
                    cpu.sp = params.sp;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual(params.expectedPc);
                    expect(cpu.sp).toEqual((params.sp - 1) & 0xF);
                }
            });
        },

        test_LD_I_nnn: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xA000 | params.val,
                op: 'LD_I_nnn',
                args: [ params.val ],
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.i).toEqual(params.val);
                }
            });
        },

        test_JP_V0_nnn: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xB000 | params.addr,
                op: 'JP_V0_nnn',
                args: [ params.addr ],
                preFn: function () {
                    cpu.V[0] = params.v0;
                },
                postFn: function () {
                    expect(cpu.pc).toEqual(params.expectedPc);
                    expect(cpu.V[0]).toEqual(params.v0);
                }
            });
        },

        test_RND_Vx_kk: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xC000 | (params.x << 8) | 1,
                op: 'RND_Vx_kk',
                args: [ params.x, 1 ],
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect([0, 1]).toContain(cpu.V[params.x]);
                }
            });
        },

        test_LD_Vx_DT: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF007 | (params.x << 8),
                op: 'LD_Vx_DT',
                args: [ params.x ],
                preFn: function () {
                    cpu.dt = params.dt;
                },
                postFn: function () {
                    expect(cpu.V[params.x]).toEqual(params.dt);
                    expect(cpu.dt).toEqual((params.dt - 1) & 0xFF);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_DT_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF015 | (params.x << 8),
                op: 'LD_DT_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                    expect(cpu.dt).toEqual((params.xVal - 1) & 0xFF);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_ST_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF018 | (params.x << 8),
                op: 'LD_ST_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                    expect(cpu.st).toEqual((params.xVal - 1) & 0xFF);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_ADD_I_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF01E | (params.x << 8),
                op: 'ADD_I_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.i = params.iVal;
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.i).toEqual(params.result);
                    expect(cpu.V[params.x]).toEqual(params.xVal);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_I_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF055 | (params.x << 8),
                op: 'LD_I_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.i = params.iVal;
                    for (var i = 0; i <= params.regs.length; ++i) {
                        cpu.V[i] = params.regs[i];
                    }
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.i).toEqual(params.expectedIVal);
                    for (var i = 0; i <= params.x; ++i) {
                        expect(cpu.mem[params.iVal + i]).toEqual(cpu.V[i]);
                    }
                }
            });
        },

        test_LD_Vx_I: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF065 | (params.x << 8),
                op: 'LD_Vx_I',
                args: [ params.x ],
                preFn: function () {
                    cpu.i = params.iVal;
                    for (var i = 0; i <= params.mem.length; ++i) {
                        cpu.mem[cpu.i + i] = params.mem[i];
                    }
                },
                postFn: function () {
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.i).toEqual(params.expectedIVal);
                    for (var i = 0; i <= params.x; ++i) {
                        expect(cpu.V[i]).toEqual(cpu.mem[params.iVal + i]);
                    }
                }
            });
        },

        test_LD_Vx_K: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF00A | (params.x << 8),
                op: 'LD_Vx_K',
                args: [ params.x ],
                postFn: function () {
                    cpu.keyboard.keyDown(params.key);

                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[params.x]).toEqual(params.key);
                    expect(cpu.halted).toBeFalsy();
                }
            });
        },

        test_SKP_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xE09E | (params.x << 8),
                op: 'SKP_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    if (params.pressed) {
                        cpu.keyboard.keyDown(params.key);
                    }
                },
                postFn: function () {
                    if (params.shouldSkip) {
                        expect(cpu.pc).toEqual((this.oldPc + 4) & 0x0FFF);
                    } else {
                        expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    }
                }
            });
        },

        test_SKNP_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xE0A1 | (params.x << 8),
                op: 'SKNP_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    if (params.pressed) {
                        cpu.keyboard.keyDown(params.key);
                    }
                },
                postFn: function () {
                    if (params.shouldSkip) {
                        expect(cpu.pc).toEqual((this.oldPc + 4) & 0x0FFF);
                    } else {
                        expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    }
                }
            });
        },

        test_LD_F_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF029 | (params.x << 8),
                op: 'LD_F_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.i).toEqual(params.i);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_B_Vx: function (cpu, params) {
            testCycle(cpu, {
                opCode: 0xF033 | (params.x << 8),
                op: 'LD_B_Vx',
                args: [ params.x ],
                preFn: function () {
                    cpu.i = params.i;
                    cpu.V[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(cpu.i).toEqual(params.i);
                    expect(cpu.mem[cpu.i]).toEqual(params.digits[0]);
                    expect(cpu.mem[cpu.i + 1]).toEqual(params.digits[1]);
                    expect(cpu.mem[cpu.i + 2]).toEqual(params.digits[2]);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_DRW_Vx_Vy_n: function (cpu, params) {
            if (typeof cpu.screen.togglePixel.calls === 'undefined') {
                spyOn(cpu.screen, 'togglePixel').and.callThrough();
            }

            cpu.screen.repaint = function () {};

            testCycle(cpu, {
                opCode: 0xD000 | (params.x << 8) | (params.y << 4) | (params.n),
                op: 'DRW_Vx_Vy_n',
                args: [ params.x, params.y, params.n ],
                preFn: function () {
                    cpu.V[params.x] = params.xVal;
                    cpu.V[params.y] = params.yVal;
                    cpu.i = params.i;
                    for (var i = 0; i < params.sprite.length; ++i) {
                        cpu.mem[cpu.i + i] = params.sprite[i];
                    }
                },
                postFn: function () {
                    expect(cpu.i).toEqual(params.i);
                    expect(cpu.pc).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(cpu.V[0xF]).toEqual(params.VF);
                    expect(cpu.screen.togglePixel.calls.count()).toEqual(params.calls.length);

                    for (var i = 0; i < params.calls.length; ++i) {
                        expect(cpu.screen.togglePixel).toHaveBeenCalledWith(
                            params.calls[i][0],
                            params.calls[i][1]
                        );
                    }
                }
            });

            cpu.screen.togglePixel.calls.reset();
        }

    };

})(chip8.CPU);
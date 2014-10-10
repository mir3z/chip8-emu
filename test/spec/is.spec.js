/* global chip8, helpers, describe, it, beforeEach */

describe('Instruction set', function () {
    'use strict';

    var cpu = null;

	beforeEach(function() {
        cpu = new chip8.CPU({
            keyboard: new chip8.Keyboard(),
            screen: new chip8.Screen(64, 32)
        });
  	});

    // CLS: 0x0E0
    it('CLS', function () {
       helpers.test_CLS(cpu);
    });

    // SYS: 0x0nnn
    it('SYS nnn', function () {
        helpers.test_SYS(cpu);
    });
	
	// LD Vx, Vy, 0x8xy0
	it('LD Vx, Vy', function () {
		helpers.test_LD_Vx_Vy(cpu, { x: 0x0, y: 0x1, xVal: 0xAA, yVal: 0xBB });
	});

	// OR Vx, Vy, 0x8xy1
	it('OR Vx, Vy', function () {
		helpers.test_OR_Vx_Vy(cpu, { x: 0x1, y: 0x2, xVal: 0xBB, yVal: 0xCC, result: 0xFF });
	});

	// AND Vx, Vy, 0x8xy2
	it('AND Vx, Vy', function () {
		helpers.test_AND_Vx_Vy(cpu, { x: 0x2, y: 0x3, xVal: 0xCC, yVal: 0xDD, result: 0xCC });
	});	

	// XOR Vx, Vy, 0x8xy3
	it('XOR Vx, Vy', function () {
		helpers.test_XOR_Vx_Vy(cpu, { x: 0x3, y: 0x4, xVal: 0xDD, yVal: 0xEE, result: 0x33 });
	});

    // ADD Vx, Vy, 0x8xy4
    it('ADD Vx, Vy', function () {
        helpers.test_ADD_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x44, yVal: 0xAA, carry: 0, result: 0xEE }); // no carry
        helpers.test_ADD_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0xAA, yVal: 0xAA, carry: 1, result: 0x54 }); // carry
    });

    // SUB Vx, Vy, 0x8xy5
    it('SUB Vx, Vy', function () {
        helpers.test_SUB_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0xAA, yVal: 0x22, noBorrow: 1, result: 0x88 }); // no borrow
        helpers.test_SUB_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x22, yVal: 0xDD, noBorrow: 0, result: 0x45 }); // borrow

        // SCTEST - ERROR 6
        helpers.test_SUB_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x01, yVal: 0x01, noBorrow: 1, result: 0x00 }); // no borrow
    });

    // SUBN Vx, Vy, 0x8xy7
    it('SUBN Vx, Vy', function () {
        helpers.test_SUBN_Vx_Vy(cpu, { x: 0x6, y: 0x7, xVal: 0x22, yVal: 0xAA, noBorrow: 1, result: 0x88 }); // no borrow
        helpers.test_SUBN_Vx_Vy(cpu, { x: 0x6, y: 0x7, xVal: 0xDD, yVal: 0x22, noBorrow: 0, result: 0x45 }); // borrow
    });

    // SHR Vx, Vy, 0x8xy6
    describe('SHR Vx, Vy', function () {
        it('when shift quirks disabled', function () {
            cpu.quirks.shift = false;
            helpers.test_SHR_Vx_Vy(cpu, { x: 0x5, y: 0x6, xVal: 0x11, yVal: 0x44, expX: 0x22, expY: 0x44, regF: 0x0 });
            helpers.test_SHR_Vx_Vy(cpu, { x: 0x5, y: 0x6, xVal: 0x11, yVal: 0x45, expX: 0x22, expY: 0x45, regF: 0x1 });
        });

        it('when shift quirks enabled', function () {
            cpu.quirks.shift = true;
            helpers.test_SHR_Vx_Vy(cpu, { x: 0x5, y: 0x6, xVal: 0x44, yVal: 0x11, expX: 0x22, expY: 0x11, regF: 0x0 });
            helpers.test_SHR_Vx_Vy(cpu, { x: 0x5, y: 0x6, xVal: 0x45, yVal: 0x11, expX: 0x22, expY: 0x11, regF: 0x1 });
        });
    });

    // SHL Vx, Vy, 0x8xyE
    describe('SHL Vx, Vy', function () {

        it('when shift quirks disabled', function () {
            cpu.quirks.shift = false;
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x22, yVal: 0x44, expX: 0x88, expY: 0x44, regF: 0x0 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x22, yVal: 0x45, expX: 0x8A, expY: 0x45, regF: 0x0 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x6, xVal: 0x22, yVal: 0xFF, expX: 0xFE, expY: 0xFF, regF: 0x1 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x7, xVal: 0x22, yVal: 0x7F, expX: 0xFE, expY: 0x7F, regF: 0x0 });
        });

        it('when shift quirks enabled', function () {
            cpu.quirks.shift = true;
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x44, yVal: 0x22, expX: 0x88, expY: 0x22, regF: 0x0 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x5, xVal: 0x45, yVal: 0x22, expX: 0x8A, expY: 0x22, regF: 0x0 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x6, xVal: 0xFF, yVal: 0x22, expX: 0xFE, expY: 0x22, regF: 0x1 });
            helpers.test_SHL_Vx_Vy(cpu, { x: 0x4, y: 0x7, xVal: 0x7F, yVal: 0x22, expX: 0xFE, expY: 0x22, regF: 0x0 });
        });
    });

    // SNE Vx, Vy, 0x9xy0
    it('SNE Vx, Vy', function () {
        helpers.test_SNE_Vx_Vy(cpu, { x: 0x6, y: 0x7, xVal: 0x10, yVal: 0x10, pcOffset: 2 });
        helpers.test_SNE_Vx_Vy(cpu, { x: 0x6, y: 0x7, xVal: 0x10, yVal: 0x20, pcOffset: 4 });
    });

    // SNE Vx, kk, 0x4xkk
    it('SNE Vx, kk', function () {
        helpers.test_SNE_Vx_kk(cpu, { x: 0x6, xVal: 0x10, byte: 0x10, pcOffset: 2 });
        helpers.test_SNE_Vx_kk(cpu, { x: 0x8, xVal: 0x10, byte: 0x60, pcOffset: 4 });
    });

    // SE Vx, Vy, 0x5xy0
    it('SE Vx, Vy', function () {
        helpers.test_SE_Vx_Vy(cpu, { x: 0x8, y: 0x9, xVal: 0x20, yVal: 0x20, pcOffset: 4 });
        helpers.test_SE_Vx_Vy(cpu, { x: 0x8, y: 0x9, xVal: 0x20, yVal: 0x40, pcOffset: 2 });
    });

    // SE Vx, kk, 0x3xkk
    it('SE Vx, kk', function () {
        helpers.test_SE_Vx_kk(cpu, { x: 0xA, xVal: 0x60, byte: 0x60, pcOffset: 4 });
        helpers.test_SE_Vx_kk(cpu, { x: 0xA, xVal: 0x30, byte: 0x60, pcOffset: 2 });
    });

    // ADD Vx, kk, 0x7xkk
    it('ADD Vx, kk', function () {
        helpers.test_ADD_Vx_kk(cpu, { x: 0x8, xVal: 0x30, byte: 0x55, result: 0x85 });
    });

    // LD Vx, kk, 0x6xkk
    it('LD Vx, kk', function () {
       helpers.test_LD_Vx_kk(cpu, { x: 0x09, byte: 0xFF });
    });

    // JP nnn, 0x1nnn
    it('JP nnn', function () {
        helpers.test_JP_nnn(cpu, { addr: 0x0AAA });
        helpers.test_JP_nnn(cpu, { addr: 0x0FFF });
    });

    // CALL nnn, 0x2nnn
    it('CALL nnn', function () {
        helpers.test_CALL_nnn(cpu, { addr: 0xAA });
        helpers.test_CALL_nnn(cpu, { addr: 0xBB });
        helpers.test_CALL_nnn(cpu, { addr: 0xCC });
    });

    // RET, 0x00EE
    it('RET', function () {
        helpers.test_RET(cpu, { stack: [0x33], sp: 1, expectedPc: 0x35 });
        helpers.test_RET(cpu, { stack: [0xAA, 0xBB, 0xCC], sp: 3, expectedPc: 0xCE });
    });

    // LD I, nnn, 0xAnnn
    it('LD I, nnn', function () {
        helpers.test_LD_I_nnn(cpu, { val: 0xCCC });
    });

    // JP V0, nnn, 0xBnnn
    it('JP V0, nnn', function () {
        helpers.test_JP_V0_nnn(cpu, { v0: 0x44, addr: 0x555, expectedPc: 0x599 });
        helpers.test_JP_V0_nnn(cpu, { v0: 0x1, addr: 0xFFF, expectedPc: 0x000 });
    });

    // RND Vx, kk, 0xCxkk
    it('RND Vx, kk', function () {
        helpers.test_RND_Vx_kk(cpu, { x: 0xA });
    });

    // LD Vx, Dt: 0xFx07
    it('LD Vx, DT', function () {
       helpers.test_LD_Vx_DT(cpu, { x: 0xE, dt: 0x20 });
    });

    // LD DT, Vx: 0xFx15
    it('LD DT, Vx', function () {
        helpers.test_LD_DT_Vx(cpu, { x: 0xD, xVal: 0x55 });
    });

    // LD ST, Vx: 0xFx18
    it('LD ST, Vx', function () {
        helpers.test_LD_ST_Vx(cpu, { x: 0xC, xVal: 0x66 });
    });

    // ADD I, Vx: 0xFx1E
    it('ADD I, Vx', function () {
        helpers.test_ADD_I_Vx(cpu, { x: 0xB, xVal: 0x33, iVal: 0x22, result: 0x55 });
        helpers.test_ADD_I_Vx(cpu, { x: 0xA, xVal: 0xFF, iVal: 0x1, result: 0x100 });
        helpers.test_ADD_I_Vx(cpu, { x: 0xC, xVal: 0x01, iVal: 0xFFF, result: 0 });
    });

    // LD I, Vx: 0xFx55
    describe('LD I, Vx', function () {

        it('when load/store quirks disabled', function () {
            cpu.quirks.loadStore = false;
            helpers.test_LD_I_Vx(cpu, { x: 0x5, iVal: 0x0A00, expectedIVal: 0x0A06,
                regs: [ 0x5, 0x6, 0x7, 0x8, 0x9, 0xA ]
            });
            helpers.test_LD_I_Vx(cpu, { x: 0xF, iVal: 0x0A00, expectedIVal: 0x0A10,
                regs: [ 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ]
            });
        });

        it('when load/store quirks enabled', function () {
            cpu.quirks.loadStore = true;
            helpers.test_LD_I_Vx(cpu, { x: 0x5, iVal: 0x0A00, expectedIVal: 0x0A00,
                regs: [ 0x5, 0x6, 0x7, 0x8, 0x9, 0xA ]
            });
            helpers.test_LD_I_Vx(cpu, { x: 0xF, iVal: 0x0A00, expectedIVal: 0x0A00,
                regs: [ 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ]
            });
        });
    });

    // LD Vx, I: 0xFx65
    describe('LD Vx, I', function () {

        it('when load/store quirks disabled', function () {
            cpu.quirks.loadStore = false;
            helpers.test_LD_Vx_I(cpu, { x: 0x6, iVal: 0x0B00, expectedIVal: 0x0B07,
                mem: [ 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9 ]
            });
            helpers.test_LD_Vx_I(cpu, { x: 0xF, iVal: 0x0B00, expectedIVal: 0x0B10,
                mem: [ 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ]
            });
        });

        it('when load/store quirks enabled', function () {
            cpu.quirks.loadStore = true;
            helpers.test_LD_Vx_I(cpu, { x: 0x6, iVal: 0x0B00, expectedIVal: 0x0B00,
                mem: [ 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9 ]
            });
            helpers.test_LD_Vx_I(cpu, { x: 0xF, iVal: 0x0B00, expectedIVal: 0x0B00, mem:
                [ 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF ]
            });
        });
    });

    // LD Vx, K: 0xFx0A
    it('LD Vx, K', function () {
        helpers.test_LD_Vx_K(cpu, { x: 0x5, key: chip8.Keyboard.CHIP8_KEYS.KEY_6 });
    });

    // SKP Vx: 0xEx9E
    it('SKP Vx', function () {
        helpers.test_SKP_Vx(cpu, { x: 0x6, xVal: 0xA, pressed: true, key: 0xA, shouldSkip: true });
        helpers.test_SKP_Vx(cpu, { x: 0x6, xVal: 0xB, pressed: true, key: 0xA, shouldSkip: false });
        helpers.test_SKP_Vx(cpu, { x: 0x6, xVal: 0xC, pressed: false, shouldSkip: false });
    });

    // SKNP Vx: 0xExA1
    it('SKNP Vx', function () {
        helpers.test_SKNP_Vx(cpu, { x: 0x6, xVal: 0xA, pressed: false, shouldSkip: true });
        helpers.test_SKNP_Vx(cpu, { x: 0x6, xVal: 0xB, pressed: true, key: 0xA, shouldSkip: true });
        helpers.test_SKNP_Vx(cpu, { x: 0x6, xVal: 0xB, pressed: true, key: 0xB, shouldSkip: false });
    });

    // LD F, Vx: 0xFx29
    it('LD F, Vx', function () {
        helpers.test_LD_F_Vx(cpu, { x: 0x0, xVal: 0x0, i: 0x0 });
        helpers.test_LD_F_Vx(cpu, { x: 0x0, xVal: 0x1, i: 0x5 });
        helpers.test_LD_F_Vx(cpu, { x: 0x0, xVal: 0x2, i: 0xA });
        helpers.test_LD_F_Vx(cpu, { x: 0x0, xVal: 0xF, i: 0x4B });
    });

    // LD B, Vx: 0xFx33
    it('LD B, Vx', function () {
        helpers.test_LD_B_Vx(cpu, { x: 0xA, xVal: 123, i: 0x0AAA, digits: [1, 2, 3] });
    });

    // DRW Vx, Vy, n: 0xDxyn
    it('DRW Vx, Vy, n', function () {
       /**
        * HEX    BIN        Sprite
        * 0x20   00100000     *
        * 0x3C   00111100     ****
        * 0xC3   11000011   **    **
        */

        helpers.test_DRW_Vx_Vy_n(cpu, {
            sprite: [ 0x3C, 0xC3 ],
            i: 0x0BBB,
            x: 0xA, y: 0xB, xVal: 10, yVal: 10, n: 2,
            VF: 0,
            calls: [[12, 10], [13, 10], [14, 10], [15, 10], [10, 11], [11, 11], [16, 11], [17, 11]]
        });

        helpers.test_DRW_Vx_Vy_n(cpu, {
            sprite: [ 0x20 ],
            i: 0x0BBB,
            x: 0xA, y: 0xB, xVal: 10, yVal: 10, n: 1,
            VF: 1,
            calls: [[12, 10]]
        });
    });
});

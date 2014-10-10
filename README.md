CHIP-8 Emulator
===============

This is a [CHIP-8](http://en.wikipedia.org/wiki/CHIP-8) emulator written in JavaScript.
Try it here: http://mir3z.github.io/chip8-emu/

Features
--------

The emulator has a decent implementation of all 35 CHIP-8 op-codes, all of which are well-tested.

Two known "quirks" have also been implemented (see: `chip8.CPU#quirks`):

* Load/store quirks - Instructions `LD [I], Vx` and `LD Vx, [I]` increments value of I register but some CHIP-8 
programs assumes that they don't.
* Shift quirks - Shift instructions originally shift register VY and store results in register VX. Some CHIP-8 
programs incorrectly assumes that the VX register is shifted by this instruction, and VY remains unmodified.

Project repository contains 90 CHIP-8 roms which can be found at http://chip8.com (CHIP-8 Program Pack). All of them
were checked and should work fine. It is a common issue among emulators I have tested, that some of ROMS were not
working correctly - this is mostly because of quirks I have mentioned above and errors in op-codes implementation.

Original CHIP-8 keyboard layout is mapped to PC keyboard as follows by default:
    
    |1|2|3|C|  =>  |1|2|3|4|
    |4|5|6|D|  =>  |Q|W|E|R|
    |7|8|9|E|  =>  |A|S|D|F|
    |A|0|B|F|  =>  |Z|X|C|V|

Usage
-----

```
// Initialize chip8 with default options
chip8.initialize({
    ctx: document.querySelector('canvas').getContext('2d')
});

// Load ROM file asynchronously...
chip8.loadROM('roms/Puzzle.ch8', function () {
    // ... and run emulator when ROM loading is done
    chip8.run();
});
```

Browser Support
---------------
This emulator should work in any decent web browser supporting typed arrays and canvas element.

License
-------
The MIT License (MIT). Copyright (c) 2014 mirz (mirz.hq@gmail.com)

Resources
---------
* http://mattmik.com/chip8.html
* http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
* http://chip8.com
* http://en.wikipedia.org/wiki/CHIP-8
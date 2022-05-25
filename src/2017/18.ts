import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let sndCard = new SoundCard(input);

    return sndCard.runUntilRecover();
}

export function part2(input: string[]): number | string {
    logger.enable();
    return SoundCard.runComms(input);
}

interface Op {
    type: string;
    params: (string | number)[];
}

class SoundCard {
    static runComms(instrs: string[]): number {
        let snd1 = new this(instrs);
        let snd2 = new this(instrs);

        snd1.registers['p'] = 0;
        snd2.registers['p'] = 1;

        let gen1 = snd1.step(snd2);
        let gen2 = snd2.step(snd1);
        var res1: IteratorResult<number, number> = gen1.next();
        var res2: IteratorResult<number, number> = gen2.next();
        var val1 = res1.value;
        var val2 = res2.value;
        while (true) {
            if ((res1.done && res2.done) || (val1 !== 0 && val2 !== 0)) {
                return val2;
            }
            if (!res1.done) res1 = gen1.next();
            logger.log(1, snd1.outqueue);
            if (!res2.done) res2 = gen2.next();
            logger.log(2, snd2.outqueue);

            val1 = res1.value;
            val2 = res2.value;
        }
    }

    registers: { [key: string]: number } = {};
    instrs: Op[] = [];
    pos: number = 0;
    lastSound: number = 0;

    outqueue: number[] = [];
    sendCount: number = 0;
    name: number = -1;
    paused: boolean = false;
    halted: boolean = false;

    constructor(instrs: string[]) {
        for (let instr of instrs) {
            let split = instr.split(' ');
            let type = <string>split.shift();
            let params: (string | number)[] = [];
            for (let i = 0; i < split.length; i++) {
                if (Number.isNaN(Number(split[i]))) {
                    this.registers[split[i]] = 0;
                    params.push(split[i]);
                } else {
                    params.push(+split[i]);
                }
            }
            this.instrs.push({ type, params });
        }
    }

    *stepP1(): Generator<number, number, number> {
        while (true) {
            if (this.pos < 0 || this.pos >= this.instrs.length) {
                return 0;
            }
            let { type, params } = this.instrs[this.pos];

            switch (type) {
                case 'snd':
                    if (typeof params[0] == 'string') {
                        this.lastSound = this.registers[params[0]];
                    } else {
                        this.lastSound = params[0];
                    }
                    break;
                case 'set':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] = this.registers[params[1]];
                    } else {
                        this.registers[params[0]] = params[1];
                    }
                    break;
                case 'add':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] += this.registers[params[1]];
                    } else {
                        this.registers[params[0]] += params[1];
                    }
                    break;
                case 'mul':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] *= this.registers[params[1]];
                    } else {
                        this.registers[params[0]] *= params[1];
                    }
                    break;
                case 'mod':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] = this.registers[params[0]] % this.registers[params[1]];
                    } else {
                        this.registers[params[0]] = this.registers[params[0]] % params[1];
                    }
                    break;
                case 'rcv':
                    if (this.registers[params[0]] !== 0) {
                        yield this.lastSound;
                    }
                    break;
                case 'jgz':
                    if (this.registers[params[0]] > 0) {
                        if (typeof params[1] == 'string') {
                            this.pos += (this.registers[params[1]] - 1);
                        } else {
                            this.pos += (params[1] - 1);
                        }
                    }
                    break;
            }
            // logger.log(this.registers);
            this.pos += 1;
        }
    }

    *step(other: SoundCard): Generator<number, number, number> {
        this.name = this.registers['p'];
        while (true) {
            if (this.pos < 0 || this.pos >= this.instrs.length) {
                this.halted = true;
                this.paused = false;
                return this.sendCount;
            }
            let { type, params } = this.instrs[this.pos];

            switch (type) {
                case 'snd':
                    if (typeof params[0] == 'string') {
                        this.outqueue.push(this.registers[params[0]]);
                    } else {
                        this.outqueue.push(params[0]);
                    }
                    // logger.log(`(${this.registers['p']}) Sent Message`);
                    // logger.log(`(${this.name}) i: ${this.registers['i']}`);
                    // if (this.registers['f'] == 0) {
                    //     logger.log(`(${this.name}) receiving...`);
                    //     logger.log(`(${other.outqueue})`);
                    // }
                    // logger.log(`Is (${other.name}) Halted: ${other.halted}`);
                    // logger.log(`Is (${other.name}) Paused: ${other.paused}`);
                    this.sendCount++;
                    break;
                case 'set':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] = this.registers[params[1]];
                    } else {
                        this.registers[params[0]] = params[1];
                    }
                    break;
                case 'add':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] += this.registers[params[1]];
                    } else {
                        this.registers[params[0]] += params[1];
                    }
                    break;
                case 'mul':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] *= this.registers[params[1]];
                    } else {
                        this.registers[params[0]] *= params[1];
                    }
                    break;
                case 'mod':
                    if (typeof params[1] == 'string') {
                        this.registers[params[0]] = this.registers[params[0]] % this.registers[params[1]];
                    } else {
                        this.registers[params[0]] = this.registers[params[0]] % params[1];
                    }
                    break;
                case 'rcv':
                    // if (this.registers[params[0]] !== 0) {
                    //     yield this.lastSound;
                    // }
                    // if (true) {
                    //     logger.log(this.name, this.outqueue);
                    //     return this.sendCount;
                    // }
                    let otherVal = other.outqueue.shift();
                    if (otherVal == undefined) {
                        // logger.log(`(${this.name}) Paused`);
                        this.paused = true;
                        yield 0;
                        this.paused = false;
                        // logger.log(`(${this.name}) Resuming...`);
                        if (other.outqueue.length == 0) {
                            this.halted = true;
                            this.paused = false;
                            return this.sendCount;
                        }

                    } else {
                        this.registers[params[0]] = <number>otherVal;
                    }
                    break;
                case 'jgz':
                    if (this.registers[params[0]] > 0) {
                        if (typeof params[1] == 'string') {
                            this.pos += (this.registers[params[1]] - 1);
                        } else {
                            this.pos += (params[1] - 1);
                        }
                    }
                    break;
            }
            // logger.log(this.registers);
            this.pos += 1;
        }
    }

    runUntilRecover(): number {
        return this.stepP1().next().value;
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`],
    part2: [`snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d`, `snd 1
snd 2
snd p
rcv a
rcv b
rcv c`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };